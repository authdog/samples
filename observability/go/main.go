package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

const replayTolerance = 5 * time.Minute

func verifySignature(rawBody []byte, header, secret string) bool {
	if header == "" {
		return false
	}
	parts := map[string]string{}
	for _, kv := range strings.Split(header, ",") {
		k, v, ok := strings.Cut(strings.TrimSpace(kv), "=")
		if ok {
			parts[k] = v
		}
	}
	t, v1 := parts["t"], parts["v1"]
	if t == "" || v1 == "" {
		return false
	}
	ts, err := strconv.ParseInt(t, 10, 64)
	if err != nil {
		return false
	}
	age := time.Since(time.Unix(ts, 0))
	if age < 0 {
		age = -age
	}
	if age > replayTolerance {
		return false
	}

	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write([]byte(t + "."))
	_, _ = mac.Write(rawBody)
	expected := mac.Sum(nil)
	received, err := hex.DecodeString(v1)
	if err != nil || len(received) != len(expected) {
		return false
	}
	return subtle.ConstantTimeCompare(expected, received) == 1
}

func listEvents(tenantID, environmentID, apiToken string) (map[string]any, error) {
	url := fmt.Sprintf(
		"https://api.authdog.com/v1/tenants/%s/environments/%s/events?limit=20",
		tenantID, environmentID,
	)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+apiToken)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	if res.StatusCode >= 300 {
		return nil, fmt.Errorf("Events API %d: %s", res.StatusCode, body)
	}
	var parsed map[string]any
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}
	events := parsed["data"]
	if events == nil {
		events = parsed["events"]
	}
	if events == nil {
		events = []any{}
	}
	var after any
	if meta, ok := parsed["list_metadata"].(map[string]any); ok {
		after = meta["after"]
	}
	count := 0
	switch e := events.(type) {
	case []any:
		count = len(e)
	}
	return map[string]any{"count": count, "after": after, "events": events}, nil
}

func main() {
	apiToken := os.Getenv("AUTHDOG_API_TOKEN")
	webhookSecret := os.Getenv("AUTHDOG_WEBHOOK_SECRET")
	tenantID := os.Getenv("AUTHDOG_TENANT_ID")
	environmentID := os.Getenv("AUTHDOG_ENVIRONMENT_ID")
	if apiToken == "" || webhookSecret == "" || tenantID == "" || environmentID == "" {
		log.Fatal("Set AUTHDOG_API_TOKEN, AUTHDOG_WEBHOOK_SECRET, AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID")
	}

	var mu sync.Mutex
	seen := map[string]struct{}{}

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"sample":    "authdog observability on go",
			"endpoints": []string{"POST /webhooks/authdog", "GET /events"},
		})
	})

	r.POST("/webhooks/authdog", func(c *gin.Context) {
		raw, err := c.GetRawData()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid body"})
			return
		}
		if !verifySignature(raw, c.GetHeader("X-Authdog-Signature"), webhookSecret) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid signature"})
			return
		}
		deliveryID := c.GetHeader("X-Authdog-Delivery-Id")
		if deliveryID != "" {
			mu.Lock()
			if _, ok := seen[deliveryID]; ok {
				mu.Unlock()
				c.JSON(http.StatusOK, gin.H{"ok": true, "duplicate": true})
				return
			}
			seen[deliveryID] = struct{}{}
			mu.Unlock()
		}
		var event map[string]any
		if err := json.Unmarshal(raw, &event); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		log.Printf("[authdog] %s (%s): %v", c.GetHeader("X-Authdog-Event-Type"), deliveryID, event["id"])
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	r.GET("/events", func(c *gin.Context) {
		page, err := listEvents(tenantID, environmentID, apiToken)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, page)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
