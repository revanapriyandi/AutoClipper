"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function MenuListener() {
  const router = useRouter();
  const api = typeof window !== "undefined" ? window.electronAPI : undefined;

  useEffect(() => {
    if (!api) return;

    const unsubs: (() => void)[] = [];

    if (api.onMenuNavigate) {
      unsubs.push(
        api.onMenuNavigate((route: string) => {
          router.push(route);
        })
      );
    }

    if (api.onMenuNewProject) {
      unsubs.push(
        api.onMenuNewProject(() => {
          // You could open a modal here, but for now let's just go home
          // where the "New Project" button is prominent.
          router.push("/");
        })
      );
    }

    if (api.onMenuOpenSettings) {
      unsubs.push(
        api.onMenuOpenSettings(() => {
          router.push("/settings");
        })
      );
    }

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [api, router]);

  return null; // This component doesn't render anything visible
}
