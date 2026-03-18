import { Input } from "@/components/ui/input";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { formatMessageDateTime } from "@/lib/helper";
import { SectionLoading } from "@/components/ui/loader";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConversationSummary } from "../types";

export function MessageSidebar({
    claims,
    className,
    conversations,
    selectedConv,
    setSelectedConv,
    setShowModal,
    onConversationSelect,
}: {
    className?: string;
    claims: Claim;
    conversations: ConversationSummary[];
    selectedConv: ConversationSummary | null;
    setSelectedConv: (conversation: ConversationSummary | null) => void;
    setShowModal: (open: boolean) => void;
    onConversationSelect?: () => void;
}) {
    const [search, setSearch] = useState("");

    const filteredConversations = useMemo(() => {
        if (!Array.isArray(conversations)) return [];
        if (!search.trim()) return conversations;

        return conversations.filter((item) => {
            const partner = item.participants?.find(
                (p) => p.id !== claims.id
            );

            if (!partner) return false;

            const fullName = `${partner.first_name} ${partner.last_name}`.toLowerCase();

            return fullName.includes(search.toLowerCase());
        });
    }, [search, conversations, claims.id]);

    const items = Array.isArray(filteredConversations) ? filteredConversations : [];
    const isLoading = !Array.isArray(conversations);

    return (
        <section className={`${className} flex min-h-0 flex-col gap-3 bg-slate-50 p-3 shadow-sm md:sticky md:top-0 md:h-full md:self-stretch md:border-r md:border-r-slate-300 md:p-4`}>
            <div className="flex-center-y justify-between">
                <div className="text-lg font-bold scale-x-110 origin-left">Chat</div>
                <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-darkgreen text-white flex items-center justify-center"
                    onClick={() => setShowModal(true)}
                >
                    <Plus className="text-white w-4 h-4" />
                </button>
            </div>
            <Input
                placeholder="Search for a member" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {isLoading && <SectionLoading />}

            <div className="scrollbar-custom flex-1 space-y-2 overflow-y-auto pr-1">
                {!isLoading && items.length === 0 && (
                    <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                        No conversations found.
                    </div>
                )}

                {items.map((item, i) => {
                    const partner = item.participants?.find(
                        (p) => p.id !== claims.id
                    );
                    const partnerName = partner
                        ? [partner.first_name, partner.last_name].filter(Boolean).join(" ")
                        : "Unknown member";
                    const partnerFallback = `${partner?.first_name?.[0] ?? ""}${partner?.last_name?.[0] ?? ""}` || "FC";

                    return (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedConv(item);
                                onConversationSelect?.();
                            }}
                            className={`row-md w-full items-start rounded-md p-3 text-left shadow-sm transition-colors ${
                                selectedConv?.id === item.id
                                    ? "bg-gray-200"
                                    : "bg-slate-100 hover:bg-slate-200/70"
                            }`}
                            key={i}
                        >
                            <AppAvatar fallback={partnerFallback} />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-bold">{partnerName}</div>
                                {/* <div className="-mt-0.5 truncate text-xs text-gray">{item.content || "No messages yet"}</div> */}
                            </div>
                            <div className="hidden shrink-0 text-[10px] text-gray-500 sm:block">
                                {formatMessageDateTime(item.created_at)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    )
}
