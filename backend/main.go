package main

import (
	 "chat-app/database"
	 "chat-app/handlers"
	"fmt"
	"net/http"
)

func main() {
	 database.InitDB()

	 http.HandleFunc("/ws", handlers.HandleConnections)
	 http.HandleFunc("/api/messages", handlers.GetMessages)

	fmt.Println("Server starting at :8080")
	http.ListenAndServe(":8080", nil)
}


