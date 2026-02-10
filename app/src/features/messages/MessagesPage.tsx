"use client";

import { AppAvatar } from "@/components/shared/AppAvatar";
import { MessageSidebar } from "./components/MessagesSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, File } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessagesService } from "@/services/messages.service";
import { getEcho } from "@/lib/echo";
import { CvSULoading } from "@/components/ui/loader";
import { useCrudState } from "@/hooks/use-crud-state";
import { CreateConversation } from "./components/CreateConversation";

export function MessagesPage() {
    const { claims, loading: authLoading } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // When true, we force scroll after the next render
    const shouldScrollRef = useRef(false);

    const scrollToBottom = () => {
        const el = containerRef.current;
        if (!el) return;

        el.scrollTop = el.scrollHeight;
    };

	const {open, setOpen} = useCrudState();

    // Load conversations
    useEffect(() => {
        if (!claims?.id) return;

        (async () => {
            const data = await MessagesService.getConversationsByUser(claims.id);
            setConversations(data ?? []);
        })();
    }, [claims?.id]);

    // Load messages when conversation changes (and mark that we should scroll)
    useEffect(() => {
        if (!selectedConv?.id) return;

        let cancelled = false;

        // reset local UI state for new convo
        setMessages([]);
        setInput("");
        setFiles([]);
        shouldScrollRef.current = true;

        (async () => {
            try {
                const data = await MessagesService.getMessagesByUser(selectedConv.id);
                if (cancelled) return;

                shouldScrollRef.current = true;
                setMessages(data ?? []);
            } catch {
                // ignore
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [selectedConv?.id]);

    // ✅ The reliable auto-scroll: run after DOM updates
    useLayoutEffect(() => {
        if (!selectedConv?.id) return;
        if (!shouldScrollRef.current) return;

        // wait for paint, then scroll
        requestAnimationFrame(() => {
            scrollToBottom();
        });

        shouldScrollRef.current = false;
    }, [messages.length, selectedConv?.id]);

    const sendMessage = async () => {
        if (!selectedConv) return;
        if (!input.trim() && files.length === 0) return;

        const tempId = `temp-${Date.now()}`;

        const tempMessage = {
            id: tempId,
            message: input || null,
            sender: { id: claims.id },
            created_at: new Date().toISOString(),
            attachments: files.map((f) => ({
                file_name: f.name,
                file_type: f.type.startsWith("image") ? "image" : "file",
                file_path: null,
                url: URL.createObjectURL(f),
                file_size: f.size,
            })),
            _optimistic: true,
        };

        // mark for scroll and optimistically append
        shouldScrollRef.current = true;
        setMessages((prev) => [...prev, tempMessage]);

        setInput("");
        setFiles([]);

        const fd = new FormData();
        fd.append("conversation_id", selectedConv.id);
        if (input.trim()) fd.append("message", input);
        files.forEach((f) => fd.append("files[]", f));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: fd,
            });

            const data = await res.json();

            shouldScrollRef.current = true;
            setMessages((prev) => prev.map((m) => (m.id === tempId ? data.message : m)));
        } catch {
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
    };

    // Live updates via Echo
    useEffect(() => {
        if (!selectedConv?.id) return;

        const echo = getEcho();
        if (!echo) return;

        const channel = `conversation.${selectedConv.id}`;

        echo.channel(channel).listen(".MessageSent", (payload: any) => {
            shouldScrollRef.current = true;

            setMessages((prev) => {
                const withoutTemp = prev.filter((m) => !m._optimistic && m.id !== payload.id);
                return [...withoutTemp, payload];
            });
        });

        return () => {
            echo.leave(channel);
        };
    }, [selectedConv?.id]);

    if (authLoading) return <CvSULoading />;

    return (
        <section className="flex h-[95vh]">
            <MessageSidebar
                setShowModal={setOpen}
                className="w-80"
                conversations={conversations}
                selectedConv={selectedConv}
                setSelectedConv={setSelectedConv}
                claims={claims}
            />

            <div className="relative w-full flex flex-col bg-slate-50 border-l">
                <div className="flex items-center gap-2 px-4 py-3 bg-white border-b">
                    {selectedConv && (
                        <>
                            <AppAvatar fallback="JB" />
                            <span className="font-bold">
                                {selectedConv.participants
                                    .filter((p: any) => p.id !== claims.id)
                                    .map((p: any) => `${p.first_name} ${p.last_name}`)}
                            </span>
                        </>
                    )}
                </div>

                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-3 pb-12"
                >
                    {messages.map((msg: any) => {
                        const isMine = msg.sender?.id === claims.id;
                        const hasText = Boolean(msg.message);

                        return (
                            <div
                                key={msg.id}
                                className={`max-w-sm rounded-lg overflow-hidden ${
                                    isMine ? "ml-auto bg-darkgreen text-white" : "bg-gray-200"
                                }`}
                            >
                                {msg.attachments?.map((f: any, i: number) => {
                                    const fileUrl =
                                        f.url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}${f.file_path}`;

                                    return f.file_type === "image" ? (
                                        <img
                                            key={i}
                                            src={fileUrl}
                                            alt={f.file_name}
                                            className="w-full max-h-[320px] object-contain bg-black cursor-pointer"
                                            onClick={() => setPreviewImage(fileUrl)}
                                            onLoad={() => {
                                                // images load after render and can change height -> keep bottom
                                                scrollToBottom();
                                            }}
                                        />
                                    ) : (
                                        <a
                                            key={i}
                                            href={fileUrl}
                                            target="_blank"
                                            className="block px-3 py-2 underline text-sm"
                                        >
                                            <File /> {f.file_name}
                                        </a>
                                    );
                                })}

                                {hasText && (
                                    <div className="px-3 py-2 text-sm whitespace-pre-wrap">
                                        {msg.message}
                                    </div>
                                )}

                                <div className="px-3 py-1 text-[10px] opacity-70 text-right">
                                    {new Date(msg.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {files.length > 0 && (
                    <div className="flex gap-3 p-2 border-t bg-white overflow-x-auto">
                        {files.map((file, i) => {
                            const isImage = file.type.startsWith("image");
                            const previewUrl = URL.createObjectURL(file);

                            return (
                                <div
                                    key={i}
                                    className="relative w-24 h-24 border rounded-md bg-gray-100 flex items-center justify-center"
                                >
                                    {isImage ? (
                                        <img
                                            src={previewUrl}
                                            alt={file.name}
                                            className="w-full h-full object-cover rounded-md cursor-pointer"
                                            onClick={() => setPreviewImage(previewUrl)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-center text-xs px-1">
                                            <span className="text-2xl">
                                                <File />
                                            </span>
                                            <span className="truncate w-full">{file.name}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="absolute bottom-0 w-full flex items-center bg-white border-t px-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip />
                    </Button>

                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        className="border-0 rounded-none flex-1"
                        placeholder="Type your message here"
                    />

                    <Button onClick={sendMessage} className="!bg-darkgreen" size="sm">
                        <Send /> Send
                    </Button>
                </div>
            </div>

            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-[90vw] max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain rounded"
                        />

                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

			{open && (
				<CreateConversation 
					open={open}
					setOpen={setOpen}
					setConversations={setConversations}
					setSelectedConv={setSelectedConv}
				/>
			)}
        </section>
    );
}
