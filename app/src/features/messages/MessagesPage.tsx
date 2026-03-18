"use client";

import { AppAvatar } from "@/components/shared/AppAvatar";
import { MessageSidebar } from "./components/MessagesSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, File as FileIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessagesService } from "@/services/messages.service";
import { getEcho } from "@/lib/echo";
import { CvSULoading } from "@/components/ui/loader";
import { CreateConversation } from "./components/CreateConversation";

export function MessagesPage() {
  const { claims, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(false);

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const resolveMessageDate = (message: any) => {
    const candidates = [
      message?.created_at,
      message?.createdAt,
      message?.sent_at,
      message?.sentAt,
      message?.timestamp,
      message?.date,
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;

      if (candidate instanceof Date && !Number.isNaN(candidate.getTime())) {
        return candidate.toISOString();
      }

      if (typeof candidate === "number") {
        const parsed = new Date(candidate);
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
      }

      if (typeof candidate === "string" && candidate.trim()) {
        const parsed = new Date(candidate);
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
      }
    }

    return null;
  };

  const normalizeAttachments = (message: any, fallback?: any) => {
    const source =
      message?.attachments ??
      message?.files ??
      message?.file_attachments ??
      fallback?.attachments ??
      [];

    return Array.isArray(source) ? source : [];
  };

  const normalizeMessage = (message: any, fallback?: any) => {
    if (typeof message === "string" || typeof message === "number") {
      return {
        ...fallback,
        id: fallback?.id ?? `temp-${Date.now()}`,
        message: String(message),
        sender: fallback?.sender ?? { id: claims.id },
        created_at: resolveMessageDate(fallback) ?? new Date().toISOString(),
        attachments: normalizeAttachments(fallback),
        _optimistic: false,
      };
    }

    if (!message && fallback) return fallback;

    const normalizedSender =
      message?.sender ??
      message?.user ??
      fallback?.sender ?? {
        id:
          message?.sender_id ??
          message?.user_id ??
          fallback?.sender?.id ??
          claims.id,
      };

    return {
      ...fallback,
      ...message,
      id: message?.id ?? message?.message_id ?? fallback?.id ?? `temp-${Date.now()}`,
      message:
        message?.message ??
        message?.content ??
        message?.body ??
        message?.text ??
        fallback?.message ??
        null,
      sender: normalizedSender,
      created_at:
        resolveMessageDate(message) ??
        resolveMessageDate(fallback) ??
        new Date().toISOString(),
      attachments: normalizeAttachments(message, fallback),
      _optimistic: message?._optimistic ?? false,
    };
  };

  const extractMessagePayload = (payload: any) => {
    if (!payload) return null;
    if (typeof payload === "string" || typeof payload === "number") return payload;
    if (typeof payload !== "object") return null;

    if (payload.message && typeof payload.message === "object") return payload.message;
    if (payload.data && typeof payload.data === "object") return payload.data;

    return payload;
  };

  const hasRenderableContent = (message: any) => {
    if (!message) return false;

    const content =
      typeof message === "string" || typeof message === "number"
        ? String(message).trim()
        : String(
            message?.message ??
              message?.content ??
              message?.body ??
              message?.text ??
              ""
          ).trim();

    return Boolean(content) || normalizeAttachments(message).length > 0;
  };

  const isSameMessage = (left: any, right: any) => {
    if (!left || !right) return false;

    if (String(left.id) === String(right.id)) return true;

    const leftSenderId = left?.sender?.id ?? left?.sender_id ?? left?.user_id;
    const rightSenderId = right?.sender?.id ?? right?.sender_id ?? right?.user_id;

    const leftDate = resolveMessageDate(left);
    const rightDate = resolveMessageDate(right);

    const sameSender = String(leftSenderId ?? "") === String(rightSenderId ?? "");
    const sameBody = String(left?.message ?? "") === String(right?.message ?? "");
    const sameAttachmentCount =
      normalizeAttachments(left).length === normalizeAttachments(right).length;

    if (!sameSender || !sameBody || !sameAttachmentCount) return false;
    if (leftDate && rightDate && leftDate === rightDate) return true;

    const leftTime = leftDate ? new Date(leftDate).getTime() : null;
    const rightTime = rightDate ? new Date(rightDate).getTime() : null;
    const hasTempMessage =
      Boolean(left?._optimistic) ||
      Boolean(right?._optimistic) ||
      String(left?.id ?? "").startsWith("temp-") ||
      String(right?.id ?? "").startsWith("temp-");

    if (
      hasTempMessage &&
      leftTime !== null &&
      rightTime !== null &&
      Math.abs(leftTime - rightTime) <= 60_000
    ) {
      return true;
    }

    return false;
  };

  const getDisplayTime = (message: any) => {
    const resolved = resolveMessageDate(message);
    if (!resolved) return "Just now";

    const date = new Date(resolved);
    if (Number.isNaN(date.getTime())) return "Just now";

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getAttachmentUrl = (f: any) => {
    const directUrl = f?.url;

    if (
      typeof directUrl === "string" &&
      (directUrl.startsWith("blob:") || directUrl.startsWith("data:"))
    ) {
      return directUrl;
    }

    if (typeof directUrl === "string" && /^https?:\/\//i.test(directUrl)) {
      return directUrl;
    }

    const path =
      typeof directUrl === "string" && directUrl.length > 0
        ? directUrl
        : typeof f?.file_path === "string"
          ? f.file_path
          : null;

    if (!path) return null;

    const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
    const tail = String(path).replace(/^\/+/, "");

    return `${base}/${tail}`;
  };

  const getAttachmentName = (f: any) => {
    const direct =
      f?.file_name ||
      f?.original_name ||
      f?.filename ||
      f?.name ||
      f?.client_name ||
      null;

    if (direct) return String(direct);

    const fromPath = f?.file_path ? String(f.file_path).split("/").pop() : null;
    if (fromPath) return fromPath;

    const fromUrl =
      f?.url || f?.public_url || f?.signed_url
        ? String(f?.url || f?.public_url || f?.signed_url)
            .split("?")[0]
            .split("/")
            .pop()
        : null;

    return fromUrl || "Attachment";
  };

  const isImageAttachment = (f: any) => {
    if (String(f?.file_type || "").toLowerCase() === "image") return true;

    const mime =
      f?.mime_type ||
      f?.file_mime_type ||
      f?.content_type ||
      f?.type ||
      "";

    if (typeof mime === "string" && mime.toLowerCase().startsWith("image/")) {
      return true;
    }

    const name = getAttachmentName(f);
    const url = getAttachmentUrl(f) || "";
    const probe = `${name} ${url}`.toLowerCase();

    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(probe);
  };

  useEffect(() => {
    if (!claims?.id) return;

    (async () => {
      const data = await MessagesService.getConversationsByUser(claims.id);
      setConversations(data ?? []);
      setSelectedConv(data?.[0] ?? null);
    })();
  }, [claims?.id]);

  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      return;
    }

    (async () => {
      const data = await MessagesService.getMessagesByUser(selectedConv.id);
      const messageList = Array.isArray(data)
        ? data
        : Array.isArray(data?.messages)
          ? data.messages
          : Array.isArray(data?.data)
            ? data.data
            : [];

      shouldScrollRef.current = true;
      setMessages(messageList.map((message: any) => normalizeMessage(message)));
    })();
  }, [selectedConv]);

  useLayoutEffect(() => {
    if (!shouldScrollRef.current) return;

    requestAnimationFrame(() => {
      scrollToBottom();
      shouldScrollRef.current = false;
    });
  }, [selectedConv?.id, messages.length]);

  const sendMessage = async () => {
    if (!selectedConv) return;

    const messageText = input.trim();
    const pendingFiles = [...files];

    if (!messageText && pendingFiles.length === 0) return;

    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      id: tempId,
      message: messageText || null,
      sender: { id: claims.id },
      created_at: new Date().toISOString(),
      attachments: pendingFiles.map((file) => ({
        file_name: file.name,
        file_type: file.type.startsWith("image") ? "image" : "file",
        file_path: null,
        url: URL.createObjectURL(file),
        file_size: file.size,
        mime_type: file.type,
      })),
      _optimistic: true,
    };

    shouldScrollRef.current = true;
    setMessages((prev) => [...prev, tempMessage]);
    setInput("");
    setFiles([]);

    const fd = new FormData();
    fd.append("conversation_id", String(selectedConv.id));
    if (messageText) fd.append("message", messageText);
    pendingFiles.forEach((file) => fd.append("files[]", file));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: fd,
      });

      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status}`);
      }

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const serverPayload = extractMessagePayload(data);

      if (serverPayload && (hasRenderableContent(serverPayload) || serverPayload?.id)) {
        const normalizedResponse = normalizeMessage(serverPayload, {
          ...tempMessage,
          _optimistic: false,
        });

        setMessages((prev) =>
          prev.map((message) => (message.id === tempId ? normalizedResponse : message))
        );
      } else {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === tempId ? { ...message, _optimistic: false } : message
          )
        );
      }
    } catch {
      setMessages((prev) => prev.filter((message) => message.id !== tempId));
    }
  };

  useEffect(() => {
    const convId = selectedConv?.id;
    if (!convId) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `conversation.${convId}`;
    const echoChannel = echo.private(channelName);

    const pusher = (echo as any).connector?.pusher;
    const pusherChannel = pusher?.channel(`private-${channelName}`);

    const onSubSucceeded = () =>
      console.log("SUBSCRIBED TO", `private-${channelName}`);
    const onSubError = (err: any) =>
      console.error("SUBSCRIPTION ERROR", `private-${channelName}`, err);

    pusherChannel?.bind?.("pusher:subscription_succeeded", onSubSucceeded);
    pusherChannel?.bind?.("pusher:subscription_error", onSubError);

    const onMessageSent = (payload: any) => {
      const incomingPayload = extractMessagePayload(payload);
      if (!incomingPayload || !hasRenderableContent(incomingPayload)) return;

      const incoming = normalizeMessage(incomingPayload);

      shouldScrollRef.current = true;

      setMessages((prev) => {
        const exists = prev.some(
          (message) => !message._optimistic && isSameMessage(message, incoming)
        );

        const withoutMatchedPending = prev.filter(
          (message) => !(message._optimistic && isSameMessage(message, incoming))
        );

        if (exists) return withoutMatchedPending;

        return [...withoutMatchedPending, incoming];
      });

      setTimeout(scrollToBottom, 20);
    };

    echoChannel.listen("MessageSent", onMessageSent);
    echoChannel.listen(".MessageSent", onMessageSent);

    return () => {
      pusherChannel?.unbind?.("pusher:subscription_succeeded", onSubSucceeded);
      pusherChannel?.unbind?.("pusher:subscription_error", onSubError);

      echoChannel.stopListening("MessageSent");
      echoChannel.stopListening(".MessageSent");
      echo.leave(channelName);
    };
  }, [selectedConv?.id]);

  if (authLoading) return <CvSULoading />;

  return (
    <section className="flex h-[95vh]">
      <MessageSidebar
        className="w-80"
        conversations={conversations}
        selectedConv={selectedConv}
        setSelectedConv={setSelectedConv}
        setShowModal={setShowModal}
        claims={claims}
      />

      <div className="relative w-full flex flex-col border-l bg-slate-50">
        <div className="flex items-center gap-2 border-b bg-white px-4 py-3">
          {selectedConv && (
            <>
              <AppAvatar fallback="JB" />
              <span className="font-bold">
                {selectedConv.participants
                  .filter((participant: any) => participant.id !== claims.id)
                  .map(
                    (participant: any) =>
                      `${participant.first_name} ${participant.last_name}`
                  )
                  .join(", ")}
              </span>
            </>
          )}
        </div>

        <div
          ref={containerRef}
          id="messages-container"
          className="flex-1 space-y-3 overflow-y-auto p-4 pb-28"
        >
          {messages.map((msg: any) => {
            const isMine = msg.sender?.id === claims.id;
            const hasText = Boolean(msg.message);

            return (
              <div
                key={msg.id}
                className={`max-w-sm overflow-hidden rounded-lg ${
                  isMine ? "ml-auto bg-darkgreen text-white" : "bg-gray-200"
                }`}
              >
                {msg.attachments?.map((attachment: any, index: number) => {
                  const fileUrl = getAttachmentUrl(attachment);
                  const fileName = getAttachmentName(attachment);
                  const isImage = isImageAttachment(attachment);

                  if (!fileUrl) {
                    return (
                      <div key={index} className="px-3 py-2 text-sm opacity-80">
                        <span className="inline-flex items-center gap-2">
                          <FileIcon className="h-4 w-4" />
                          {fileName}
                        </span>
                      </div>
                    );
                  }

                  return isImage ? (
                    <img
                      key={index}
                      src={fileUrl}
                      alt={fileName}
                      className="max-h-[320px] w-full cursor-pointer object-contain bg-black"
                      onClick={() => setPreviewImage(fileUrl)}
                      onLoad={() => {
                        if (shouldScrollRef.current) scrollToBottom();
                      }}
                    />
                  ) : (
                    <a
                      key={index}
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-3 py-2 text-sm underline"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        {fileName}
                      </span>
                    </a>
                  );
                })}

                {hasText && (
                  <div className="whitespace-pre-wrap px-3 py-2 text-sm">
                    {msg.message}
                  </div>
                )}

                <div className="px-3 py-1 text-right text-[10px] opacity-70">
                  {getDisplayTime(msg)}
                </div>
              </div>
            );
          })}
        </div>

        {files.length > 0 && (
          <div className="flex gap-3 overflow-x-auto border-t bg-white p-2">
            {files.map((file, index) => {
              const isImage = file.type.startsWith("image");
              const previewUrl = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="relative flex h-24 w-24 items-center justify-center rounded-md border bg-gray-100"
                >
                  {isImage ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="h-full w-full cursor-pointer rounded-md object-cover"
                      onClick={() => setPreviewImage(previewUrl)}
                    />
                  ) : (
                    <div className="flex flex-col items-center px-1 text-center text-xs">
                      <span className="text-2xl">
                        <FileIcon />
                      </span>
                      <span className="w-full truncate">{file.name}</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
                    }
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="absolute bottom-0 flex w-full items-center border-t bg-white px-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) =>
              setFiles(e.target.files ? Array.from(e.target.files) : [])
            }
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
            className="flex-1 rounded-none border-0"
            placeholder="Type your message here"
          />

          <Button onClick={sendMessage} className="!bg-darkgreen" size="sm">
            <Send /> Send
          </Button>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] max-w-full rounded object-contain"
            />

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-black"
            >
              x
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <CreateConversation
          open={showModal}
          setOpen={setShowModal}
          setConversations={setConversations}
          setSelectedConv={setSelectedConv}
        />
      )}
    </section>
  );
}
