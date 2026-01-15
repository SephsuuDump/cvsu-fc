"use client"

import { AppAvatar } from "@/components/shared/AppAvatar";
import { MessageSidebar } from "./components/MessagesSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { MessagesService } from "@/services/messages.service";
import { getEcho } from "@/lib/echo";
import { CvSULoading } from "@/components/ui/loader";

export function MessagesPage() {
    const { claims, loading: authLoading } = useAuth();

    const [conversations, setConversations] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedConv, setSelectedConv] = useState<any>(null);

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");

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
    console.log(conversations);
    

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
        <section className="flex h-[95vh] reveal">

            {/* ✅ SIDEBAR */}
            <MessageSidebar 
                className="w-80"
                conversations={conversations}
                selectedConv={selectedConv}
                setSelectedConv={setSelectedConv}
                setShowModal={setShowModal}
                claims={claims}
            />

            {/* ✅ CHAT AREA */}
            <div className="relative w-full flex flex-col bg-slate-50 shadow-sm border-l border-slate-300">

                {/* ✅ HEADER */}
                <div className="flex items-center gap-2 shadow-sm py-3 px-4 bg-white">
                    {selectedConv && (
                        <>
                            <AppAvatar fallback="JB" />
                            <div className="font-bold">
                                {selectedConv.participants
                                    .filter((p: any) => p.id !== claims.id)
                                    .map((p: any) => (
                                        <span key={p.id}>
                                            {p.first_name} {p.last_name}
                                        </span>
                                    ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ✅ MESSAGES */}
                <div
                    id="messages-container"
                    className="flex-1 overflow-y-auto p-4 space-y-3 pb-12"
                >
                    {!selectedConv ? (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            Select a conversation
                        </div>
                    ) : (
                        messages.map((msg: any) => (
                            <div
                                key={msg.id}
                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                    msg.sender?.id === claims.id
                                        ? "bg-darkgreen text-white ml-auto"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {msg.message}
                                <div className="text-[10px] opacity-60 mt-1">
                                    {new Date(msg.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* ✅ INPUT */}
                <div className="absolute bottom-0 w-full flex bg-white border-t">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border-0 rounded-none m-0"
                        placeholder="Type your message here"
                    />
                    <Button 
                        onClick={sendMessage}
                        className="!bg-darkgreen rounded-none"
                        size="sm"
                    >
                        <Send /> Send
                    </Button>
                </div>

            </div>

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
        </section>
    )
}