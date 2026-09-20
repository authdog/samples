package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
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

func eventSubject(event map[string]any) string {
	data, _ := event["data"].(map[string]any)
	if data == nil {
		return ""
	}
	if user, ok := data["user"].(map[string]any); ok {
		if id, ok := user["id"].(string); ok {
			return id
		}
	}
	if subject, ok := data["subject"].(string); ok {
		return subject
	}
	return ""
}

func main() {
	webhookSecret := os.Getenv("AUTHDOG_WEBHOOK_SECRET")
	if webhookSecret == "" {
		log.Fatal("Set AUTHDOG_WEBHOOK_SECRET")
	}

	var mu sync.Mutex
	seen := map[string]struct{}{}
	marked := map[string]struct{}{}

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"sample": "authdog lidar on go",
			"endpoints": []string{
				"POST /webhooks/authdog",
				"GET /sensitive (X-Demo-User)",
				"POST /step-up/complete (X-Demo-User)",
			},
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
		if subject := eventSubject(event); subject != "" {
			mu.Lock()
			marked[subject] = struct{}{}
			mu.Unlock()
			log.Printf("[authdog] %s: marked %s for step-up", c.GetHeader("X-Authdog-Event-Type"), subject)
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	r.GET("/sensitive", func(c *gin.Context) {
		subject := c.GetHeader("X-Demo-User")
		if subject == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthenticated"})
			return
		}
		mu.Lock()
		_, needs := marked[subject]
		mu.Unlock()
		if needs {
			c.JSON(http.StatusPreconditionRequired, gin.H{
				"error":     "Step-up required",
				"challenge": "/step-up/complete",
				"reason":    "A security-relevant event was recorded for this subject.",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{"secret": "the sensitive resource"})
	})

	r.POST("/step-up/complete", func(c *gin.Context) {
		subject := c.GetHeader("X-Demo-User")
		if subject == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthenticated"})
			return
		}
		mu.Lock()
		delete(marked, subject)
		mu.Unlock()
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
