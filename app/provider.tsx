"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <main className="flex-1 relative">
            <AppHeader />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
