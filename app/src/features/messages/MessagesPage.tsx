import { Input } from "@/components/ui/input";
import { messagesMock } from "../../../public/mock/messages";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { formatCustomDate, fromatMessageDateTime } from "@/lib/helper";

export function MessagesPage() {
    return (
        <section className="stack-md">
            <div className="stack-md bg-slate-50 shadow-sm border-r-1 border-r-slate-300 p-4 w-fit">
                <div className="text-lg font-bold scale-x-110 origin-left">Chat</div>
                <Input
                    placeholder="Search for a member" 
                />
                <div className="row-lg">
                    <div className="text-[10px]">COORDINATOR</div>
                    <div className="text-[10px]">MEMBER</div>
                </div>
                {messagesMock.map((item, i) => (
                    <div className="row-md p-3 bg-slate-100 shadow-sm rounded-sm">
                        <AppAvatar
                            fallback={ `${item.sender.firstName[0]}${item.sender.lastName[0]}` }
                        />
                        <div>
                            <div className="text-sm font-bold">{ `${item.sender.firstName} ${item.sender.lastName}` }</div>
                            <div className="text-xs text-gray -mt-0.5">{ item.content }</div>
                        </div>
                        <div className="text-[10px]">{ fromatMessageDateTime(item.createdAt) }</div>
                    </div>
                ))}
            </div>
        </section>
    )
}