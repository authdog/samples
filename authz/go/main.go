package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	authdog "github.com/authdog/web-sdk/packages/go"
)

const requiredPermission = "invoices:read"

func permissionsOf(user any) []string {
	m, ok := user.(map[string]any)
	if !ok {
		return nil
	}
	raw, ok := m["permissions"]
	if !ok {
		return nil
	}
	switch list := raw.(type) {
	case []any:
		out := make([]string, 0, len(list))
		for _, item := range list {
			if s, ok := item.(string); ok {
				out = append(out, s)
			}
		}
		return out
	case []string:
		return list
	default:
		return nil
	}
}

func requirePermission(required string) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := authdog.FromGin(c)
		var user any
		if ctx != nil {
			user = ctx.User
		}
		for _, permission := range permissionsOf(user) {
			if permission == required {
				c.Next()
				return
			}
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error":   "Forbidden",
			"missing": []string{required},
		})
	}
}

func main() {
	publicKey := os.Getenv("PK_AUTHDOG")
	if publicKey == "" {
		log.Fatal("Set PK_AUTHDOG to your environment public key (pk_...)")
	}

	ad, err := authdog.New(authdog.Config{PublicKey: publicKey})
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()
	r.Use(ad.AttachSession())

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"sample": "authdog authz on go",
			"hint":   "GET /invoices with an authdog-session cookie or Authorization: Bearer <token>",
		})
	})

	r.GET("/invoices", ad.RequireAuth(), requirePermission(requiredPermission), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"invoices": []gin.H{
				{"id": "inv_001", "amount": 1200, "status": "paid"},
				{"id": "inv_002", "amount": 340, "status": "open"},
			},
		})
	})

	r.GET("/logout", ad.Logout)

	if err := r.Run(":3000"); err != nil {
		log.Fatal(err)
	}
}
