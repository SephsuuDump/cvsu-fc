import { CalendarRange, Landmark, LayoutDashboard, MessageSquare, Send } from "lucide-react";

export const coordinatorRoute = [
    { 
        title: 'Dashboard', 
        icon: LayoutDashboard,
        href: '/',
    },
    { 
        title: 'Events', 
        icon: CalendarRange,
        href: '/events',
    },
    { 
        title: 'Faculty', 
        icon: Landmark,
        href: '/faculty',
    },
    {
        title: 'Messages',
        icon: MessageSquare,
        href: '/messages',
    }
]