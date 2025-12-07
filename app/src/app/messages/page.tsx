"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { CvSULoading, SectionLoading } from "@/components/ui/loader";
import { getEcho } from "@/lib/echo";
import { MessagesService } from "@/services/messages.service";

export default function MessagingPage() {
  const { claims, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedConv, setSelectedConv] = useState<any>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  // --------------------------
  // LOAD CONVERSATIONS + USERS
  // --------------------------
  useEffect(() => {
    if (!claims?.id) return;

    const load = async () => {
      const conversations = await MessagesService.getConversationsByUser(
        claims.id
      );

      const u = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/get-all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((r) => r.json());

      setConversations(conversations);
      setUsers(u);
    };

    load();
  }, [claims?.id]);

  // --------------------------
  // LOAD MESSAGES
  // --------------------------
  useEffect(() => {
    if (!selectedConv) return;

    const loadMessages = async () => {
      const data = await MessagesService.getMessagesByUser(selectedConv.id);
      setMessages(data);

      setTimeout(() => {
        const container = document.getElementById("messages-container");
        if (container) container.scrollTop = container.scrollHeight;
      }, 10);
    };

    loadMessages();
  }, [selectedConv]);

  // --------------------------
  // SEND MESSAGE
  // --------------------------
  const sendMessage = async () => {
    if (!input.trim() || !selectedConv) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        conversation_id: selectedConv.id,
        message: input,
      }),
    });

    setInput("");
  };

  // --------------------------
  // ✅ REAL-TIME LISTENER
  // --------------------------
  useEffect(() => {
    if (!selectedConv) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `conversation.${selectedConv.id}`;

    const channel = echo.channel(channelName);

    channel.listen(".MessageSent", (payload: any) => {
      setMessages((prev) => [...prev, payload]);

      setTimeout(() => {
        const container = document.getElementById("messages-container");
        if (container) container.scrollTop = container.scrollHeight;
      }, 20);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [selectedConv]);

  // --------------------------
  // ✅ FILTER USERS WITHOUT CONVERSATIONS
  // --------------------------
  const filteredUsers = users.filter(
    (u) =>
      !conversations.some((c) =>
        c.participants?.some((p: any) => p.id === u.id)
      ) && u.id !== claims?.id
  );

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        });
    }

    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
    });
    };


  // --------------------------
  // ✅ START CONVERSATION
  // --------------------------
  const startConversation = async (userId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/start-conversation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ receiver_id: userId }),
      }
    ).then((r) => r.json());

    const newConv = res.conversation;

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConv(newConv);
    setShowModal(false);
  };

  if (authLoading) return <CvSULoading />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT SIDE */}
      <div className="w-80 bg-white border-r shadow-sm flex flex-col">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-bold">Messages</h2>
          <button
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!conversations && <SectionLoading />}
          {conversations.map((c: any) => {
            const partner = c.participants?.find(
              (p: any) => p.id !== claims.id
            );

            return (
              <div
                key={c.id}
                onClick={() => setSelectedConv(c)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  selectedConv?.id === c.id ? "bg-gray-200" : ""
                }`}
              >
                <div className="font-semibold">
                  {partner?.first_name} {partner?.last_name}
                </div>
                <div className="flex items-center justify-between gap-2">
            {/* LEFT: Last Message */}
                <div className="text-xs text-gray-500 truncate max-w-[70%]">
                    {c.last_message?.sender?.first_name
                    ? `${c.last_message.sender.first_name}: ${c.last_message.message}`
                        : "No messages yet"}
                    </div>

                    {/* RIGHT: Time or Date */}
                    <div className="text-[10px] text-gray-400 whitespace-nowrap">
                        {c.last_message?.created_at
                        ? formatLastMessageTime(c.last_message.created_at)
                        : ""}
                    </div>
                </div>  

              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col bg-white">
        {!selectedConv ? (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="p-4 border-b font-semibold bg-gray-50">
              {selectedConv.participants
                .filter((p: any) => p.id !== claims.id)
                .map((p: any) => (
                  <span key={p.id}>
                    {p.first_name} {p.last_name}
                  </span>
                ))}
            </div>

            <div
              id="messages-container"
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.sender?.id === claims.id
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.message}
                  <div className="text-[10px] opacity-60 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* ✅ NEW MESSAGE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b font-semibold flex justify-between">
              <span>Start New Conversation</span>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No new users available
                </div>
              ) : (
                filteredUsers.map((u: any) => (
                  <div
                    key={u.id}
                    onClick={() => startConversation(u.id)}
                    className="p-4 border-b cursor-pointer hover:bg-gray-100"
                  >
                    <div className="font-semibold">
                      {u.first_name} {u.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Click to start conversation
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
