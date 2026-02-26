"use client";

import { useState, useEffect, useCallback } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

// Store locale in localStorage so it persists across navigation
const LOCALE_KEY = "autoclipper_locale";

export function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("id");

  useEffect(() => {
    setMounted(true);
    setCurrentLocale(localStorage.getItem(LOCALE_KEY) || "id");
  }, []);

  const toggleLocale = useCallback(() => {
    const next = currentLocale === "id" ? "en" : "id";
    localStorage.setItem(LOCALE_KEY, next);
    window.location.reload();
  }, [currentLocale]);

  // Prevent hydration mismatch by rendering default SSR state until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" title="Toggle language / Ganti bahasa">
        <Globe className="h-3.5 w-3.5" />
        EN
      </Button>
    );
  }

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
