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

export function PapiverseLoading({ className }: { className?: string }) {
    return(
        <section className={ `relative w-full h-screen ${className}` }>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
                <Image
                    src="/images/papiverse_logo.png"
                    alt="Papiverse Logo"
                    width={200}
                    height={200}
                />
                <div className="text-lg text-center">LOADING</div>
            </div>
        </section>
    );
}

export function ModalLoader() {
    return (
        <Dialog open>
            <DialogContent>
                <DialogTitle></DialogTitle>
                <div className="h-100 animate-bounce">
                    <Image
                        src="/images/papiverse_logo.png"
                        alt="Papiverse Logo"
                        width={200}
                        height={200}
                    />
                    <div className="text-lg text-center">LOADING</div>
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