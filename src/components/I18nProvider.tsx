"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

const LOCALE_KEY = "autoclipper_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any>(null);
  const [locale, setLocale] = useState("id");

  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_KEY) || "id";
    setLocale(savedLocale);
    
    // Dynamically load the correct messages JSON
    import(`../i18n/messages/${savedLocale}.json`).then((mod) => {
      setMessages(mod.default);
    }).catch(err => {
      console.error("Failed to load messages", err);
    });
  }, []);

  if (!messages) {
    return (
      <div style={{
        width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', color: '#e4e4e7',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            border: '4px solid #6366f1', borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#a1a1aa' }}>
            Initializing language...
          </p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
