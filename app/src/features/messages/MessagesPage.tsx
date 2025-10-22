import { AppAvatar } from "@/components/shared/AppAvatar";
import { MessageSidebar } from "./components/MessagesSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function MessagesPage() {
    return (
        <section className="flex h-[95vh] reveal">
            <MessageSidebar className="w-80" />
            <div className="relative w-full stack-md bg-slate-50 shadow-sm border-l-1 border-l-slate-300">
                <div className="flex-center gap-2 shadow-sm py-3">
                    <AppAvatar fallback="JB" />
                    <div className="font-bold">Joseph Bataller</div>
                </div>
                <div className="absolute flex-center bottom-0 w-full bg-white">
                    <Input 
                        className="border-0 rounded-none m-0"
                        placeholder="Type your message here" 
                    /> 
                    <Button 
                        className="!bg-darkgreen rounded-none"
                        size="sm"
                    >
                        <Send /> Send
                    </Button>
                </div>
            </div>
        </section>
    )
}