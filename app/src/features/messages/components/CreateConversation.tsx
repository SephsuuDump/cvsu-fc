"use client"

import { AppInput } from "@/components/shared/AppInput";
import { ModalTitle } from "@/components/shared/ModalTitle";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ModalLoader } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { updateField } from "@/lib/helper";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";

export function CreateConversation({open, setOpen, setConversations, setSelectedConv}: {
    open: boolean;
    setOpen: (i: boolean) => void;
    setConversations: any
    setSelectedConv: any
}) {
    const { claims, loading: authLoading } = useAuth();

    const { data: users, loading } = useFetchData<User>(
            UserService.getUserByCampusCollege,
            [claims, claims.campus.id],
            [claims.role === "ADMIN" ? 0 : claims.campus.id, 0]
        );
    
        const { search, setSearch, filteredItems: filteredUsers } = useSearchFilter<Partial<User>>(
            users,
            ["first_name", "last_name"]
        );

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
    
        setConversations((prev: any) => [newConv, ...prev]);
        setSelectedConv(newConv);
        setOpen(false);
    };

    if (authLoading || loading) return <ModalLoader />
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-y-auto max-h-10/11">
                <ModalTitle label="Start a conversation" />

                <div className="">
                    <AppInput 
                        placeholder="Search for a faculy member"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {filteredUsers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No new users available
                        </div>
                    ) : (
                        filteredUsers.map((u: any) => (
                            <button
                                key={u.id}
                                type="button"
                                onClick={() => {
                                    startConversation(u.id);
                                    setOpen(false);
                                }}
                                className="w-full text-left p-4 border-b hover:bg-gray-100"
                            >
                                <div className="font-semibold">
                                    {u.first_name} {u.last_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Click to start conversation
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>

    )
}