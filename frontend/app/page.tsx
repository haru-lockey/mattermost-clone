"use client";
import { useEffect, useState, useRef } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { Message } from "@/app/types/Message";

export default function ChatPage() {
  // データ管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentChannel, setCurrentChannel] = useState("town-square");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  type ChatPayload = {
    action: "send" | "edit" | "delete";
    message: Message;
  };

  // --- 1. DBから履歴を取得する (HTTP通信) ---
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      if (data) setMessages(data);
    } catch (err) {
      console.error("履歴の取得に失敗しました:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. リアルタイム通信の開始 (WebSocket) ---
  useEffect(() => {
    if (!isLoggedIn) return;

    // まずDBから過去分を読み込む
    fetchHistory();

    // 次にWebSocketを繋ぐ
    socketRef.current = new WebSocket("ws://localhost:8080/ws");

    socketRef.current.onmessage = (event) => {
      const payload: ChatPayload = JSON.parse(event.data);
      setMessages((prev) => {
        switch (payload.action) {
          case "send":
            return [...prev, payload.message];
          case "edit":
            return prev.map((msg) =>
              msg.ID === payload.message.ID ? { ...msg, content: payload.message.content } : msg
            );
          case "delete":
            return prev.filter((msg) => msg.ID !== payload.message.ID);
          default:
            return prev;
        }
      });
    };

    return () => {
      socketRef.current?.close();
    };
  }, [isLoggedIn]);

  // --- 3. メッセージ送信処理 ---
  const sendMessage = (text: string) => {
    if (!text || !socketRef.current) return;

    const msg = {
      user: username,
      content: text,
      channel: currentChannel
    };

    socketRef.current.send(JSON.stringify(msg));
  };

  // メッセージ編集
  const editMessage = (id: number, newText: string) => {
    if (!socketRef.current) return;

    const payload = {
      action: "edit",
      message: { ID: id, content: newText } as Message
    };
    socketRef.current?.send(JSON.stringify(payload));
  };

  //  メッセージ削除
  const deleteMessage = (id: number) => {
    if (!socketRef.current) return;

    const payload = {
      action: "delete",
      message: { ID: id } as Message
    };
    socketRef.current?.send(JSON.stringify(payload));
  };

  // ログインしていない時はログイン画面を表示
  if (!isLoggedIn) {
    return (
      <Login
        username={username}
        setUsername={setUsername}
        onLogin={() => username && setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* --- サイドバー --- */}
      <Sidebar
        username={username}
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
      />

      {/* --- メインエリア --- */}
      <ChatWindow
        currentChannel={currentChannel}
        messages={messages.filter((m: any) => m.channel === currentChannel)}
        onSendMessage={sendMessage}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
      />
    </div>
  );
}
