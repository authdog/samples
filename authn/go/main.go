package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	authdog "github.com/authdog/web-sdk/packages/go"
)

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
			"sample": "authdog authn on go",
			"hint":   "GET /me with an authdog-session cookie or Authorization: Bearer <token>",
		})
	})

	r.GET("/me", ad.RequireAuth(), func(c *gin.Context) {
		c.JSON(http.StatusOK, authdog.FromGin(c).User)
	})

	r.GET("/logout", ad.Logout)

	if err := r.Run(":3000"); err != nil {
		log.Fatal(err)
	}
}
