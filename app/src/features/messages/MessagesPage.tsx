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
import { useCrudState } from "@/hooks/use-crud-state";
import { CreateConversation } from "./components/CreateConversation";

export function MessagesPage() {
	const { claims, loading: authLoading } = useAuth();

	const [conversations, setConversations] = useState<any[]>([]);
	const [selectedConv, setSelectedConv] = useState<any>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [input, setInput] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	// when true, scroll after next DOM update
	const shouldScrollRef = useRef(false);

	const { open, setOpen } = useCrudState();

	const scrollToBottom = () => {
		const el = containerRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	};

	// ✅ helpers (from FIRST file) — correct file/image detection + filename fallback
	const getAttachmentUrl = (f: any) => {
		return (
			f?.url ||
			(f?.file_path
				? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${f.file_path}`
				: null)
		);
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
		// 1) backend provided explicit type
		if (String(f?.file_type || "").toLowerCase() === "image") return true;

		// 2) mime fields from backend OR optimistic temp attachments
		const mime =
			f?.mime_type ||
			f?.file_mime_type ||
			f?.content_type ||
			f?.type ||
			"";

		if (typeof mime === "string" && mime.toLowerCase().startsWith("image/"))
			return true;

		// 3) fallback by extension (from name or url/path)
		const name = getAttachmentName(f);
		const url = getAttachmentUrl(f) || "";
		const probe = `${name} ${url}`.toLowerCase();

		return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(probe);
	};

	// ✅ fetching (from FIRST file)
	useEffect(() => {
		if (!claims?.id) return;

		(async () => {
			const data = await MessagesService.getConversationsByUser(claims.id);
			setConversations(data ?? []);
			setSelectedConv(data[0] ?? null);
		})();
	}, [claims?.id]);

	useEffect(() => {
		if (!selectedConv) return;

		(async () => {
			const data = await MessagesService.getMessagesByUser(selectedConv.id);
			setMessages(data ?? []);
		})();

		shouldScrollRef.current = true;
		setTimeout(() => {
			scrollToBottom();
		}, 20);
	}, [selectedConv]);

	useLayoutEffect(() => {
		if (!selectedConv?.id) return;
		if (!shouldScrollRef.current) return;

		requestAnimationFrame(() => scrollToBottom());
		shouldScrollRef.current = false;
	}, [selectedConv?.id, messages.length]);

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
				mime_type: f.type,
			})),
			_optimistic: true,
		};

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
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: fd,
			});

			const data = await res.json();

			shouldScrollRef.current = true;
			setMessages((prev) =>
				prev.map((m) => (m.id === tempId ? data.message : m))
			);
		} catch {
			setMessages((prev) => prev.filter((m) => m.id !== tempId));
		}
	};

	useEffect(() => {
		const convId = selectedConv?.id;
		if (!convId) return;

		const echo = getEcho();
		if (!echo) return;

		const channelName = `conversation.${convId}`;
		const echoChannel = echo.channel(channelName);

		const pusher = (echo as any).connector?.pusher;
		const pusherChannel = pusher?.channel(`private-${channelName}`);

		const onSubSucceeded = () => console.log("✅ SUBSCRIBED TO", channelName);
		const onSubError = (err: any) =>
			console.error("❌ SUBSCRIPTION ERROR", channelName, err);

		pusherChannel?.bind?.("pusher:subscription_succeeded", onSubSucceeded);
		pusherChannel?.bind?.("pusher:subscription_error", onSubError);

		const onMessageSent = (payload: any) => {
			console.log("📩 MessageSent received", payload);

			const incoming = payload?.message ?? payload;

			shouldScrollRef.current = true;

			setMessages((prev) => {
			const withoutOptimistic = prev.filter((m) => !m._optimistic);

			const exists = withoutOptimistic.some(
				(m) => String(m.id) === String(incoming?.id)
			);
			if (exists) return withoutOptimistic;

			return [...withoutOptimistic, incoming];
			});

			setTimeout(scrollToBottom, 20);
		};

		// ✅ IMPORTANT: usually no dot
		echoChannel.listen("MessageSent", onMessageSent);

		return () => {
			pusherChannel?.unbind?.("pusher:subscription_succeeded", onSubSucceeded);
			pusherChannel?.unbind?.("pusher:subscription_error", onSubError);

			echoChannel.stopListening("MessageSent");
			echo.leave(channelName); // more reliable than leaveChannel for many setups
			console.log("👋 left:", channelName);
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
					id="messages-container"
					className="flex-1 overflow-y-auto p-4 space-y-3 pb-28"
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
									const fileUrl = getAttachmentUrl(f);
									const fileName = getAttachmentName(f);
									const isImg = isImageAttachment(f);

									if (!fileUrl) {
										return (
											<div key={i} className="px-3 py-2 text-sm opacity-80">
												<span className="inline-flex items-center gap-2">
													<FileIcon className="w-4 h-4" />
													{fileName}
												</span>
											</div>
										);
									}

									return isImg ? (
										<img
											key={i}
											src={fileUrl}
											alt={fileName}
											className="w-full max-h-[320px] object-contain bg-black cursor-pointer"
											onClick={() => setPreviewImage(fileUrl)}
											onLoad={() => {
												// images load after render and can change height -> keep bottom
												if (shouldScrollRef.current) scrollToBottom();
											}}
										/>
									) : (
										<a
											key={i}
											href={fileUrl}
											target="_blank"
											className="block px-3 py-2 underline text-sm"
											rel="noreferrer"
										>
											<span className="inline-flex items-center gap-2">
												<FileIcon className="w-4 h-4" /> {fileName}
											</span>
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
												<FileIcon />
											</span>
											<span className="truncate w-full">{file.name}</span>
										</div>
									)}

									<button
										onClick={() =>
											setFiles((prev) => prev.filter((_, idx) => idx !== i))
										}
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
