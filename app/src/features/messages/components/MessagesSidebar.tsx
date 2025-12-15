import { Input } from "@/components/ui/input";
import { messagesMock } from "../../../../public/mock/messages";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { formatMessageDateTime } from "@/lib/helper";
import { SectionLoading } from "@/components/ui/loader";
import { Plus } from "lucide-react";

export function MessageSidebar({ claims, className, conversations, selectedConv, setSelectedConv, setShowModal }: {
    className?: string;
    claims: Claim
    conversations: any
    selectedConv: any
    setSelectedConv: any
    setShowModal: any

}) {
    return (
        <section className={`${className} stack-md bg-slate-50 shadow-sm border-r-1 border-r-slate-300 p-4`}>
            <div className="flex-center-y justify-between">
                <div className="text-lg font-bold scale-x-110 origin-left">Chat</div>
                <button
                    className="w-8 h-8 rounded-full bg-darkgreen text-white flex items-center justify-center"
                    onClick={() => setShowModal(true)}
                >
                    <Plus className="text-white w-4 h-4" />
                </button>
            </div>
            <Input
                placeholder="Search for a member" 
            />
            <div className="row-lg">
                <div className="text-[10px]">COORDINATOR</div>
                <div className="text-[10px]">MEMBER</div>
            </div>
            {!conversations && <SectionLoading />}
            {conversations.map((item: any, i: number) => {
                const partner = item.participants?.find(
                    (p: any) => p.id !== claims.id
            );
                return (
                    <button 
                        onClick={() => setSelectedConv(item)}
                        className={`row-md p-3 bg-slate-100 shadow-sm rounded-sm ${selectedConv?.id === item.id ? "bg-gray-200" : ""}`}
                        key={i}
                    >
                        <AppAvatar
                            fallback={ `${partner.first_name[0]}${partner.last_name[0]}` }
                        />
                        <div className="flex flex-col text-start">
                            <div className="text-sm font-bold">{partner?.first_name} {partner?.last_name}</div>
                            <div className="text-xs text-gray -mt-0.5">{ item.content }</div>
                        </div>
                        <div className="text-[10px]">{ formatMessageDateTime(item.created_at) }</div>
                    </button>
                )
                
            })}
        </section>
    )
}