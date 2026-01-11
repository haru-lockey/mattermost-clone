package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"chat-app/models"
)

// 2. 使う道具をここで1つずつ準備（2回書かない！）
var (
	DB       *gorm.DB
)

func InitDB() {
	dsn := "host=localhost user=postgres password=pass dbname=postgres port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("データベースに接続できませんでした")
	}
	DB.AutoMigrate(&models.Message{})
}
