"use client";
import { useState } from "react";
import { Message } from "@/app/types/Message";

type ChatWindowProps = {
  currentChannel: string;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onEditMessage: (id: number, newText: string) => void;
  onDeleteMessage: (id: number) => void;
};

export default function ChatWindow({ currentChannel, messages, onSendMessage, onEditMessage, onDeleteMessage }: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText(""); // 送信後に空にする
  };

  const handleEditStart = (m: Message) => {
    setEditingMessageId(m.ID);
    setEditingText(m.content);
  }

  const handleEditSave = (id: number) => {
    onEditMessage(id, editingText);
    setEditingMessageId(null);
    setEditingText("");
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* ヘッダー */}
      <div className="h-16 border-b flex items-center px-6 font-bold text-lg shadow-sm">
        # {currentChannel}
      </div>

      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-400 italic text-center mt-10">
            まだメッセージがありません。最初のメッセージを送りましょう！
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.ID} className="group p-2 border-b">
              {editingMessageId === m.ID ? (
                // 編集モードの表示
                <div className="flex gap-2">
                  <input
                    className="border rounded flex-1 px-2 py-1"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => handleEditSave(m.ID)} className="text-green-600">保存</button>
                  <button onClick={() => setEditingMessageId(null)} className="text-gray-400">取消</button>
                </div>
              ) : (
                // 通常モードの表示
                <div>
                  <div className="flex justify-between">
                    <span className="font-bold">{m.user}</span>
                    <div className="hidden group-hover:flex gap-2">
                      <button onClick={() => handleEditStart(m)} className="text-blue-500 text-xs">編集</button>
                      <button onClick={() => onDeleteMessage(m.ID)} className="text-red-500 text-xs">削除</button>
                    </div>
                  </div>
                  <p>{m.content}</p>
                </div>
              )}
            </div>
          )))}
      </div>

      {/* 入力エリア */}
      <div className="p-4 border-t bg-gray-50">
        <div className="max-w-4xl mx-auto flex gap-2 bg-white border rounded-lg p-2 shadow-sm focus-within:ring-2 ring-blue-500">
          <input
            className="flex-1 outline-none px-2 text-black"
            placeholder={`# ${currentChannel} へのメッセージ`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-blue-600 text-white px-4 py-1 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
