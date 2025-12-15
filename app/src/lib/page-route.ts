import { CalendarRange, HandCoins, Landmark, LayoutDashboard, Megaphone, MessageSquareText, PiggyBank, University, UsersRound } from "lucide-react";

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
        title: 'Allocations',
        icon: PiggyBank,
        href: '/allocations',
    },
    { 
        title: 'Contributions', 
        icon: HandCoins,
        href: '/contributions',
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
        title: 'Allocations',
        icon: PiggyBank,
        href: '/allocations',
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
        title: 'Events', 
        icon: CalendarRange,
        href: '/events',
    },
    {
        title: 'Allocations',
        icon: PiggyBank,
        href: '/allocations',
    },
    {
        title: 'Messages',
        icon: MessageSquareText,
        href: '/messages',
    },
]
