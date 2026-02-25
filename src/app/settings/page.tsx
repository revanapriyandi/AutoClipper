"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Global window.electronAPI types are declared in src/types/electron.d.ts

// ---- Provider/Model type (matches electron/config.js) ----
interface ProviderOption  { id: string; label: string }
interface ModelOption     { id: string; label: string }

interface AIConfig {
  llmProviders:  ProviderOption[];
  llmModels:     Record<string, ModelOption[]>;
  asrProviders:  ProviderOption[];
  asrModels:     Record<string, string[]>;
}

export default function SettingsPage() {
  // ---- API Keys ----
  const [openaiKey,     setOpenaiKey]     = useState("");
  const [geminiKey,     setGeminiKey]     = useState("");
  const [claudeKey,     setClaudeKey]     = useState("");
  const [groqKey,       setGroqKey]       = useState("");
  const [mistralKey,    setMistralKey]    = useState("");
  const [cohereKey,     setCohereKey]     = useState("");
  const [deepgramKey,   setDeepgramKey]   = useState("");
  const [assemblyaiKey, setAssemblyaiKey] = useState("");

  // ---- AI Selection ----
  const [llmProvider,   setLlmProvider]   = useState("openai");
  const [llmModel,      setLlmModel]      = useState("gpt-5-mini");
  const [asrProvider,   setAsrProvider]   = useState("deepgram");
  const [asrModel,      setAsrModel]      = useState("nova-3");

  // ---- Local AI ----
  const [localAiType,  setLocalAiType]  = useState("ollama");
  const [localAiUrl,   setLocalAiUrl]   = useState("http://localhost:11434");
  const [localModel,   setLocalModel]   = useState("llama3.2");

  // ---- Config from Electron ----
  const [aiConfig,  setAiConfig]  = useState<AIConfig | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [saving,    setSaving]    = useState(false);

  const api = typeof window !== "undefined" ? window.electronAPI : undefined;

  useEffect(() => {
    const load = async () => {
      if (!api) { setStatusMsg("Preview mode — settings saved locally only."); return; }

      // Load AI config from Electron
      if (api.aiGetConfig) {
        const cfg = await api.aiGetConfig();
        setAiConfig(cfg as AIConfig);
      }

      // Load saved keys
      const load = async (k: string) => (await api.getKey(k))?.value || "";
      setOpenaiKey(    await load("openai_key"));
      setGeminiKey(    await load("gemini_api_key"));
      setClaudeKey(    await load("claude_api_key"));
      setGroqKey(      await load("groq_api_key"));
      setMistralKey(   await load("mistral_api_key"));
      setCohereKey(    await load("cohere_api_key"));
      setDeepgramKey(  await load("deepgram_key"));
      setAssemblyaiKey(await load("assemblyai_key"));
      setLlmProvider(  await load("ai_scoring_provider") || "openai");
      setLlmModel(     await load("ai_scoring_model")    || "gpt-5-mini");
      setAsrProvider(  await load("asr_provider")        || "deepgram");
      setAsrModel(     await load("asr_model")           || "nova-3");
      setLocalAiType(  await load("local_ai_type")       || "ollama");
      setLocalAiUrl(   await load("local_ai_url")        || "http://localhost:11434");
      setLocalModel(   await load("local_model_name")    || "llama3.2");
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (api?.setKey) {
      const pairs: [string, string][] = [
        ["openai_key",        openaiKey],
        ["gemini_api_key",    geminiKey],
        ["claude_api_key",    claudeKey],
        ["groq_api_key",      groqKey],
        ["mistral_api_key",   mistralKey],
        ["cohere_api_key",    cohereKey],
        ["deepgram_key",      deepgramKey],
        ["assemblyai_key",    assemblyaiKey],
        ["ai_scoring_provider", llmProvider],
        ["ai_scoring_model",    llmModel],
        ["asr_provider",        asrProvider],
        ["asr_model",           asrModel],
        ["local_ai_type",       localAiType],
        ["local_ai_url",        localAiUrl],
        ["local_model_name",    localModel],
      ];
      for (const [key, val] of pairs) {
        if (val) await api.setKey(key, val);
      }
      setStatusMsg("✅ Settings saved to OS Keychain.");
    } else {
      setStatusMsg("⚠️ Settings saved in memory only (Electron not detected).");
    }
    setSaving(false);
  };

  const handleAuth = async (provider: string) => {
    if (!api?.authLogin) { setStatusMsg("OAuth requires Electron."); return; }
    setStatusMsg(`Opening ${provider} login...`);
    const res = await api.authLogin(provider);
    setStatusMsg(res.success ? `✅ ${provider} connected!` : `❌ ${res.error}`);
  };

  const availableLlmModels: ModelOption[] = aiConfig?.llmModels[llmProvider] || [];
  const availableAsrModels: string[] = aiConfig?.asrModels[asrProvider] || [];

  // ---- Helper: key input row ----
  const KeyRow = ({ label, value, setter, placeholder }: { label: string; value: string; setter: (v: string) => void; placeholder?: string }) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type="password" value={value} onChange={e => setter(e.target.value)} placeholder={placeholder || "sk-..."} className="h-8 text-xs" />
    </div>
  );

  return (
    <div className="grid gap-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage AI providers, models, and API keys.</p>
      </div>

      {statusMsg && <p className="text-sm border p-2 rounded-md bg-muted/30">{statusMsg}</p>}

      {/* ── AI Model Selection ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 AI Scoring Model</CardTitle>
          <CardDescription>Select LLM provider & model for clip scoring.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Provider</Label>
              <select className="w-full border rounded p-1 text-sm" value={llmProvider} onChange={e => { setLlmProvider(e.target.value); setLlmModel(""); }}>
                {(aiConfig?.llmProviders || [{ id: "openai", label: "OpenAI" }, { id: "gemini", label: "Google Gemini" }, { id: "claude", label: "Anthropic Claude" }, { id: "groq", label: "Groq" }, { id: "mistral", label: "Mistral AI" }, { id: "cohere", label: "Cohere" }, { id: "local", label: "Local (Ollama / LM Studio)" }])
                  .map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            {llmProvider === "local" ? (
              <div className="space-y-1">
                <Label className="text-xs">Local Model Name</Label>
                <Input className="h-8 text-xs" value={localModel} onChange={e => setLocalModel(e.target.value)} placeholder="llama3.2, gemma3, mistral..." />
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xs">Model</Label>
                <select className="w-full border rounded p-1 text-sm" value={llmModel} onChange={e => setLlmModel(e.target.value)}>
                  {availableLlmModels.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
            )}
          </div>
          {llmProvider === "local" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Local AI Type</Label>
                <select className="w-full border rounded p-1 text-sm" value={localAiType} onChange={e => setLocalAiType(e.target.value)}>
                  <option value="ollama">Ollama</option>
                  <option value="openai_compatible">OpenAI-Compatible (LM Studio, GPT4All)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Local AI URL</Label>
                <Input className="h-8 text-xs" value={localAiUrl} onChange={e => setLocalAiUrl(e.target.value)} placeholder="http://localhost:11434" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── ASR / Transcription ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>🎙️ Transcription (ASR)</CardTitle>
          <CardDescription>Select speech recognition provider & model.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">ASR Provider</Label>
            <select className="w-full border rounded p-1 text-sm" value={asrProvider} onChange={e => { setAsrProvider(e.target.value); setAsrModel(""); }}>
              {(aiConfig?.asrProviders || [{ id: "deepgram", label: "Deepgram" }, { id: "openai_whisper", label: "OpenAI Whisper" }, { id: "assemblyai", label: "AssemblyAI" }])
                .map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">ASR Model</Label>
            <select className="w-full border rounded p-1 text-sm" value={asrModel} onChange={e => setAsrModel(e.target.value)}>
              {(availableAsrModels.length > 0 ? availableAsrModels : ["nova-3", "nova-2", "whisper-1", "best", "nano"])
                .map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ── API Keys ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>🔑 API Keys</CardTitle>
          <CardDescription>Stored securely in the OS Keychain. Never written to disk.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <KeyRow label="OpenAI API Key"     value={openaiKey}     setter={setOpenaiKey}     />
            <KeyRow label="Google Gemini Key"  value={geminiKey}     setter={setGeminiKey}     placeholder="AIza..." />
            <KeyRow label="Anthropic Claude"   value={claudeKey}     setter={setClaudeKey}     placeholder="sk-ant-..." />
            <KeyRow label="Groq API Key"       value={groqKey}       setter={setGroqKey}       placeholder="gsk_..." />
            <KeyRow label="Mistral API Key"    value={mistralKey}    setter={setMistralKey}    />
            <KeyRow label="Cohere API Key"     value={cohereKey}     setter={setCohereKey}     />
            <KeyRow label="Deepgram Key"       value={deepgramKey}   setter={setDeepgramKey}   />
            <KeyRow label="AssemblyAI Key"     value={assemblyaiKey} setter={setAssemblyaiKey} placeholder="..." />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full mt-2">
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* ── OAuth ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>📱 Social Media OAuth</CardTitle>
          <CardDescription>Connect accounts for scheduled posting. Requires Client IDs in .env file.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={() => handleAuth("youtube")}>Connect YouTube</Button>
          <Button variant="outline" onClick={() => handleAuth("tiktok")}>Connect TikTok</Button>
          <Button variant="outline" onClick={() => handleAuth("facebook")}>Connect Facebook</Button>
        </CardContent>
      </Card>

      {/* ── Advanced Feature Toggles ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Advanced Features</CardTitle>
          <CardDescription>Aktifkan atau nonaktifkan fitur opsional sesuai kebutuhan Anda.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FeatureToggle
            api={api}
            getKey="facetrackGetEnabled"
            setKey="facetrackSetEnabled"
            title="🎯 Face Tracking"
            description="Deteksi wajah pembicara secara otomatis untuk crop 9:16 yang lebih akurat. Menggunakan GPT-4o Vision (jika tersedia) atau analisis frame FFmpeg."
          />
          <FeatureToggle
            api={api}
            getKey="updaterGetEnabled"
            setKey="updaterSetEnabled"
            title="🔄 Auto-Update Check"
            description="Cek update terbaru AutoClipper saat aplikasi dibuka. Update tidak akan otomatis didownload — Anda selalu diminta konfirmasi terlebih dahulu."
            extra={
              <Button variant="outline" size="sm" className="text-xs h-7 mt-2"
                onClick={() => api?.updaterCheckNow?.()}>
                Check Now
              </Button>
            }
          />
          <FeatureToggle
            api={api}
            getKey="loggerGetEnabled"
            setKey="loggerSetEnabled"
            title="📋 Error Logging"
            description="Simpan log error ke file lokal (~/.autoclipper/logs/). Log dirotasi otomatis, maksimal 7 hari. Berguna untuk debugging masalah."
            extra={
              <Button variant="outline" size="sm" className="text-xs h-7 mt-2"
                onClick={async () => { await api?.loggerClearLogs?.(); setStatusMsg("✅ Logs cleared."); }}>
                Clear Logs
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ── Internal: feature toggle component ───────────────────────────
function FeatureToggle({
  api, getKey, setKey, title, description, extra
}: {
  api: Window["electronAPI"] | undefined;
  getKey: string;
  setKey: string;
  title: string;
  description: string;
  extra?: React.ReactNode;
}) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!api) { setEnabled(true); return; }
    const apiRecord = api as unknown as Record<string, unknown>;
    (apiRecord[getKey] as () => Promise<{ enabled: boolean }>)()
      .then(r => setEnabled(r.enabled))
      .catch(() => setEnabled(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    if (enabled === null || !api) return;
    const next = !enabled;
    setEnabled(next);
    const apiRecord = api as unknown as Record<string, unknown>;
    await (apiRecord[setKey] as (v: boolean) => Promise<unknown>)(next);
  };

  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-muted/20">
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        {extra}
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={enabled === null}
        title={enabled ? "Disable" : "Enable"}
        className={[
          "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          enabled ? "bg-primary" : "bg-input",
          enabled === null ? "opacity-50 cursor-wait" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            enabled ? "translate-x-4" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

