import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoClipper — AI Video Clipper",
  description: "AI-powered video auto-cut & auto-post desktop application",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen overflow-y-auto">
              {/* ── Top Bar ─────────────────────────────── */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <span className="text-base font-semibold tracking-tight">AutoClipper</span>
                </div>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                </div>
              </div>
              {/* ── Page Content ─────────────────────────── */}
              <div className="p-6">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
