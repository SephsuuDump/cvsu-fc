import { CalendarRange, HandCoins, Landmark, LayoutDashboard, Megaphone, MessageSquareText, University, UsersRound } from "lucide-react";

export const adminRoute = [
    { 
        title: 'Home', 
        icon: LayoutDashboard,
        href: '/',
    },
    { 
        title: 'Users', 
        icon: UsersRound,
        href: '/users',
    },
    { 
        title: 'Campuses', 
        icon: University,
        href: '/campuses',
    },
    { 
        title: 'Contributions', 
        icon: HandCoins,
        href: '/contributions',
    },
    {
        title: 'Announcements',
        icon: Megaphone,
        href: '/announcements'
    },
    {
        title: 'Messages',
        icon: MessageSquareText,
        href: '/messages',
    },
]

export const coordinatorRoute = [
    { 
        title: 'Home', 
        icon: LayoutDashboard,
        href: '/',
    },
    { 
        title: 'Faculty', 
        icon: Landmark,
        href: '/faculty',
    },
    { 
        title: 'Announcements', 
        icon: Megaphone,
        href: '/',
    },
    { 
        title: 'Events', 
        icon: CalendarRange,
        href: '/events',
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

export const memberRoute = [
    { 
        title: 'Home', 
        icon: LayoutDashboard,
        href: '/',
    },
    { 
        title: 'Faculty', 
        icon: Landmark,
        href: '/faculty',
    },
    { 
        title: 'Announcements', 
        icon: Megaphone,
        href: '/events',
    },
    { 
        title: 'Events', 
        icon: CalendarRange,
        href: '/events',
    },
    {
        title: 'Messages',
        icon: MessageSquareText,
        href: '/messages',
    },
]