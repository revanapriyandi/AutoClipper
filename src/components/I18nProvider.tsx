"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

const LOCALE_KEY = "autoclipper_locale";
const THEME_KEY  = "theme"; // next-themes stores 'dark' | 'light' | 'system'

const MESSAGES_MAP: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  id: () => import("../i18n/messages/id.json"),
  en: () => import("../i18n/messages/en.json"),
};

// Detect theme before React renders to avoid flicker
function getTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light') return 'light';
  if (stored === 'dark')  return 'dark';
  // 'system' or not set — check OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages]   = useState<any>(null);
  const [locale,   setLocale]     = useState("id");
  const [progress, setProgress]   = useState(0);
  const [isDark,   setIsDark]     = useState(true); // default dark until hydration

  useEffect(() => {
    setIsDark(getTheme() === 'dark');

    const savedLocale = localStorage.getItem(LOCALE_KEY) || "id";
    setLocale(savedLocale);

    const loader = MESSAGES_MAP[savedLocale] ?? MESSAGES_MAP["id"];

    // Progress animation
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 18, 85));
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(progInterval);
      setProgress(100);
      setTimeout(() => setMessages({}), 200);
    }, 3000);

    loader()
      .then((mod) => {
        clearTimeout(timeout);
        clearInterval(progInterval);
        setProgress(100);
        setTimeout(() => setMessages(mod.default), 150);
      })
      .catch((err) => {
        clearTimeout(timeout);
        clearInterval(progInterval);
        console.error("[I18n] Failed to load messages:", err);
        setProgress(100);
        setTimeout(() => setMessages({}), 150);
      });

    return () => { clearTimeout(timeout); clearInterval(progInterval); };
  }, []);

  if (!messages) {
    // ── Theme tokens ──
    const bg        = isDark ? '#0e1015' : '#f4f4f5';
    const textPri   = isDark ? '#e4e4e7' : '#18181b';
    const textSub   = isDark ? '#52525b' : '#a1a1aa';
    const trackBg   = isDark ? '#27272a' : '#d4d4d8';
    const thumbBg   = 'linear-gradient(90deg, #6d28d9, #6366f1)';
    const glowColor = 'rgba(99,102,241,0.5)';

    return (
      <div style={{
        width: '100%', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: bg,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        userSelect: 'none',
        transition: 'background-color 0.2s',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '44px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 28px ${glowColor}`,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3"/>
              <circle cx="6" cy="18" r="3"/>
              <line x1="20" y1="4" x2="8.12" y2="15.88"/>
              <line x1="14.47" y1="14.48" x2="20" y2="20"/>
              <line x1="8.12" y1="8.12" x2="12" y2="12"/>
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', color: textPri, margin: 0, lineHeight: 1 }}>
              AutoClipper
            </p>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', color: textSub, margin: '6px 0 0', textTransform: 'uppercase' }}>
              AI Video Clipper
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '160px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ width: '100%', height: '2px', backgroundColor: trackBg, borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '1px',
              background: thumbBg,
              width: `${progress}%`,
              transition: 'width 0.15s ease-out',
              boxShadow: `0 0 8px ${glowColor}`,
            }} />
          </div>
          <p style={{ fontSize: '10px', color: textSub, textAlign: 'center', fontWeight: 500, letterSpacing: '0.05em' }}>
            {progress < 100 ? 'Memuat...' : 'Siap'}
          </p>
        </div>

        {/* Version */}
        <p style={{ position: 'absolute', bottom: '20px', fontSize: '10px', color: textSub, letterSpacing: '0.05em', opacity: 0.5 }}>
          v1.0.0
        </p>
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
