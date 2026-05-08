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
	r.Run(":" + cfg.Port)
}
