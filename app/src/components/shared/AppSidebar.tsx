"use client"

import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";

export function AppSidebar() {
    const { claims, loading } = useAuth();
    const pathName = usePathname();
    if (pathName === '/auth') return null;
    let route: any[] = [];
    
    return (
        <Sidebar
            collapsible="icon"
        >
            <SidebarTrigger 
                className="rounded-full shadow-6xl bg-white absolute z-50 right-[-20px] top-[47%] -translate-x-1/2 -translate-y-1/2"
                // onClick={() => setIsCollapsed(!isCollapsed)}
            />
            <SidebarContent 
                className="rounded-md"
                style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
            >
                <Link href="/auth/login">
                    <Image
                        src="/images/papiverse_logo.png"
                        alt="Papiverse Logo"
                        width={150}
                        height={150}
                        className="mx-auto mt-4"
                    />
                </Link>
                <SidebarMenu>
                    {route?.map((item, i) => (
                        item.children.length !== 0 ?
                        <Collapsible className="group/collapsible" key={ i }>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton className="flex gap-2 pl-4">
                                        <item.icon className="w-4 h-4" />
                                        { item.title }
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.children.map((sub: any, index: number) => (
                                            <SidebarMenuButton className="py-0" key={ index }>
                                                <Link 
                                                    href={ sub.href } 
                                                    className="flex-center-y w-full h-full my-auto"
                                                >
                                                    { sub.title }
                                                </Link>
                                            </SidebarMenuButton>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                        :
                        <Collapsible key={ i }>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="flex gap-2 !py-0 pl-4">
                                            <Link 
                                                href={ item.href! }
                                                className="flex-center-y gap-2 w-full h-full"
                                            >
                                                <item.icon className="w-4 h-4" />
                                                { item.title }
                                            </Link>
                                        </SidebarMenuButton>
                                </CollapsibleTrigger>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}