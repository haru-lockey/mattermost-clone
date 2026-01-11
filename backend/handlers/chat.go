package handlers

import (
	"chat-app/database"
	"chat-app/models"
	"encoding/json"
	"net/http"
	"sync"
	"fmt"

	"github.com/gorilla/websocket"
)

type ChatPayload struct {
	Action string 		 `json:"action"`
	Message models.Message `json:"message"`
}

var (
	clients  = make(map[*websocket.Conn]bool)
	mu       sync.Mutex
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
)

// 過去のメッセージをDBから取り出す
func GetMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var msgs []models.Message
	database.DB.Find(&msgs)
	json.NewEncoder(w).Encode(msgs)
}

// リアルタイム通信（糸電話）の処理
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	ws, _ := upgrader.Upgrade(w, r, nil)
	defer ws.Close()

	mu.Lock()
	clients[ws] = true
	mu.Unlock()

	 for {
	 	var payload ChatPayload
	 	err := ws.ReadJSON(&payload)
		if err != nil {
			mu.Lock()
			delete(clients, ws)
			mu.Unlock()
			break
		}

		// データベースに保存（これで消えなくなる！）
		// database.DB.Create(&msg)
		fmt.Printf("受信したアクション: %s, メッセージID: %d\n", payload.Action, payload.Message.ID)
		switch payload.Action {
		case "send":
			database.DB.Create(&payload.Message)
		case "edit":
			database.DB.Model(&models.Message{}).Where("id = ?", payload.Message.ID).Updates(models.Message{Content: payload.Message.Content})
		case "delete":
			database.DB.Delete(&models.Message{}, payload.Message.ID)
		}

		// 全員に送る
		mu.Lock()
		for client := range clients {
			client.WriteJSON(payload)
		}
		mu.Unlock()
	}
}
