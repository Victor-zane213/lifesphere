package database

import (
	"lifesphere-backend/models"
)

func Migrate() {
	DB.AutoMigrate(
		&models.Quote{},
		&models.DailyLog{},
		&models.DailyReflection{},
		&models.Todo{},
		&models.Investment{},
		&models.Reading{},
		&models.ReflectionPost{},
		&models.Year{},
	)
}
