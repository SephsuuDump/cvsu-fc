"use client"

import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarTrigger, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { adminRoute, coordinatorRoute, memberRoute } from "@/lib/page-route";
import { AuthPage } from "@/features/auth/AuthPage";

export function AppSidebar() {
    const { claims, loading } = useAuth();
    const { open } = useSidebar();
    const pathName = usePathname();
    if (pathName === '/auth') return null;

    let route;
    if (!claims) return <AuthPage />;
    if (claims.role === 'ADMIN') route = adminRoute
    if (claims.role === 'COORDINATOR') route = coordinatorRoute
    if (claims.role === 'MEMBER' || claims.role === 'JOBORDER') route = memberRoute

    return (
        <Sidebar
            collapsible="icon"
        >
            <SidebarTrigger 
                className="rounded-full shadow-6xl bg-white absolute z-50 right-[-28px] top-[47%] -translate-x-1/2 -translate-y-1/2"
            />
            <SidebarContent 
                className={`rounded-md bg-cover border-r-green-100 border-0`}
                style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
            >
                <Link 
                    className="text-center aspect-auto"
                    href="/auth/login"
                >
                    <Image
                        src="/images/cvsu_logo.png"
                        alt="Papiverse Logo"
                        width={open ? 50 : 30}
                        height={open ? 50 : 30}
                        className="mx-auto mt-4"
                    />
                    <div className={`font-bold text-lg ${!open && "text-sm"}`}>CvSU</div>
                    <div className={`text-xs font-semibold text-darkgreen -mt-1 ${!open && "text-[8px]"}`}>FACULTY CONNECT</div>
                </Link>
                <SidebarMenu className={`mt-4 ${!open && "flex-center"}`}>
                    {route?.map((item, i) => (
                        <Link 
                            href={ item.href } 
                            className={`group/collapsible w-full hover:bg-slate-50 rounded-md ${!open && 'flex-center'}`} 
                            key={ i }
                        >
                            <SidebarMenuItem>
                                <SidebarMenuButton className="flex gap-2 pl-4">
                                    <item.icon className="w-4 h-4" />
                                    { item.title }
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Link>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}