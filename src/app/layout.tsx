import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { I18nProvider } from "@/components/I18nProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { NotificationToast } from "@/components/NotificationToast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoClipper — AI Video Clipper",
  description: "AI-powered video auto-cut & auto-post desktop application",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <OnboardingGuard>
              <SidebarProvider>
                <AppSidebar />
                <main className="w-full h-screen overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                      <SidebarTrigger />
                      <span className="text-base font-semibold tracking-tight">AutoClipper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <LanguageSwitcher />
                    </div>
                  </div>
                  <div className="p-6">
                    {children}
                  </div>
                </main>
              </SidebarProvider>
            </OnboardingGuard>
          </I18nProvider>
          <NotificationToast />
        </ThemeProvider>
      </body>
    </html>
  );
}
