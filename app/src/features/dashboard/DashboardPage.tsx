"use client"

import { useAuth } from "@/hooks/use-auth";
import { MemberDashboard } from "./MemberDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { CoordinatorDashboard } from "./CoordinatorDashboard";
import { CvSULoading } from "@/components/ui/loader";

export function DashboardPage() {
    const { claims, loading } = useAuth();
    if (loading) return <CvSULoading />
    return (
        <>
            {claims.role === 'ADMIN' && <AdminDashboard />}
            {claims.role === 'MEMBER' || claims.role === 'JOBORDER' && <MemberDashboard />}
            {claims.role === 'COORDINATOR' && <CoordinatorDashboard />}
        </>
    )
}