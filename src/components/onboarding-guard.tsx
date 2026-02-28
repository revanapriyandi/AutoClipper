"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const ONBOARDING_KEY = "autoclipper_onboarded";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkOnboarded = async () => {
      // 1. Check fast path (localStorage)
      let hasOnboarded = false;
      if (typeof window !== "undefined") {
        hasOnboarded = !!localStorage.getItem(ONBOARDING_KEY);
      }

      // 3. Fallback to native vault (survives dev server restarts)
      let w = window as unknown as { electronAPI?: { getKey: (k: string) => Promise<{ success: boolean; value?: string }> } };
      let retries = 10;
      while (!w.electronAPI && retries > 0) {
        await new Promise(r => setTimeout(r, 50));
        w = window as unknown as { electronAPI?: { getKey: (k: string) => Promise<{ success: boolean; value?: string }> } };
        retries--;
      }

      if (!hasOnboarded && w.electronAPI?.getKey) {
        try {
          const res = await w.electronAPI.getKey(ONBOARDING_KEY);
          if (res.success && res.value === "1") {
            hasOnboarded = true;
            localStorage.setItem(ONBOARDING_KEY, "1"); // restore to fast path
          }
        } catch (e) {
          console.error("Failed to check native vault:", e);
        }
      }

      if (!mounted) return;

      if (!hasOnboarded && !pathname.startsWith("/onboarding")) {
        router.replace("/onboarding");
      } else {
        setIsReady(true);
      }
    };

    checkOnboarded();

    return () => { mounted = false; };
  }, [pathname, router]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
