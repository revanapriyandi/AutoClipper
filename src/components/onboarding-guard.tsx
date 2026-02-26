"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const ONBOARDING_KEY = "autoclipper_onboarded";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasOnboarded = localStorage.getItem(ONBOARDING_KEY);
      
      if (!hasOnboarded && !pathname.startsWith("/onboarding")) {
        router.replace("/onboarding");
      } else {
        setIsReady(true);
      }
    }
  }, [pathname, router]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
