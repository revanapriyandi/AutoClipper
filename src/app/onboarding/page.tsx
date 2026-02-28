"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Rocket, Key, Cpu, Globe,
  Loader2, Terminal, Server, KeyRound, Eye, EyeOff, Cloud, Wifi,
  WifiOff, AlertCircle, Zap,
} from "lucide-react";

const ONBOARDING_KEY = "autoclipper_onboarded";

// ── Types ─────────────────────────────────────────────────────────────────────
type AuthMode = "apikey" | "vertex" | "cli" | "azure" | "bedrock" | "none";
type TestState = { status: "idle" | "testing" | "ok" | "fail"; error?: string; latency?: number; model?: string };

// ── LLM Providers ─────────────────────────────────────────────────────────────
const LLM_PROVIDERS = [
  { id: "openai",     label: "OpenAI",           sub: "GPT-4o · GPT-4o-mini",        emoji: "🟢", badge: "" },
  { id: "gemini",     label: "Google Gemini",    sub: "Gemini 2.0 Flash · Pro",       emoji: "💎", badge: "Free" },
  { id: "claude",     label: "Anthropic Claude", sub: "Sonnet 3.5 · Haiku",           emoji: "🟤", badge: "" },
  { id: "groq",       label: "Groq",             sub: "Llama 3.3 70B — ultra fast",   emoji: "⚡", badge: "Free" },
  { id: "deepseek",   label: "DeepSeek",         sub: "V3 · R1 — ultra cheap",        emoji: "🔵", badge: "Cheap" },
  { id: "xai",        label: "xAI Grok",         sub: "Grok-2 · Grok-3",             emoji: "⬜", badge: "" },
  { id: "mistral",    label: "Mistral",           sub: "Large · Nemo",                 emoji: "🌊", badge: "Free" },
  { id: "cohere",     label: "Cohere",            sub: "Command R+",                   emoji: "🟡", badge: "" },
  { id: "cerebras",   label: "Cerebras",          sub: "Llama 3.3 70B — fastest",     emoji: "🧠", badge: "Free" },
  { id: "openrouter", label: "OpenRouter",        sub: "500+ models via one key",      emoji: "🌐", badge: "Multi" },
  { id: "local",      label: "Local (Ollama)",   sub: "No API key needed",            emoji: "🏠", badge: "" },
];

// ── ASR Providers ─────────────────────────────────────────────────────────────
const ASR_PROVIDERS = [
  { id: "deepgram",       label: "Deepgram",        sub: "Nova-3 — Recommended",   needsKey: true  },
  { id: "openai_whisper", label: "OpenAI Whisper",  sub: "Reuses OpenAI key",      needsKey: false },
  { id: "assemblyai",     label: "AssemblyAI",      sub: "Best accuracy",           needsKey: true  },
  { id: "groq_whisper",   label: "Groq Whisper",    sub: "Reuses Groq key",         needsKey: false },
  { id: "local_whisper",  label: "Local Whisper",   sub: "Runs on your hardware",   needsKey: false },
];

// ── Auth Config ───────────────────────────────────────────────────────────────
interface Field { key: string; label: string; hint: string; optional?: boolean; sensitive?: boolean }
interface ProviderAuth {
  modes: AuthMode[]; defaultMode: AuthMode; defaultModel: string;
  fields: Record<AuthMode, Field[]>;
  modeLabels: Partial<Record<AuthMode, string>>;
  modeIcons:  Partial<Record<AuthMode, React.ElementType>>;
  modeDesc:   Partial<Record<AuthMode, string>>;
}

