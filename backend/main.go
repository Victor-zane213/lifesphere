package main

import (
	"lifesphere-backend/config"
	"lifesphere-backend/database"
	"lifesphere-backend/routes"
)

func main() {
	cfg := config.Load()

	database.Init(cfg.DBPath)
	database.Migrate()

	r := routes.Setup()
	r.Static("/assets", "./public/assets")
	r.StaticFile("/", "./public/index.html")
	r.NoRoute(func(c *gin.Context) {
		c.File("./public/index.html")
	})
	r.Run(":" + cfg.Port)
}
