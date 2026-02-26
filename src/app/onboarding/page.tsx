"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, ChevronLeft, Rocket, Key, Cpu, Globe } from "lucide-react";


const ONBOARDING_KEY = "autoclipper_onboarded";

const STEPS = [
  {
    id: "welcome",
    title: "Welcome to AutoClipper!",
    subtitle: "Buat klip viral dari video panjang dalam hitungan detik.",
    icon: Rocket,
    color: "from-violet-600 to-indigo-600",
  },
  {
    id: "llm",
    title: "Pilih AI Provider",
    subtitle: "AutoClipper menggunakan LLM untuk menilai dan memotong klip terbaik.",
    icon: Cpu,
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "asr",
    title: "Transcription (ASR)",
    subtitle: "Transkripsi otomatis mengubah audio menjadi teks untuk subtitle.",
    icon: Globe,
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "apikeys",
    title: "API Keys",
    subtitle: "Masukkan API key Anda. Disimpan aman di OS Keychain.",
    icon: Key,
    color: "from-orange-600 to-red-600",
  },
  {
    id: "done",
    title: "Siap!",
    subtitle: "AutoClipper siap digunakan. Buat proyek pertama Anda.",
    icon: CheckCircle2,
    color: "from-green-600 to-emerald-600",
  },
];

