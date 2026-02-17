"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { ChevronsUpDown, CircleUserRound, LogOut, Menu } from "lucide-react";
import { adminRoute, coordinatorRoute, memberRoute } from "@/lib/page-route";
import { AuthPage } from "@/features/auth/AuthPage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AppAvatar } from "./AppAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

export function AppSidebar() {
    const { claims, loading } = useAuth();
    const router = useRouter();
    const pathName = usePathname();
    const { open } = useSidebar();
    const isMobile = useIsMobile();

    const [show, setShow] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!loading && (!claims || !claims.role)) {
            router.replace("/auth");
        }
    }, [loading, claims, router]);

    async function handleLogout() {
        await AuthService.deleteCookie();
        toast.success("Logging out. Please wait patiently.", { duration: Infinity });
        localStorage.removeItem("token");
        window.location.href = "/auth";
    }

    if (!mounted) return null;
    if (pathName === "/auth") return null;

    let route;
    if (!claims) return <AuthPage />;
    if (claims.role === "ADMIN") route = adminRoute;
    if (claims.role === "COORDINATOR") route = coordinatorRoute;
    if (claims.role === "MEMBER" || claims.role === "JOB ORDER") route = memberRoute;

    // ✅ MOBILE NAV (same pattern as your Papiverse sidebar)
    if (isMobile) {
        return (
            <Sheet>
                <SheetTitle
                    className="fixed top-0 z-50 bg-white rounded-md shadow w-full px-4 h-14 bg-cover bg-center"
                    style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
                >
                    <div className="relative flex-center-y my-auto py-4">
                        <Link
                            href="/auth/login"
                            className=""
                        >
                            <div className="flex-center-y gap-2">
                                <Image
                                    src="/images/cvsu_logo.png"
                                    alt="CvSU Logo"
                                    width={40}
                                    height={40}
                                    className="-mt-1"
                                />
                            
                                <div className="font-semibold text-darkgreen -mt-1">
                                    <span className="font-bold text-black text-lg">CvSU</span> FACULTY CONNECT
                                </div>
                              
                            </div>
                        </Link>

                        <SheetTrigger className="h-full ms-auto">
                            <Menu />
                        </SheetTrigger>
                    </div>
                </SheetTitle>

                <SheetContent side="left" className="p-0">
                    <Sidebar collapsible="none">
                        <SidebarContent
                            className="bg-center bg-cover"
                            style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
                        >
                            <Link href="/" className="block text-center">
                                <Image
                                    src="/images/cvsu_logo.png"
                                    alt="CvSU Logo"
                                    width={60}
                                    height={60}
                                    className="mx-auto mt-4"
                                />
                                <div className="font-bold text-lg">CvSU</div>
                                <div className="text-xs font-semibold text-darkgreen -mt-1">
                                    FACULTY CONNECT
                                </div>
                            </Link>

                            <SidebarMenu className="mt-4">
                                {route?.map((item, i) => (
                                    <SidebarMenuItem key={i}>
                                        <Link href={item.href} className="w-full">
                                            <SidebarMenuButton className="flex gap-2 pl-4">
                                                <item.icon className="w-4 h-4" />
                                                {item.title}
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>

                            <SidebarFooter className="mt-auto mb-1">
                                <DropdownFooter
                                    open={show}
                                    sidebarOpen={true}
                                    setShow={setShow}
                                    claims={claims}
                                    handleLogout={handleLogout}
                                />
                            </SidebarFooter>
                        </SidebarContent>
                    </Sidebar>
                </SheetContent>
            </Sheet>
        );
    }

    // ✅ DESKTOP SIDEBAR (your existing one)
    return (
        <Sidebar collapsible="icon">
            <SidebarTrigger className="rounded-full shadow-6xl bg-white absolute z-50 right-[-28px] top-[47%] -translate-x-1/2 -translate-y-1/2" />
            <SidebarContent
                className="rounded-md bg-cover border-r-green-100 border-0"
                style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
            >
                <Link className="text-center aspect-auto" href="/">
                    <Image
                        src="/images/cvsu_logo.png"
                        alt="CvSU Logo"
                        width={open ? 50 : 30}
                        height={open ? 50 : 30}
                        className="mx-auto mt-4"
                    />
                    <div className={`font-bold text-lg ${!open && "text-sm"}`}>CvSU</div>
                    <div
                        className={`text-xs font-semibold text-darkgreen -mt-1 ${
                            !open && "text-[8px]"
                        }`}
                    >
                        FACULTY CONNECT
                    </div>
                </Link>

                <SidebarMenu className={`mt-4 ${!open && "flex-center"}`}>
                    {route?.map((item, i) => (
                        <Link
                            href={item.href}
                            className={`group/collapsible w-full hover:bg-slate-50 rounded-md ${
                                !open && "flex-center"
                            }`}
                            key={i}
                        >
                            <SidebarMenuItem>
                                <SidebarMenuButton className="flex gap-2 pl-4">
                                    <item.icon className="w-4 h-4" />
                                    {item.title}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Link>
                    ))}
                </SidebarMenu>

                <SidebarFooter className="mt-auto mb-1">
                    <DropdownFooter
                        open={show}
                        sidebarOpen={open}
                        setShow={setShow}
                        claims={claims}
                        handleLogout={handleLogout}
                    />
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
}

function DropdownFooter({
    open,
    sidebarOpen,
    setShow,
    claims,
    handleLogout,
}: {
    open: boolean;
    sidebarOpen: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
    claims: Claim;
    handleLogout: () => void;
}) {
    const isMobile = useIsMobile();

    return (
        <DropdownMenu open={open} onOpenChange={setShow}>
            <DropdownMenuTrigger asChild>
                <button
                    className={`flex-center-y gap-2 hover:bg-slate-50 rounded-md ${
                        sidebarOpen ? "p-1.5" : "p-0"
                    }`}
                >
                    <AppAvatar fallback="FC" />
                    <div>
                        <div className="font-semibold text-start">{claims.role}</div>
                        <div className="text-xs -mt-0.5 text-start">
                            {claims.campus
                                ? claims.campus.name.match(/University\s*-\s*(.+)/i)?.[1]
                                : "No Campus"}
                        </div>
                    </div>
                    <ChevronsUpDown className="ms-auto w-4 h-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side={isMobile ? "top" : "right"}
                align="end"
                className="w-56 bg-white border-darkgreen"
            >
                <div className="flex-center-y gap-2 p-2">
                    <AppAvatar fallback="FC" />
                    <div>
                        <div className="font-semibold text-start">{claims.role}</div>
                        <div className="text-xs text-muted-foreground text-start">
                            {claims.campus
                                ? claims.campus.name.match(/University\s*-\s*(.+)/i)?.[1]
                                : "No Campus"}
                        </div>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <Link href="/account">
                    <button className="w-full flex-center-y gap-2 text-sm px-3 py-1.5 hover:bg-slate-50 hover:rounded-md hover:text-gray">
                        <CircleUserRound className="w-4 h-4" />
                        My Account
                    </button>
                </Link>
                <button
                    onClick={() => handleLogout()}
                    className="w-full flex-center-y gap-2 text-sm px-3 py-1.5 hover:bg-slate-50 hover:rounded-md hover:text-darkred"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}