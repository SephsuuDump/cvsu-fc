import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { Sidebar, SidebarContent } from "./sidebar";
import { Skeleton } from "./skeleton";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

interface LoaderProps {
    onProcess: boolean;
    label: string;
    loadingLabel: string;
}

export function FormLoader({ onProcess, label, loadingLabel }: LoaderProps) {
    if (onProcess) return <><LoaderCircle className="w-4 h-4 text-white animate-spin" />{ loadingLabel }</>
    else return <>{ label }</>
}

export function CvSULoading({ className }: { className?: string }) {
    return(
        <section className={ `relative flex-center w-full h-screen ${className}` }>
            <div className="animate-fade-loop">
                <Image
                    src="/images/cvsu_logo.png"
                    alt="CvSU Logo"
                    width={80}
                    height={80}
                />
                <div className="text-center font-semibold">CvSU FC</div>
            </div>
        </section>
    );
}

export function SectionLoading({ className }: {
    className?: string
}) {
    return (
        <section className={ `relative flex-center w-full h-[50vh] ${className}` }>
            <div className="animate-fade-loop">
                <Image
                    src="/images/cvsu_logo.png"
                    alt="CvSU Logo"
                    width={80}
                    height={80}
                />
                <div className="text-center font-semibold">CvSU FC</div>
            </div>
        </section>
    )
}

export function ModalLoader() {
    return (
        <Dialog open>
            <DialogContent className="flex-center h-100 reveal">
                <DialogTitle></DialogTitle>
                <div className="animate-fade-loop">
                    <Image
                        src="/images/cvsu_logo.png"
                        alt="CvSU Logo"
                        width={80}
                        height={80}
                    />
                    <div className="text-center font-semibold">CvSU FC</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function SidebarLoading() {
    return(
        <section>
            <Sidebar
                variant="floating" 
                collapsible="icon"
            >
                <SidebarContent 
                    className="rounded-md p-4"
                    style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
                >
            
                    <Skeleton className="w-40 mx-auto h-12 bg-orange-100" />
                    <Skeleton className="w-full mt-2 h-8 bg-orange-100" />
                    <Skeleton className="w-full h-8 bg-orange-100" />
                    <Skeleton className="w-full h-8 bg-orange-100" />
                    <Skeleton className="w-full h-8 bg-orange-100" />
                </SidebarContent>
                
            </Sidebar>
        </section>
    );
}