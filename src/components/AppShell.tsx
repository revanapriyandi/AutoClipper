"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname?.startsWith("/onboarding");
  const isFullScreenApp = pathname?.startsWith("/editor") || pathname?.startsWith("/projects/detail");

  if (isOnboarding) {
    return <>{children}</>;
  }

  if (isFullScreenApp) {
    return (
      <main className="w-full h-screen overflow-hidden flex flex-col bg-background text-foreground">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen overflow-y-auto flex flex-col">
        {/* Desktop-style titlebar / header */}
        <div
          className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card/60 sticky top-0 z-10 shrink-0"
          style={{ minHeight: "36px" }}
        >
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-5 w-5" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide">
              AutoClipper
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