const PROVIDER_AUTH: Record<string, ProviderAuth> = {
  openai:     { defaultModel: "gpt-4o-mini",              modes: ["apikey", "azure"], defaultMode: "apikey", modeLabels: { apikey: "API Key", azure: "Azure OpenAI" }, modeIcons: { apikey: KeyRound, azure: Cloud }, modeDesc: { apikey: "platform.openai.com → API Keys", azure: "Azure portal → Azure OpenAI resource" }, fields: { apikey: [{ key: "openai_key", label: "OpenAI API Key", hint: "sk-proj-...", sensitive: true }, { key: "openai_org", label: "Organization ID", hint: "org-...", optional: true }], azure: [{ key: "azure_openai_endpoint", label: "Endpoint", hint: "https://YOUR.openai.azure.com/" }, { key: "azure_openai_key", label: "Azure API Key", hint: "...", sensitive: true }, { key: "azure_openai_deployment", label: "Deployment Name", hint: "gpt-4o" }], vertex: [], cli: [], bedrock: [], none: [] } },
  gemini:     { defaultModel: "gemini-2.0-flash",         modes: ["apikey", "vertex", "cli"], defaultMode: "apikey", modeLabels: { apikey: "API Key", vertex: "Vertex AI", cli: "Gemini CLI" }, modeIcons: { apikey: KeyRound, vertex: Server, cli: Terminal }, modeDesc: { apikey: "aistudio.google.com/apikey — gratis", vertex: "Google Cloud Vertex AI + Application Default Credentials", cli: "Deteksi Gemini CLI yang sudah ter-install" }, fields: { apikey: [{ key: "gemini_api_key", label: "Gemini API Key", hint: "AIza...", sensitive: true }], vertex: [{ key: "google_project_id", label: "GCP Project ID", hint: "my-project-123" }, { key: "google_location", label: "Region", hint: "us-central1", optional: true }], cli: [], azure: [], bedrock: [], none: [] } },
  claude:     { defaultModel: "claude-3-5-haiku-latest",  modes: ["apikey", "bedrock", "vertex"], defaultMode: "apikey", modeLabels: { apikey: "API Key", bedrock: "AWS Bedrock", vertex: "Google Vertex" }, modeIcons: { apikey: KeyRound, bedrock: Cloud, vertex: Server }, modeDesc: { apikey: "console.anthropic.com → API Keys", bedrock: "AWS IAM role / aws configure — tanpa Anthropic key", vertex: "GCP Vertex AI + ADC" }, fields: { apikey: [{ key: "claude_api_key", label: "Anthropic API Key", hint: "sk-ant-...", sensitive: true }], bedrock: [{ key: "aws_region", label: "AWS Region", hint: "us-east-1" }, { key: "aws_access_key_id", label: "Access Key ID", hint: "AKIA...", optional: true, sensitive: true }, { key: "aws_secret_access_key", label: "Secret Access Key", hint: "IAM role jika kosong", optional: true, sensitive: true }], vertex: [{ key: "google_project_id", label: "GCP Project ID", hint: "my-project-123" }, { key: "google_location", label: "Region", hint: "us-east5", optional: true }], azure: [], cli: [], none: [] } },
  groq:       { defaultModel: "llama-3.3-70b-versatile",  modes: ["apikey"], defaultMode: "apikey", modeLabels: { apikey: "API Key" }, modeIcons: { apikey: KeyRound }, modeDesc: { apikey: "console.groq.com → API Keys — free tier tersedia" }, fields: { apikey: [{ key: "groq_api_key", label: "Groq API Key", hint: "gsk_...", sensitive: true }], vertex: [], cli: [], azure: [], bedrock: [], none: [] } },
  deepseek:   { defaultModel: "deepseek-chat",            modes: ["apikey"], defaultMode: "apikey", modeLabels: { apikey: "API Key" }, modeIcons: { apikey: KeyRound }, modeDesc: { apikey: "platform.deepseek.com → API Keys — $0.07/M token" }, fields: { apikey: [{ key: "deepseek_api_key", label: "DeepSeek API Key", hint: "sk-...", sensitive: true }], vertex: [], cli: [], azure: [], bedrock: [], none: [] } },
  xai:        { defaultModel: "grok-2-latest",            modes: ["apikey"], defaultMode: "apikey", modeLabels: { apikey: "API Key" }, modeIcons: { apikey: KeyRound }, modeDesc: { apikey: "console.x.ai → API Keys" }, fields: { apikey: [{ key: "xai_api_key", label: "xAI API Key", hint: "xai-...", sensitive: true }], vertex: [], cli: [], azure: [], bedrock: [], none: [] } },
  mistral:    { defaultModel: "mistral-large-latest",     modes: ["apikey"], defaultMode: "apikey", modeLabels: { apikey: "API Key" }, modeIcons: { apikey: KeyRound }, modeDesc: { apikey: "console.mistral.ai — free tier tersedia" }, fields: { apikey: [{ key: "mistral_api_key", label: "Mistral API Key", hint: "...", sensitive: true }], vertex: [], cli: [], azure: [], bedrock: [], none: [] } },
  cohere:     { defaultModel: "command-r-plus",           modes: ["apikey"], defaultMode: "apikey", modeLabels: { apikey: "API Key" }, modeIcons: { apikey: KeyRound }, modeDesc: { apikey: "dashboard.cohere.com → API Keys" }, fields: { apikey: [{ key: "cohere_api_key", label: "Cohere API Key", hint: "...", sensitive: true }], vertex: [], cli: [], azure: [], bedrock: [], none: [] } },
  cerebras:   { defaultModel: "llama3.3-70b",             modes: ["apikey"], defaultMode: "apikey", modeLabels: { apikey: "API Key" }, modeIcons: { apikey: KeyRound }, modeDesc: { apikey: "inference.cerebras.ai — gratis & tercepat" }, fields: { apikey: [{ key: "cerebras_api_key", label: "Cerebras API Key", hint: "csk-...", sensitive: true }], vertex: [], cli: [], azure: [], bedrock: [], none: [] } },
  openrouter: { defaultModel: "openai/gpt-4o-mini",       modes: ["apikey"], defaultMode: "apikey", modeLabels: { apikey: "API Key" }, modeIcons: { apikey: KeyRound }, modeDesc: { apikey: "openrouter.ai → Keys — akses 500+ model dengan satu key" }, fields: { apikey: [{ key: "openrouter_api_key", label: "OpenRouter API Key", hint: "sk-or-...", sensitive: true }, { key: "openrouter_model", label: "Default Model", hint: "openai/gpt-4o-mini", optional: true }], vertex: [], cli: [], azure: [], bedrock: [], none: [] } },
  local:      { defaultModel: "",                         modes: ["none"], defaultMode: "none", modeLabels: {}, modeIcons: {}, modeDesc: {}, fields: { none: [], apikey: [], vertex: [], cli: [], azure: [], bedrock: [] } },
};

