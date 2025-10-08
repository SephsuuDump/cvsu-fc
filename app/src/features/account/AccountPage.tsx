import { AppAvatar } from "@/components/shared/AppAvatar";
import { formatCustomDate } from "@/lib/helper";
import { Contact, GraduationCap, Mail, Phone, UserRoundCheck } from "lucide-react";

export function AccountPage() {
    return (
        <section className="mx-auto max-w-[1024px] stack-md">
            <div className="bg-slate-50">
                <div 
                    className="flex-center pt-4 pb-8 rounded-md shadow-sm"
                    style={{
                        background: "linear-gradient(90deg, hsla(117, 39%, 46%, 1) 0%, hsla(125, 74%, 29%, 1) 100%)",
                    }}
                >
                    <div className="text-slate-50 font-bold text-4xl">CvSU Trece Campus</div>
                </div>
                <div className="flex-center-y gap-2 -mt-12 rounded-md shadow-sm pb-2">
                    <AppAvatar 
                        className="w-30 h-30 ml-4 border-5 border-slate-100"
                        fallbackClassName="bg-green-900 text-4xl text-slate-50"
                    />
                    <div className="mt-10">
                        <div className="uppercase text-lg font-semibold">Joseph Emanuel O. Bataller</div>
                        <div className="text-gray text-sm">MEMBER</div>
                    </div>
                </div>
            </div>
            <div className="stack-md w-fit bg-slate-50 p-4 rounded-md shadow-sm">
                <div className="flex-center-y gap-2 text-sm tracking-wider">
                    <Phone className="w-4 h-4 inline-block"/> +63 947 545 33783
                </div>
                <div className="flex-center-y gap-2 text-sm tracking-wider">
                    <Mail className="w-4 h-4 inline-block"/> main.josephemanuel.bataller@cvsu.edu.ph
                </div>
                <div className="flex-center-y gap-2 text-sm tracking-wider">
                    <GraduationCap className="w-4 h-4 inline-block"/> Graduated @CvSU 
                </div>
                <div className="flex-center-y gap-2 text-sm tracking-wider">
                    <UserRoundCheck className="w-4 h-4 inline-block"/> { formatCustomDate('2025-09-09') }
                </div>
            </div>
        </section>
    )
}