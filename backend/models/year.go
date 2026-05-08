package models

import "time"

type Year struct {
	Year      int       `gorm:"primaryKey" json:"year"`
	CreatedAt time.Time `json:"created_at"`
}
