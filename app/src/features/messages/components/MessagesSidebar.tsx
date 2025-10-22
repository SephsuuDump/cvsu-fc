import { Input } from "@/components/ui/input";
import { messagesMock } from "../../../../public/mock/messages";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { formatMessageDateTime } from "@/lib/helper";

export function MessageSidebar({ className }: {
    className?: string;
}) {
    return (
        <section className={`${className} stack-md bg-slate-50 shadow-sm border-r-1 border-r-slate-300 p-4`}>
            <div className="text-lg font-bold scale-x-110 origin-left">Chat</div>
            <Input
                placeholder="Search for a member" 
            />
            <div className="row-lg">
                <div className="text-[10px]">COORDINATOR</div>
                <div className="text-[10px]">MEMBER</div>
            </div>
            {messagesMock.map((item, i) => (
                <button className="row-md p-3 bg-slate-100 shadow-sm rounded-sm" key={i}>
                    <AppAvatar
                        fallback={ `${item.sender.firstName[0]}${item.sender.lastName[0]}` }
                    />
                    <div className="flex flex-col text-start">
                        <div className="text-sm font-bold">{ `${item.sender.firstName} ${item.sender.lastName}` }</div>
                        <div className="text-xs text-gray -mt-0.5">{ item.content }</div>
                    </div>
                    <div className="text-[10px]">{ formatMessageDateTime(item.createdAt) }</div>
                </button>
            ))}
        </section>
    )
}