const ASR_KEYS: Record<string, Field[]> = {
  deepgram:       [{ key: "deepgram_key",   label: "Deepgram API Key",   hint: "deepgram.com/console", sensitive: true }],
  assemblyai:     [{ key: "assemblyai_key", label: "AssemblyAI API Key", hint: "assemblyai.com/dashboard", sensitive: true }],
  openai_whisper: [],
  groq_whisper:   [],
};

// ── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "welcome",  title: "Selamat Datang",      icon: Rocket,       check: false },
  { id: "llm",      title: "Pilih AI Provider",   icon: Cpu,          check: false },
  { id: "llmauth",  title: "Konfigurasi AI",      icon: Key,          check: true  },
  { id: "asr",      title: "Transcription",        icon: Globe,        check: false },
  { id: "asrkey",   title: "API Key Transcription",icon: KeyRound,     check: true  },
  { id: "done",     title: "Selesai",              icon: CheckCircle2, check: false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusColor(s: TestState["status"]) {
  if (s === "ok")      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (s === "fail")    return "text-red-400 bg-red-500/10 border-red-500/20";
  if (s === "testing") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
  return "text-muted-foreground bg-muted/30 border-border/50";
}

function StatusBadge({ test }: { test: TestState }) {
  if (test.status === "idle") return null;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium ${statusColor(test.status)}`}>
      {test.status === "testing" && <Loader2 className="h-3 w-3 animate-spin" />}
      {test.status === "ok"      && <Wifi className="h-3 w-3" />}
      {test.status === "fail"    && <WifiOff className="h-3 w-3" />}
      {test.status === "ok"    ? `Terhubung${test.latency ? ` · ${test.latency}ms` : ""}${test.model ? ` · ${test.model.split("/").pop()?.slice(0,22)}` : ""}` : ""}
      {test.status === "fail"   ? (test.error || "Gagal") : ""}
      {test.status === "testing" ? "Mengecek..." : ""}
    </div>
  );
}

// ── Page component ─────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step,        setStep]        = useState(0);
  const [saving,      setSaving]      = useState(false);
  const [llmProvider, setLlmProvider] = useState("openai");
  const [authMode,    setAuthMode]    = useState<AuthMode>("apikey");
  const [asrProvider, setAsrProvider] = useState("deepgram");
  const [keys,        setKeys]        = useState<Record<string, string>>({});
  const [showKeys,    setShowKeys]    = useState<Record<string, boolean>>({});
  const [llmTest,     setLlmTest]     = useState<TestState>({ status: "idle" });
  const [adcState,    setAdcState]    = useState<{ loading: boolean; found: boolean | null; method?: string | null }>({ loading: false, found: null });
  const [awsState,    setAwsState]    = useState<{ loading: boolean; found: boolean | null; method?: string | null; region?: string | null }>({ loading: false, found: null });
  const [cliState,    setCliState]    = useState<{ loading: boolean; found: boolean | null; version?: string | null }>({ loading: false, found: null });
  const [oauthState,  setOauthState]  = useState<{ loading: boolean; email?: string; error?: string }>({ loading: false });

  const api = typeof window !== "undefined" ? (window as unknown as { electronAPI: Record<string, (...a: unknown[]) => Promise<unknown>> }).electronAPI : undefined;

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(ONBOARDING_KEY)) router.replace("/");
  }, [router]);

  useEffect(() => {
    const cfg = PROVIDER_AUTH[llmProvider];
    if (cfg) setAuthMode(cfg.defaultMode);
    setLlmTest({ status: "idle" });
    setCliState({ loading: false, found: null });
    setAdcState({ loading: false, found: null });
    setAwsState({ loading: false, found: null });
  }, [llmProvider]);

  useEffect(() => {
    if (authMode === "cli")     runDetectCli();
    if (authMode === "vertex")  runCheckAdc();
    if (authMode === "bedrock") runCheckAws();
    setLlmTest({ status: "idle" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMode]);

  const setKey = (k: string, v: string) => setKeys(p => ({ ...p, [k]: v }));
  const toggleShow = (k: string) => setShowKeys(p => ({ ...p, [k]: !p[k] }));

  const runDetectCli = async () => {
    setCliState({ loading: true, found: null });
    const res = await api?.detectGeminiCli?.() as { found: boolean; version?: string } | undefined;
    setCliState({ loading: false, found: res?.found ?? false, version: res?.version });
  };
  const runCheckAdc = async () => {
    setAdcState({ loading: true, found: null });
    const res = await api?.checkGcloudAdc?.() as { found: boolean; method?: string } | undefined;
    setAdcState({ loading: false, found: res?.found ?? false, method: res?.method });
  };
  const runCheckAws = async () => {
    setAwsState({ loading: true, found: null });
    const res = await api?.checkAwsCreds?.() as { found: boolean; method?: string; region?: string } | undefined;
    setAwsState({ loading: false, found: res?.found ?? false, method: res?.method, region: res?.region });
  };
  const runGoogleOAuth = async () => {
    setOauthState({ loading: true });
    const res = await api?.googleAiOAuthLogin?.({ clientId: keys["google_client_id"], clientSecret: keys["google_client_secret"] }) as { ok: boolean; email?: string; error?: string } | undefined;
    if (res?.ok) setOauthState({ loading: false, email: res.email });
    else setOauthState({ loading: false, error: res?.error || "Login gagal" });
  };

  const runTestConnection = useCallback(async () => {
    const api = (window as unknown as { electronAPI: Record<string, (...args: unknown[]) => Promise<unknown>> }).electronAPI;
    setLlmTest({ status: "testing" });
    const res = await api?.testConnection?.({ provider: llmProvider, authMode, keys }) as TestState & { ok?: boolean } | undefined;
    if (!res) { setLlmTest({ status: "fail", error: "IPC tidak tersedia" }); return; }
    setLlmTest({ status: res.ok ? "ok" : "fail", error: res.error, latency: res.latency as number, model: res.model as string });
  }, [llmProvider, authMode, keys]);

  const providerCfg = PROVIDER_AUTH[llmProvider] ?? PROVIDER_AUTH["openai"];
  const visibleSteps = STEPS.filter(s => {
    if (s.id === "asrkey") return asrProvider !== "openai_whisper" && asrProvider !== "groq_whisper";
    return true;
  });
  const totalSteps = visibleSteps.length;
  const currentStep = visibleSteps[step];


  const saveCurrentStep = async () => {
    const api = (window as unknown as { electronAPI: Record<string, (...args: unknown[]) => Promise<unknown>> }).electronAPI;
    if (!api?.setKey) return;
    if (currentStep.id === "llm") { await api.setKey("ai_scoring_provider", llmProvider); await api.setKey("ai_scoring_model", providerCfg.defaultModel); }
    if (currentStep.id === "llmauth") { await api.setKey("llm_auth_mode", authMode); for (const f of providerCfg.fields[authMode] ?? []) if (keys[f.key]?.trim()) await api.setKey(f.key, keys[f.key].trim()); }
    if (currentStep.id === "asr") { await api.setKey("asr_provider", asrProvider); }
    if (currentStep.id === "asrkey") { for (const f of ASR_KEYS[asrProvider] ?? []) if (keys[f.key]?.trim()) await api.setKey(f.key, keys[f.key].trim()); if (keys["pexels_api_key"]?.trim()) await api.setKey("pexels_api_key", keys["pexels_api_key"].trim()); }
  };

  const handleNext = async () => {
    const api = (window as unknown as { electronAPI: Record<string, (...args: unknown[]) => Promise<unknown>> }).electronAPI;
    setSaving(true);
    await saveCurrentStep();
    setSaving(false);
    if (step === totalSteps - 1) { 
      localStorage.setItem(ONBOARDING_KEY, "1"); 
      if (api?.setKey) await api.setKey(ONBOARDING_KEY, "1");
      router.push("/"); 
      return; 
    }
    setStep(s => Math.min(s + 1, totalSteps - 1));
    setLlmTest({ status: "idle" });
  };
  const handleSkip = async () => { 
    const api = (window as unknown as { electronAPI: Record<string, (...args: unknown[]) => Promise<unknown>> }).electronAPI;
    localStorage.setItem(ONBOARDING_KEY, "1"); 
    if (api?.setKey) await api.setKey(ONBOARDING_KEY, "1");
    router.push("/"); 
  };

  // ── Sub-components ──
  const KeyField = ({ f }: { f: Field }) => (
    <div className="space-y-1">
      <Label htmlFor={f.key} className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
        {f.label}{f.optional && <span className="text-muted-foreground/60 normal-case ml-1 tracking-normal">(opsional)</span>}
      </Label>
      <div className="relative">
        <Input id={f.key} type={f.sensitive && !showKeys[f.key] ? "password" : "text"}
          value={keys[f.key] || ""} onChange={e => { setKey(f.key, e.target.value); setLlmTest({ status: "idle" }); }}
          placeholder={f.hint} className="h-8 text-xs font-mono bg-background border-border/60 pr-8 focus-visible:ring-1 focus-visible:ring-ring" />
        {f.sensitive && (
          <button type="button" onClick={() => toggleShow(f.key)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            {showKeys[f.key] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  );

  const AdcStatusRow = () => (
    <div className="flex items-center justify-between px-3 py-2 rounded-md border border-border/40 bg-muted/10">
      <span className="text-[11px] text-muted-foreground">
        {adcState.loading ? <span className="flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" />Memeriksa ADC...</span>
          : adcState.found ? <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="h-3 w-3" />ADC aktif — {adcState.method}</span>
          : <span className="text-orange-400 flex items-center gap-1.5"><AlertCircle className="h-3 w-3" />{adcState.found === false ? "ADC tidak ditemukan" : "Belum diperiksa"}</span>}
      </span>
      <button onClick={runCheckAdc} className="text-[10px] text-primary hover:underline">cek ulang</button>
    </div>
  );

  const AwsStatusRow = () => (
    <div className="flex items-center justify-between px-3 py-2 rounded-md border border-border/40 bg-muted/10">
      <span className="text-[11px]">
        {awsState.loading ? <span className="flex items-center gap-1.5 text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />Memeriksa AWS...</span>
          : awsState.found ? <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="h-3 w-3" />AWS aktif ({awsState.method}) · {awsState.region}</span>
          : <span className="text-orange-400 flex items-center gap-1.5"><AlertCircle className="h-3 w-3" />{awsState.found === false ? "AWS credentials tidak ada" : "Belum diperiksa"}</span>}
      </span>
      <button onClick={runCheckAws} className="text-[10px] text-primary hover:underline">cek ulang</button>
    </div>
  );

  const CliStatusRow = () => (
    <div className="flex flex-col items-center gap-2 py-2">
      {cliState.loading && <span className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Mendeteksi Gemini CLI...</span>}
      {!cliState.loading && cliState.found && (
        <div className="flex flex-col items-center gap-0.5">
          <span className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle2 className="h-4 w-4" />Gemini CLI terdeteksi</span>
          {cliState.version && <code className="text-[10px] text-muted-foreground">{cliState.version}</code>}
        </div>
      )}
      {!cliState.loading && cliState.found === false && (
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-8 w-8 text-orange-400/50" />
          <p className="text-sm font-medium">Gemini CLI tidak ditemukan</p>
          <code className="text-[11px] px-2 py-1 bg-muted rounded border">npm i -g @google/gemini-cli</code>
          <button onClick={() => setAuthMode("apikey")} className="text-xs text-primary hover:underline">Gunakan API key →</button>
        </div>
      )}
      {cliState.found !== null && !cliState.loading && (
        <button onClick={runDetectCli} className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground underline">Deteksi ulang</button>
      )}
    </div>
  );

  // ── Test Connection button block ──
  const TestConnectionBlock = () => (
    <div className="flex items-center gap-2 pt-1">
      <button onClick={runTestConnection} disabled={llmTest.status === "testing"}
        className="flex items-center gap-1.5 h-7 px-3 rounded border border-border/60 bg-muted/20 hover:bg-muted/40 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all disabled:opacity-50">
        {llmTest.status === "testing" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
        {llmTest.status === "testing" ? "Mengecek..." : "Test Connection"}
      </button>
      <StatusBadge test={llmTest} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background" style={{ appRegion: "no-drag" } as React.CSSProperties}>

      {/* ── Window drag area top ── */}
      <div className="fixed top-0 left-0 right-0 h-8 z-50" style={{ appRegion: "drag", WebkitAppRegion: "drag" } as React.CSSProperties} />

      {/* ── Step indicator ── */}
      <div className="w-full max-w-md mb-4 px-2">
        <div className="flex items-center gap-1">
          {visibleSteps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border transition-all
                ${i < step ? "bg-primary border-primary text-primary-foreground"
                : i === step ? "border-primary text-primary"
                : "border-border text-muted-foreground/40"}`}>
                {i < step ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
              </div>
              {i < visibleSteps.length - 1 && (
                <div className={`h-px flex-1 min-w-[16px] transition-all ${i < step ? "bg-primary" : "bg-border/40"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {visibleSteps.map((s, i) => (
            <span key={s.id} className={`text-[9px] font-medium transition-colors ${i === step ? "text-foreground" : "text-muted-foreground/40"}`} style={{ width: `${100/totalSteps}%`, textAlign: i === 0 ? "left" : i === totalSteps-1 ? "right" : "center" }}>
              {s.title}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="w-full max-w-md bg-card border border-border/60 rounded-lg overflow-hidden shadow-sm">

        {/* Card header */}
        <div className="px-6 py-4 border-b border-border/40 bg-muted/10">
          <div className="flex items-center gap-2.5">
            {(() => { const Icon = currentStep.icon; return <Icon className="h-4 w-4 text-muted-foreground shrink-0" />; })()}
            <div>
              <h1 className="text-sm font-semibold">{currentStep.title}</h1>
              <p className="text-[11px] text-muted-foreground mt-px">
                Langkah {step + 1} dari {totalSteps}
              </p>
            </div>
            {currentStep.check && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-medium">VERIFIABLE</span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-5 min-h-[280px] flex flex-col justify-start gap-4">

          {/* ── WELCOME ── */}
          {currentStep.id === "welcome" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 pb-2">
                <h2 className="text-base font-semibold">AutoClipper</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">Buat klip viral dari video panjang secara otomatis menggunakan AI. Setup hanya butuh beberapa menit.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[{ t: "AI Auto-Cut", d: "Deteksi momen terbaik", e: "🤖" },
                  { t: "Auto-Subtitle", d: "Transkripsi & terjemahan", e: "📝" },
                  { t: "Social Upload", d: "Langsung ke platform", e: "🚀" }].map(f => (
                  <div key={f.t} className="flex flex-col gap-1.5 p-3 border border-border/40 rounded-md bg-muted/5">
                    <span className="text-xl">{f.e}</span>
                    <p className="text-[11px] font-medium">{f.t}</p>
                    <p className="text-[10px] text-muted-foreground">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LLM PROVIDER ── */}
          {currentStep.id === "llm" && (
            <div className="grid grid-cols-2 gap-1.5">
              {LLM_PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setLlmProvider(p.id)}
                  className={["flex items-center gap-2 p-2.5 rounded-md border text-left transition-all text-xs relative",
                    llmProvider === p.id ? "border-primary/60 bg-primary/5" : "border-border/40 hover:bg-muted/20"].join(" ")}>
                  <span className="text-base shrink-0">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium flex items-center gap-1 flex-wrap">
                      {p.label}
                      {p.badge && <span className="text-[9px] px-1 py-px bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">{p.badge}</span>}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate mt-px">{p.sub}</div>
                  </div>
                  {llmProvider === p.id && <CheckCircle2 className="h-3 w-3 absolute top-2 right-2 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* ── LLM AUTH ── */}
          {currentStep.id === "llmauth" && llmProvider !== "local" && (
            <div className="flex flex-col gap-3">
              {/* Mode selector */}
              {providerCfg.modes.filter(m => m !== "none").length > 1 && (
                <div className="flex gap-1.5">
                  {providerCfg.modes.filter(m => m !== "none").map(m => {
                    const MIcon = providerCfg.modeIcons[m] ?? KeyRound;
                    return (
                      <button key={m} onClick={() => setAuthMode(m)}
                        className={["flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md border text-[11px] font-medium transition-all",
                          authMode === m ? "border-primary/60 bg-primary/5 text-primary" : "border-border/40 text-muted-foreground hover:bg-muted/20"].join(" ")}>
                        <MIcon className="h-3.5 w-3.5" />
                        {providerCfg.modeLabels[m]}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Description */}
              {providerCfg.modeDesc[authMode] && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="shrink-0">ℹ️</span>{providerCfg.modeDesc[authMode]}
                </p>
              )}

              {/* CLI */}
              {authMode === "cli" && <CliStatusRow />}

              {/* Vertex ADC */}
              {authMode === "vertex" && (
                <div className="flex flex-col gap-2.5">
                  <AdcStatusRow />
                  {adcState.found !== true && (
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">Atau login dengan Google:</span>
                      <button onClick={runGoogleOAuth} disabled={oauthState.loading}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/50 bg-card hover:bg-muted/20 text-[11px] font-medium transition-all disabled:opacity-50">
                        {oauthState.loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <span>🔐</span>}
                        {oauthState.email ? oauthState.email : "Sign in with Google"}
                      </button>
                      {oauthState.error && <p className="text-[11px] text-red-400">{oauthState.error}</p>}
                    </div>
                  )}
                  {adcState.found === false && !oauthState.email && (
                    <p className="text-[10px] text-muted-foreground/60 text-center">Atau: <code>gcloud auth application-default login</code></p>
                  )}
                  <div className="flex flex-col gap-2">
                    {(providerCfg.fields.vertex ?? []).map(f => <KeyField key={f.key} f={f} />)}
                  </div>
                </div>
              )}

              {/* Bedrock */}
              {authMode === "bedrock" && (
                <div className="flex flex-col gap-2.5">
                  <AwsStatusRow />
                  {awsState.found === false && (
                    <p className="text-[10px] text-muted-foreground/60 text-center">Jalankan: <code>aws configure</code></p>
                  )}
                  <div className="flex flex-col gap-2">
                    {(providerCfg.fields.bedrock ?? []).map(f => <KeyField key={f.key} f={f} />)}
                  </div>
                </div>
              )}

              {/* API Key / Azure */}
              {(authMode === "apikey" || authMode === "azure") && (
                <div className="flex flex-col gap-2">
                  {(providerCfg.fields[authMode] ?? []).map(f => <KeyField key={f.key} f={f} />)}
                </div>
              )}

              {/* Test Connection */}
              {authMode !== "cli" && <TestConnectionBlock />}
            </div>
          )}

          {/* Local AI notice */}
          {currentStep.id === "llmauth" && llmProvider === "local" && (
            <div className="flex items-start gap-3 p-4 border border-border/40 rounded-md bg-muted/5">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="text-sm font-medium">Local AI — tidak perlu API key</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Konfigurasi Ollama endpoint tersedia di Settings → AI Models setelah setup selesai.</p>
              </div>
            </div>
          )}

          {/* ── ASR ── */}
          {currentStep.id === "asr" && (
            <div className="flex flex-col gap-1.5">
              {ASR_PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setAsrProvider(p.id)}
                  className={["flex items-center justify-between px-3 py-2.5 rounded-md border text-left transition-all",
                    asrProvider === p.id ? "border-primary/60 bg-primary/5" : "border-border/40 hover:bg-muted/20"].join(" ")}>
                  <div>
                    <p className="text-xs font-medium">{p.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-px">{p.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${p.needsKey ? "border-orange-500/20 text-orange-400 bg-orange-500/5" : "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"}`}>
                      {p.needsKey ? "API Key" : "Siap Dipakai"}
                    </span>
                    {asrProvider === p.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── ASR KEY ── */}
          {currentStep.id === "asrkey" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                {(ASR_KEYS[asrProvider] ?? []).map(f => <KeyField key={f.key} f={f} />)}
              </div>
              <div className="pt-2 border-t border-border/30">
                <div className="space-y-1">
                  <Label htmlFor="pexels_api_key" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Pexels API Key <span className="normal-case tracking-normal font-normal">(opsional — B-Roll)</span>
                  </Label>
                  <div className="relative">
                    <Input id="pexels_api_key" type={showKeys["pexels"] ? "text" : "password"}
                      value={keys["pexels_api_key"] || ""} onChange={e => setKey("pexels_api_key", e.target.value)}
                      placeholder="pexels.com/api" className="h-8 text-xs font-mono bg-background border-border/60 pr-8" />
                    <button type="button" onClick={() => toggleShow("pexels")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                      {showKeys["pexels"] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/50 text-center">🔐 API keys disimpan aman di OS keychain</p>
            </div>
          )}

          {/* ── DONE ── */}
          {currentStep.id === "done" && (
            <div className="flex flex-col gap-2">
              {[
                { label: "AI Provider", value: `${LLM_PROVIDERS.find(p => p.id === llmProvider)?.label} · ${authMode !== "none" ? (providerCfg.modeLabels[authMode] || authMode) : "—"}` },
                { label: "Transcription", value: ASR_PROVIDERS.find(p => p.id === asrProvider)?.label || "" },
                { label: "Keamanan", value: "API keys tersimpan di OS Keychain" },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border/40 bg-muted/5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-[11px] text-muted-foreground shrink-0">{row.label}:</span>
                    <span className="text-[11px] font-medium truncate">{row.value}</span>
                  </div>
                </div>
              ))}
              <div className="mt-2 p-3 rounded-md border border-primary/20 bg-primary/5 text-center">
                <p className="text-xs font-medium text-primary">AutoClipper siap digunakan 🚀</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer nav ── */}
        <div className="px-6 py-3 border-t border-border/40 bg-muted/5 flex items-center justify-between gap-3">
          <button onClick={() => setStep(s => Math.max(s - 1, 0))}
            disabled={step === 0 || saving}
            className="flex items-center gap-1 h-7 px-3 rounded-md border border-border/50 bg-card hover:bg-muted/20 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all disabled:opacity-30">
            <ChevronLeft className="h-3.5 w-3.5" />Kembali
          </button>

          <button onClick={() => { if (step >= totalSteps - 1) { handleNext(); } else { handleNext(); } }}
            disabled={saving}
            className="flex items-center gap-1 h-7 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            {step === totalSteps - 1 ? "Selesai" : "Lanjut"}
            {step < totalSteps - 1 && <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Skip link ── */}
      <div className="mt-3 h-6">
        {step < totalSteps - 1 && (
          <button onClick={handleSkip}
            className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground hover:underline underline-offset-4 transition-colors">
            Lewati dan atur nanti
          </button>
        )}
      </div>

    </div>
  );
}
