import Image from "next/image";
import { Separator } from "../ui/separator";

export function AppHeader({ label, className }: {
    label: string;
    className?: string;
}) {
    return (
        <section>
            <div className={`${className} flex items-center gap-2`}>
                <Image
                    src="/images/cvsu_logo.png"
                    // className="max-md:hidden"
                    alt="CvSU Logo"
                    width={40}
                    height={40}
                />
                <div className="text-xl font-semibold">{ label }</div>
                
            </div>
            <Separator className="bg-slate-300 h-1 my-2 px-4"/>
        </section>
    )
}