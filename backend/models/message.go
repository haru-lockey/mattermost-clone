package models 

import "gorm.io/gorm"

// 1. データの構造（机の引き出しの設計図）
type Message struct {
	gorm.Model
	User    string `json:"user"`
	Content string `json:"content"`
	Channel string `json:"channel"`
}
