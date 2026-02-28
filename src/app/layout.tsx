import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { NotificationToast } from "@/components/NotificationToast";
import { MenuListener } from "@/components/MenuListener";
import { AppShell } from "@/components/AppShell";

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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <OnboardingGuard>
              <AppShell>{children}</AppShell>
            </OnboardingGuard>
          </I18nProvider>
          <NotificationToast />
          <MenuListener />
        </ThemeProvider>
      </body>
    </html>
  );
}
// Trigger HMR 1
