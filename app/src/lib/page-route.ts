import { CalendarRange, HandCoins, Landmark, LayoutDashboard, MessageSquareText, University } from "lucide-react";

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
        title: 'Campuses', 
        icon: University,
        href: '/campuses',
    },
    { 
        title: 'Faculty', 
        icon: Landmark,
        href: '/faculty',
    },
    {
        title: 'Messages',
        icon: MessageSquareText,
        href: '/messages',
    },
    {
        title: 'Contributions',
        icon: HandCoins,
        href: '/contributions'
    }
]