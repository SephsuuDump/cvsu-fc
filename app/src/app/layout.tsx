import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import '@/styles/styles.css';
import '@/styles/animation.css';
// import { AuthProvider } from "@/hooks/use-auth";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/shared/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppCanvas } from "@/components/shared/AppCanvas";
import { AuthProvider } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/shared/AppSidebar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "CvSU Faculty Connect",
  description: "Cavite State University Faculty Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          <SidebarProvider className="bg-slate-100 max-w-[2560px] mx-auto">
            <AppSidebar />
            <Toaster position="top-center" />
            <AppCanvas>
              { children }
            </AppCanvas>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}