const LLM_QUICK = [
  { id: "openai",  label: "OpenAI GPT-5",      key: "openai_key",     default: "gpt-5-mini",      hint: "sk-..." },
  { id: "gemini",  label: "Google Gemini 3",    key: "gemini_api_key", default: "gemini-3-flash",  hint: "AIza..." },
  { id: "groq",    label: "Groq (Fastest)",      key: "groq_api_key",   default: "gpt-oss-20b",     hint: "gsk_..." },
  { id: "local",   label: "Local (Ollama)",       key: "",               default: "",                hint: "" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [llmProvider, setLlmProvider] = useState("openai");
  const [asrProvider, setAsrProvider] = useState("deepgram");
  const [keys, setKeys] = useState<Record<string, string>>({
    openai_key: "", gemini_api_key: "", groq_api_key: "",
    deepgram_key: "", assemblyai_key: "", pexels_api_key: "",
  });

  const api = typeof window !== "undefined" ? window.electronAPI : undefined;

  useEffect(() => {
    // Skip onboarding if already done
    if (typeof window !== "undefined" && localStorage.getItem(ONBOARDING_KEY)) {
      router.replace("/");
    }
  }, [router]);

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const handleSave = async () => {
    if (!api?.setKey) return;
    const pairs: [string, string][] = [
      ["ai_scoring_provider", llmProvider],
      ["ai_scoring_model",    LLM_QUICK.find(p => p.id === llmProvider)?.default || ""],
      ["asr_provider",        asrProvider],
      ...Object.entries(keys).filter(([, v]) => v.trim()),
    ];
    for (const [k, v] of pairs) await api.setKey(k, v);
  };

  const handleFinish = async () => {
    await handleSave();
    localStorage.setItem(ONBOARDING_KEY, "1");
    router.push("/");
  };

  const handleNext = async () => {
    if (step === STEPS.length - 1) { handleFinish(); return; }
    if (step === STEPS.length - 2) await handleSave(); // Save before done screen
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">

        {/* Progress bar */}
        <div className="w-full bg-muted overflow-hidden rounded-full h-1.5">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="shadow-none border-border">
          <CardContent className="p-8 sm:p-10 flex flex-col gap-8">

            {/* Header */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-muted/50 rounded-2xl ring-1 ring-border/50">
                <Icon className="h-6 w-6 text-foreground" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">{currentStep.title}</h1>
                <p className="text-sm text-muted-foreground">{currentStep.subtitle}</p>
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[220px] flex flex-col justify-center">
              {currentStep.id === "welcome" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
                  {[
                    { title: "AI Auto-Cut", desc: "Temukan momen terbaik otomatis", icon: "🤖" },
                    { title: "Auto-Subtitles", desc: "Transkripsi super cepat", icon: "📝" },
                    { title: "Social Upload", desc: "Langsung ke platform pilihan", icon: "🚀" }
                  ].map(f => (
                    <div key={f.title} className="flex flex-col items-center gap-2 p-4 border rounded-xl bg-card">
                      <div className="text-2xl">{f.icon}</div>
                      <div className="font-medium text-foreground">{f.title}</div>
                      <div className="text-xs text-muted-foreground">{f.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep.id === "llm" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LLM_QUICK.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setLlmProvider(p.id)}
                      className={[
                        "flex flex-col items-start p-4 rounded-xl border text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        llmProvider === p.id 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      <div className="font-medium text-foreground">{p.label}</div>
                      {p.default && <div className="text-xs mt-1 text-muted-foreground">{p.default}</div>}
                    </button>
                  ))}
                </div>
              )}

              {currentStep.id === "asr" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "deepgram",       label: "Deepgram", sub: "nova-3 (Recommended)" },
                    { id: "openai_whisper", label: "OpenAI Whisper", sub: "whisper-1" },
                    { id: "assemblyai",     label: "AssemblyAI", sub: "best" },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setAsrProvider(p.id)}
                      className={[
                        "flex flex-col items-start p-4 rounded-xl border text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        asrProvider === p.id 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      <div className="font-medium text-foreground">{p.label}</div>
                      <div className="text-xs mt-1 text-muted-foreground">{p.sub}</div>
                    </button>
                  ))}
                </div>
              )}

              {currentStep.id === "apikeys" && (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { key: "openai_key",     label: "OpenAI API Key",    show: llmProvider === "openai",  hint: "sk-..." },
                      { key: "gemini_api_key", label: "Gemini API Key",     show: llmProvider === "gemini",  hint: "AIza..." },
                      { key: "groq_api_key",   label: "Groq API Key",       show: llmProvider === "groq",    hint: "gsk_..." },
                      { key: "deepgram_key",   label: "Deepgram API Key",   show: asrProvider === "deepgram", hint: "Enter key..." },
                      { key: "assemblyai_key", label: "AssemblyAI Key",     show: asrProvider === "assemblyai", hint: "Enter key..." },
                      { key: "pexels_api_key", label: "Pexels API Key",     show: true, hint: "For B-Roll (pexels.com/api)" },
                    ].filter(f => f.show).map(f => (
                      <div key={f.key} className="space-y-2">
                        <Label htmlFor={f.key} className="text-xs font-semibold">{f.label}</Label>
                        <Input
                          id={f.key}
                          type="password"
                          value={keys[f.key] || ""}
                          onChange={e => setKeys(k => ({ ...k, [f.key]: e.target.value }))}
                          placeholder={f.hint}
                          className="h-9 transition-colors focus-visible:ring-primary"
                        />
                      </div>
                    ))}
                  </div>

                  {llmProvider === "local" && (
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                      <Cpu className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-foreground">Local AI Aktif</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Anda tidak memerlukan API Key eksternal. Konfigurasi endpoint untuk Ollama atau server kustom lainnya dapat diatur di halaman <span className="font-medium text-foreground">Settings</span> setelah setup selesai.
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground text-center">🔐 Keys disimpan dengan aman menggunakan sistem operasi, bukan di cloud.</p>
                </div>
              )}

              {currentStep.id === "done" && (
                <div className="flex flex-col gap-3 mx-auto max-w-sm w-full">
                  {[
                    { text: "AI Provider telah dikonfigurasi", icon: Cpu },
                    { text: "Mesin Transkripsi siap digunakan", icon: Globe },
                    { text: "API Keys disimpan ke Keychain lokal", icon: Key },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(s => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" /> 
                <span className="hidden sm:inline">Kembali</span>
              </Button>
              
              <div className="flex gap-2 items-center">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/30"
                    }`} 
                  />
                ))}
              </div>

              <Button 
                size="sm" 
                onClick={handleNext} 
                className="min-w-[100px]"
              >
                {step === STEPS.length - 1 ? (
                  <>Selesai <Rocket className="h-4 w-4 ml-1.5" /></>
                ) : (
                  <>Lanjut <ChevronRight className="h-4 w-4 ml-1.5" /></>
                )}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Skip button below card */}
        <div className="flex justify-center h-8">
          {step < STEPS.length - 1 && (
            <button 
              onClick={handleFinish} 
              className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
            >
              Lewati setup dan atur nanti
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
