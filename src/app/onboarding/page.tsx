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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-lg">

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mb-8">
          <div
            className={`h-1.5 rounded-full bg-gradient-to-r ${currentStep.color} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="border-border/50 shadow-2xl">
          <CardContent className="p-8">

            {/* Icon + Title */}
            <div className="text-center mb-8">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${currentStep.color} mb-4`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">{currentStep.title}</h1>
              <p className="text-muted-foreground mt-1 text-sm">{currentStep.subtitle}</p>
            </div>

            {/* Step Content */}
            {currentStep.id === "welcome" && (
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                {["🤖 AI Auto-Cut", "📝 Auto-Subtitles", "🚀 Social Upload"].map(f => (
                  <div key={f} className="bg-muted/50 rounded-lg p-3 font-medium">{f}</div>
                ))}
              </div>
            )}

            {currentStep.id === "llm" && (
              <div className="grid grid-cols-2 gap-3">
                {LLM_QUICK.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setLlmProvider(p.id)}
                    className={[
                      "p-3 rounded-lg border text-sm font-medium text-left transition-all",
                      llmProvider === p.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                    ].join(" ")}
                  >
                    <div>{p.label}</div>
                    {p.default && <div className="text-xs text-muted-foreground mt-0.5">{p.default}</div>}
                  </button>
                ))}
              </div>
            )}

            {currentStep.id === "asr" && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "deepgram",       label: "Deepgram", sub: "nova-3 (Recommended)" },
                  { id: "openai_whisper", label: "OpenAI Whisper", sub: "whisper-1" },
                  { id: "assemblyai",     label: "AssemblyAI", sub: "best" },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setAsrProvider(p.id)}
                    className={[
                      "p-3 rounded-lg border text-sm font-medium text-left transition-all",
                      asrProvider === p.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                    ].join(" ")}
                  >
                    <div>{p.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.sub}</div>
                  </button>
                ))}
              </div>
            )}

            {currentStep.id === "apikeys" && (
              <div className="space-y-3">
                {[
                  { key: "openai_key",     label: "OpenAI API Key",    show: llmProvider === "openai",  hint: "sk-..." },
                  { key: "gemini_api_key", label: "Gemini API Key",     show: llmProvider === "gemini",  hint: "AIza..." },
                  { key: "groq_api_key",   label: "Groq API Key",       show: llmProvider === "groq",    hint: "gsk_..." },
                  { key: "deepgram_key",   label: "Deepgram API Key",   show: asrProvider === "deepgram", hint: "Enter key..." },
                  { key: "assemblyai_key", label: "AssemblyAI Key",     show: asrProvider === "assemblyai", hint: "Enter key..." },
                  { key: "pexels_api_key", label: "Pexels API Key",     show: true, hint: "For B-Roll download (free at pexels.com/api)" },
                ].filter(f => f.show).map(f => (
                  <div key={f.key} className="space-y-1">
                    <Label className="text-xs">{f.label}</Label>
                    <Input
                      type="password"
                      value={keys[f.key] || ""}
                      onChange={e => setKeys(k => ({ ...k, [f.key]: e.target.value }))}
                      placeholder={f.hint}
                      className="h-8 text-xs"
                    />
                  </div>
                ))}
                {llmProvider === "local" && (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm text-center border">
                    <Cpu className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <strong>Local AI Aktif</strong><br />Anda tidak memerlukan API Key untuk LLM. Konfigurasi endpoint (Ollama/Custom API) dapat diatur spesifik di halaman Settings nanti.
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-2 border-t">API keys lainnya bisa ditambahkan di Settings kapan saja.</p>
              </div>
            )}

            {currentStep.id === "done" && (
              <div className="space-y-3">
                {["✅ AI Provider dikonfigurasi", "✅ Transcription siap", "✅ API Keys tersimpan aman"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(s => Math.max(s - 1, 0))}
                disabled={step === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <div className="flex gap-1.5 items-center">
                {STEPS.map((_, i) => (
                  i === step
                    ? <div key={i} className={`h-1.5 w-6 rounded-full bg-gradient-to-r ${currentStep.color}`} />
                    : <div key={i} className="h-1.5 w-1.5 rounded-full bg-muted" />
                ))}
              </div>
              <Button size="sm" onClick={handleNext} className={`bg-gradient-to-r ${currentStep.color} text-white border-0`}>
                {step === STEPS.length - 1 ? (
                  <><Rocket className="h-4 w-4 mr-1" /> Get Started</>
                ) : (
                  <>Next <ChevronRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Skip */}
        {step < STEPS.length - 1 && (
          <p className="text-center mt-4 text-xs text-muted-foreground">
            <button onClick={handleFinish} className="hover:underline">Skip setup — configure later in Settings</button>
          </p>
        )}
      </div>
    </div>
  );
}
