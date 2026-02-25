"use client";

import { useCallback } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

// Store locale in localStorage so it persists across navigation
const LOCALE_KEY = "autoclipper_locale";

export function LanguageSwitcher() {
  const currentLocale = typeof window !== "undefined"
    ? (localStorage.getItem(LOCALE_KEY) || "id")
    : "id";

  const toggleLocale = useCallback(() => {
    const next = currentLocale === "id" ? "en" : "id";
    localStorage.setItem(LOCALE_KEY, next);
    window.location.reload();
  }, [currentLocale]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1 text-xs"
      onClick={toggleLocale}
      title="Toggle language / Ganti bahasa"
    >
      <Globe className="h-3.5 w-3.5" />
      {currentLocale === "id" ? "EN" : "ID"}
    </Button>
  );
}
