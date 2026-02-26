"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, CheckCircle2, Loader2, Save, Bot, Mic, KeySquare, Blocks, Settings2, Palette, Zap, HardDrive, FolderOpen, RotateCcw } from "lucide-react";

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
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [deepgramKey,   setDeepgramKey]   = useState("");
  const [assemblyaiKey, setAssemblyaiKey] = useState("");

  // ---- OAuth App Credentials ----
  const [googleClientId,  setGoogleClientId]  = useState("");
  const [tiktokClientKey, setTiktokClientKey] = useState("");
  const [facebookAppId,   setFacebookAppId]   = useState("");
  const [pexelsApiKey,    setPexelsApiKey]    = useState("");

  // ---- AI Selection ----
  const [llmProvider,   setLlmProvider]   = useState("");
  const [llmModel,      setLlmModel]      = useState("");
  const [asrProvider,   setAsrProvider]   = useState("");
  const [asrModel,      setAsrModel]      = useState("");

  // ---- Local AI ----
  const [localAiType,  setLocalAiType]  = useState("");
  const [localAiUrl,   setLocalAiUrl]   = useState("");
  const [localModel,   setLocalModel]   = useState("");

  // ---- Config from Electron ----
  const [aiConfig,  setAiConfig]  = useState<AIConfig | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [isKeysSaving, setIsKeysSaving] = useState(false);
  const [isKeysSaved,  setIsKeysSaved]  = useState(false);
  
  // Track initialization to prevent auto-save on first load
  const isLoadedRef = useRef(false);
  const [localNotice, setLocalNotice] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // ---- Brand Kits State ----
  const [presets, setPresets] = useState<{ id: string; name: string; fontFamily: string; primaryColor: string; outlineColor: string; alignment: string; marginV: string }[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [presetFont, setPresetFont] = useState("Arial");
  const [presetPrimaryColor, setPresetPrimaryColor] = useState("&H0000FFFF");
  const [presetOutlineColor, setPresetOutlineColor] = useState("&H00000000");
  const [presetAlignment, setPresetAlignment] = useState("2");
  const [presetMarginV, setPresetMarginV] = useState("150");

  // ---- Autopilot State ----
  const [autopilotActive, setAutopilotActive] = useState(false);
  const [autopilotKeywords, setAutopilotKeywords] = useState("podcast clips, motivation, interview highlights");
  const [autopilotPlatform, setAutopilotPlatform] = useState("youtube");
  const [autopilotLimit, setAutopilotLimit] = useState(3);
  const [autopilotSaving, setAutopilotSaving] = useState(false);
  const [autopilotRunning, setAutopilotRunning] = useState(false);
  const [autopilotMsg, setAutopilotMsg] = useState<{text: string; type: 'success'|'error'|'info'} | null>(null);

  // ---- Storage Paths State ----
  type DirEntry = { current: string; default: string };
  const [storageDirs, setStorageDirs] = useState<Record<string, DirEntry>>({
    clips:      { current: '', default: '' },
    brollCache: { current: '', default: '' },
    autopilot:  { current: '', default: '' },
  });
  const [storageMsg, setStorageMsg] = useState<{text: string; type: 'success'|'error'} | null>(null);

  const api = typeof window !== "undefined" ? window.electronAPI : undefined;

  const loadPresets = async () => {
    if (!api?.dbGetThemePresets) return;
    const res = await api.dbGetThemePresets();
    if (res.success && res.presets) setPresets(res.presets);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!api) { setStatusMsg("Preview mode — settings saved locally only."); return; }

      try {
        if (api.aiGetConfig) {
          const cfg = await api.aiGetConfig();
          setAiConfig(cfg as AIConfig);
        }

        const load = async (k: string) => (await api.getKey(k))?.value || "";
        
        // Load settings
        setLlmProvider(  await load("ai_scoring_provider") || "openai");
        setLlmModel(     await load("ai_scoring_model")    || "gpt-5-mini");
        setAsrProvider(  await load("asr_provider")        || "deepgram");
        setAsrModel(     await load("asr_model")           || "nova-3");
        setLocalAiType(  await load("local_ai_type")       || "ollama");
        setLocalAiUrl(   await load("local_ai_url")        || "http://localhost:11434");
        setLocalModel(   await load("local_model_name")    || "llama3.2");

        // Load keys
        setOpenaiKey(    await load("openai_key"));
        setGeminiKey(    await load("gemini_api_key"));
        setClaudeKey(    await load("claude_api_key"));
        setGroqKey(      await load("groq_api_key"));
        setMistralKey(   await load("mistral_api_key"));
        setCohereKey(    await load("cohere_api_key"));
        setElevenLabsKey(await load("elevenlabs_key"));
        setDeepgramKey(  await load("deepgram_key"));
        setAssemblyaiKey(await load("assemblyai_key"));
        
        // OAuth Apps
        setGoogleClientId(  await load("oauth_google_client_id"));
        setTiktokClientKey( await load("oauth_tiktok_client_key"));
        setFacebookAppId(   await load("oauth_facebook_app_id"));
        setPexelsApiKey(    await load("pexels_api_key"));

        // Wait a tick before marking loaded to prevent initial auto-saves
        setTimeout(() => { isLoadedRef.current = true; }, 100);
        
        await loadPresets();

        // Load Autopilot Config
        if (api.autopilotGetConfig) {
          const apRes = await api.autopilotGetConfig();
          if (apRes?.success && apRes.config) {
            setAutopilotActive(apRes.config.isActive ?? false);
            setAutopilotKeywords(apRes.config.keywords ?? '');
            setAutopilotPlatform(apRes.config.targetPlatform ?? 'youtube');
            setAutopilotLimit(apRes.config.maxDailyDownloads ?? 3);
          }
        }

        // Load Storage Directory Settings
        if (api.storageDirsGet) {
          const sdRes = await api.storageDirsGet();
          if (sdRes?.success && sdRes.dirs) {
            setStorageDirs(sdRes.dirs as Record<string, DirEntry>);
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    
    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotice = (msg: string, type: 'success' | 'error' = 'success') => {
    setLocalNotice({ msg, type });
    setTimeout(() => setLocalNotice(null), 3000);
  };

  const autoSaveSetting = async (key: string, value: string) => {
    if (!isLoadedRef.current || !api?.setKey) return;
    try {
      await api.setKey(key, value);
      showNotice("Auto-saved", "success");
    } catch (e) {
      console.error(e);
      showNotice("Failed to save", "error");
    }
  };

  const handleSaveKeys = async () => {
    setIsKeysSaving(true);
    setIsKeysSaved(false);
    if (api?.setKey) {
      const pairs: [string, string][] = [
        ["openai_key",        openaiKey],
        ["gemini_api_key",    geminiKey],
        ["claude_api_key",    claudeKey],
        ["groq_api_key",      groqKey],
        ["mistral_api_key",   mistralKey],
        ["cohere_api_key",    cohereKey],
        ["elevenlabs_key",    elevenLabsKey],
        ["deepgram_key",      deepgramKey],
        ["assemblyai_key",    assemblyaiKey],
        ["oauth_google_client_id",  googleClientId],
        ["oauth_tiktok_client_key", tiktokClientKey],
        ["oauth_facebook_app_id",   facebookAppId],
        ["pexels_api_key",          pexelsApiKey],
      ];
      
      try {
        for (const [key, val] of pairs) {
          if (val !== undefined) await api.setKey(key, val);
        }
        setIsKeysSaved(true);
        setTimeout(() => setIsKeysSaved(false), 3000);
      } catch (e) {
        console.error("Failed to save keys", e);
        setStatusMsg("❌ Failed to save keys");
      }
    }
    setIsKeysSaving(false);
  };

  const handleAuth = async (provider: string) => {
    if (!api?.authLogin) { setStatusMsg("OAuth requires Electron."); return; }
    setStatusMsg(`Opening ${provider} login...`);
    const res = await api.authLogin(provider);
    setStatusMsg(res.success ? `✅ ${provider} connected!` : `❌ ${res.error}`);
    setTimeout(() => setStatusMsg(""), 5000);
  };

  const pbLlmModels: ModelOption[] = llmProvider ? (aiConfig?.llmModels[llmProvider] || []) : [];
  const pbAsrModels: string[] = asrProvider ? (aiConfig?.asrModels[asrProvider] || []) : [];

  const KeyRow = ({ label, value, setter, placeholder, obscure = true }: { label: string; value: string; setter: (v: string) => void; placeholder?: string; obscure?: boolean }) => (
    <div className="space-y-1">
      <Label className="text-xs font-semibold">{label}</Label>
      <Input type={obscure ? "password" : "text"} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder || "sk-..."} className="h-9 transition-colors focus-visible:ring-primary" />
    </div>
  );

  // ---- Brand Kits handlers ----
  const handleCreatePreset = async () => {
    if (!api?.dbCreateThemePreset) { setStatusMsg("Requires Electron"); return; }
    if (!newPresetName) { showNotice("Preset name is required.", "error"); return; }
    
    setIsKeysSaving(true);
    try {
      const res = await api.dbCreateThemePreset({
        name: newPresetName,
        fontFamily: presetFont,
        primaryColor: presetPrimaryColor,
        outlineColor: presetOutlineColor,
        alignment: presetAlignment,
        marginV: presetMarginV
      });
      
      if (res.success) {
        showNotice(`Preset '${newPresetName}' created!`, "success");
        setNewPresetName("");
        loadPresets();
      } else {
        showNotice(`Error: ${res.error}`, "error");
      }
    } catch (e) {
      console.error(e);
      showNotice("Failed to create preset", "error");
    } finally {
      setIsKeysSaving(false);
    }
  };

  const handleDeletePreset = async (id: string) => {
    if (!api?.dbDeleteThemePreset) return;
    try {
      const res = await api.dbDeleteThemePreset(id);
      if (res.success) {
        showNotice("Preset deleted.", "success");
        loadPresets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl pb-10 relative">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your core system preferences and external dependencies.</p>
      </div>

      {statusMsg && <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">{statusMsg}</div>}

      {/* Floating Auto-save indicator */}
      <div className={`fixed bottom-8 right-8 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 transition-all duration-300 transform z-50 ${localNotice ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95 pointer-events-none"} ${localNotice?.type === 'error' ? 'bg-destructive/95 text-destructive-foreground border-destructive' : 'bg-background/95 backdrop-blur-md border-border text-foreground'}`}>
        {localNotice?.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : null}
        <span className="text-sm font-semibold">{localNotice?.msg}</span>
      </div>

      <Tabs defaultValue="models" className="flex flex-col md:flex-row gap-8 w-full items-start mt-8">
        <TabsList className="relative flex flex-col h-auto justify-start items-stretch bg-transparent space-y-2 w-full md:w-64 p-0 shrink-0">
          <TabsTrigger value="models" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <Bot className="w-4 h-4 text-muted-foreground" />
            AI Scoring Models
          </TabsTrigger>
          <TabsTrigger value="transcription" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <Mic className="w-4 h-4 text-muted-foreground" />
            Transcription
          </TabsTrigger>
          <TabsTrigger value="keys" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <KeySquare className="w-4 h-4 text-muted-foreground" />
            API Credentials
          </TabsTrigger>
          <TabsTrigger value="integrations" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <Blocks className="w-4 h-4 text-muted-foreground" />
            App Integrations
          </TabsTrigger>
          <TabsTrigger value="brandkits" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <Palette className="w-4 h-4 text-muted-foreground" />
            Brand Kits
          </TabsTrigger>
          <TabsTrigger value="advanced" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            Advanced Modules
          </TabsTrigger>
          <TabsTrigger value="autopilot" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <Zap className="w-4 h-4 text-muted-foreground" />
            Autopilot
          </TabsTrigger>
          <TabsTrigger value="storage" className="w-full justify-start items-center px-4 py-2.5 hover:bg-muted/50 data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all text-sm font-medium gap-3">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            Storage & Paths
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full min-w-0">
          
          {/* ── AI Scoring Models ──────────────────────────── */}
          <TabsContent value="models" className="m-0 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-5">
                <CardTitle>AI Scoring Models</CardTitle>
                <CardDescription>Configure the Large Language Model used to evaluate and cut your video clips. Auto-saved on change.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold text-sm">Provider</Label>
                    <select 
                      className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      value={llmProvider} 
                      onChange={e => { 
                        const p = e.target.value;
                        setLlmProvider(p); 
                        setLlmModel(""); 
                        autoSaveSetting("ai_scoring_provider", p);
                      }}
                    >
                      <option value="" disabled>Select a provider...</option>
                      {(aiConfig?.llmProviders || [{ id: "openai", label: "OpenAI" }, { id: "gemini", label: "Google Gemini" }, { id: "claude", label: "Anthropic Claude" }, { id: "groq", label: "Groq" }, { id: "mistral", label: "Mistral AI" }, { id: "cohere", label: "Cohere" }, { id: "local", label: "Local (Ollama / LM Studio)" }])
                        .map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>
                  {llmProvider === "local" ? (
                    <div className="space-y-3">
                      <Label className="font-semibold text-sm">Local Model Name</Label>
                      <Input 
                        className="h-10" 
                        value={localModel} 
                        onChange={e => setLocalModel(e.target.value)} 
                        onBlur={e => autoSaveSetting("local_model_name", e.target.value)}
                        placeholder="llama3.2, gemma3, mistral..." 
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label className="font-semibold text-sm">Scoring Model</Label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        value={llmModel} 
                        onChange={e => {
                          const m = e.target.value;
                          setLlmModel(m);
                          autoSaveSetting("ai_scoring_model", m);
                        }}
                        disabled={!llmProvider}
                      >
                        <option value="" disabled>Select a model...</option>
                        {pbLlmModels.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                
                {llmProvider === "local" && (
                  <div className="grid md:grid-cols-2 gap-6 bg-muted/30 p-5 rounded-lg border border-border mt-2">
                    <div className="space-y-3">
                      <Label className="font-semibold text-sm text-foreground/80">Local AI Backend</Label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background" 
                        value={localAiType} 
                        onChange={e => {
                          const t = e.target.value;
                          setLocalAiType(t);
                          autoSaveSetting("local_ai_type", t);
                        }}
                      >
                        <option value="ollama">Ollama</option>
                        <option value="openai_compatible">OpenAI-Compatible (LM Studio)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold text-sm text-foreground/80">Local API URL</Label>
                      <Input 
                        className="h-10 bg-background" 
                        value={localAiUrl} 
                        onChange={e => setLocalAiUrl(e.target.value)} 
                        onBlur={e => autoSaveSetting("local_ai_url", e.target.value)}
                        placeholder="http://localhost:11434" 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Transcription ──────────────────────────── */}
          <TabsContent value="transcription" className="m-0 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-5">
                <CardTitle>Transcription Engine</CardTitle>
                <CardDescription>Select the Speech-to-Text provider used to generate accurate captions from your videos.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-3">
                  <Label className="font-semibold text-sm">ASR Provider</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    value={asrProvider} 
                    onChange={e => { 
                      const p = e.target.value;
                      setAsrProvider(p); 
                      setAsrModel(""); 
                      autoSaveSetting("asr_provider", p);
                    }}
                  >
                    <option value="" disabled>Select a provider...</option>
                    {(aiConfig?.asrProviders || [{ id: "deepgram", label: "Deepgram" }, { id: "openai_whisper", label: "OpenAI Whisper" }, { id: "assemblyai", label: "AssemblyAI" }])
                      .map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-sm">ASR Model</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    value={asrModel} 
                    onChange={e => {
                      const m = e.target.value;
                      setAsrModel(m);
                      autoSaveSetting("asr_model", m);
                    }}
                    disabled={!asrProvider}
                  >
                    <option value="" disabled>Select a model...</option>
                    {(pbAsrModels.length > 0 ? pbAsrModels : ["nova-3", "nova-2", "whisper-1", "best", "nano"])
                      .map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── API Credentials ──────────────────────────── */}
          <TabsContent value="keys" className="m-0 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm border-2 border-primary/20">
              <CardHeader className="bg-primary/5 border-b pb-5">
                <CardTitle>Required Credentials</CardTitle>
                <CardDescription>
                  API keys for the selected Providers above. These execute locally and are securely encrypted in your OS Keychain via <code className="text-xs bg-muted p-1 rounded">keytar</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                  <KeyRow label="OpenAI API Key"     value={openaiKey}     setter={setOpenaiKey}     />
                  <KeyRow label="Google Gemini Key"  value={geminiKey}     setter={setGeminiKey}     placeholder="AIza..." />
                  <KeyRow label="Anthropic Claude"   value={claudeKey}     setter={setClaudeKey}     placeholder="sk-ant-..." />
                  <KeyRow label="Groq API Key"       value={groqKey}       setter={setGroqKey}       placeholder="gsk_..." />
                  <KeyRow label="ElevenLabs Key"     value={elevenLabsKey} setter={setElevenLabsKey} placeholder="sk-eleven..." />
                  <KeyRow label="Deepgram Key"       value={deepgramKey}   setter={setDeepgramKey}   />
                  <KeyRow label="AssemblyAI Key"     value={assemblyaiKey} setter={setAssemblyaiKey}   />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t justify-end py-5">
                <Button onClick={handleSaveKeys} disabled={isKeysSaving} className="min-w-[160px] shadow-sm relative h-10 text-sm font-semibold">
                  {isKeysSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Committing...</>
                  ) : isKeysSaved ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Securely Saved</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save to Keychain</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ── Integrations ──────────────────────────── */}
          <TabsContent value="integrations" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-5">
                <CardTitle>Linked Social Accounts</CardTitle>
                <CardDescription>Authenticate here after saving your Custom App Credentials below to enable Auto-Publishing.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 flex-wrap pt-6">
                <Button variant="outline" className="shadow-sm border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:hover:bg-blue-900/40" onClick={() => handleAuth("youtube")}>Connect YouTube</Button>
                <Button variant="outline" className="shadow-sm border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800" onClick={() => handleAuth("tiktok")}>Connect TikTok</Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/10 border-b pb-5">
                <CardTitle className="text-base">Custom App Credentials</CardTitle>
                <CardDescription>If you prefer to bypass default quota limits, use your own app credentials for data fetching.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-5 pt-6">
                <KeyRow label="Pexels API Key"     value={pexelsApiKey}  setter={setPexelsApiKey} placeholder="Free API key for B-Roll..." obscure={false} />
                <KeyRow label="Google Client ID"   value={googleClientId} setter={setGoogleClientId} placeholder="OAuth ID for YouTube Publish" obscure={false} />
                <KeyRow label="Facebook App ID"    value={facebookAppId}  setter={setFacebookAppId} placeholder="For Instagram Reels API" obscure={false} />
                <KeyRow label="TikTok Client Key"  value={tiktokClientKey} setter={setTiktokClientKey} placeholder="For TikTok Publish API" obscure={false} />
              </CardContent>
              <CardFooter className="bg-muted/10 border-t justify-end py-4">
                 <Button onClick={handleSaveKeys} variant="secondary" size="sm" disabled={isKeysSaving}>
                    <Save className="w-4 h-4 mr-2" /> Save Credentials
                 </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ── Brand Kits ──────────────────────────── */}
          <TabsContent value="brandkits" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm bg-gradient-to-br from-card to-card/50">
              <CardHeader className="border-b pb-5">
                <CardTitle>Create New Brand Kit</CardTitle>
                <CardDescription>Develop distinct visual themes for your auto-generated captions to maintain a consistent style across channels.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="space-y-3">
                  <Label className="font-semibold text-sm">Preset Name</Label>
                  <Input className="h-10 max-w-sm" value={newPresetName} onChange={e => setNewPresetName(e.target.value)} placeholder="e.g. 'Viral Shorts Yellow'" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 py-4">
                  {[
                    { label: "Font Family", value: presetFont, setter: setPresetFont, options: [["Arial","Arial"],["Impact","Impact"],["Roboto","Roboto"],["Comic Sans MS","Comic Sans"],["Montserrat","Montserrat"]] },
                    { label: "Primary Color", value: presetPrimaryColor, setter: setPresetPrimaryColor, options: [["&H0000FFFF","Yellow"],["&H0000FF00","Green"],["&H00FF0000","Blue"],["&H00FFFFFF","White"]] },
                    { label: "Outline Color", value: presetOutlineColor, setter: setPresetOutlineColor, options: [["&H00000000","Black"],["&H000000FF","Red"],["&H00FFFFFF","White"],["&H00808080","Gray"]] },
                    { label: "Alignment", value: presetAlignment, setter: setPresetAlignment, options: [["2","Bottom Center"],["8","Top Center"],["5","Middle Center"]] },
                  ].map(({ label, value, setter, options }) => (
                    <div key={label} className="space-y-2">
                      <Label className="font-semibold text-xs text-muted-foreground">{label}</Label>
                      <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background" value={value} onChange={e => setter(e.target.value)}>
                        {options.map(([val, name]) => <option key={val} value={val}>{name}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label className="font-semibold text-xs text-muted-foreground">Margin Y (px)</Label>
                    <Input type="number" className="h-10" value={presetMarginV} onChange={e => setPresetMarginV(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t justify-end py-4">
                <Button onClick={handleCreatePreset} disabled={isKeysSaving}>
                  {isKeysSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Preset
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presets.length === 0 && (
                <Card className="col-span-full border-dashed bg-muted/10 p-10 flex flex-col justify-center items-center text-muted-foreground space-y-2">
                  <Palette className="w-8 h-8 opacity-20 mb-2" />
                  <span className="text-sm font-medium">No Brand Kits saved yet.</span>
                  <span className="text-xs">Create your first preset above to get started.</span>
                </Card>
              )}
              {presets.map(p => (
                <Card key={p.id} className="overflow-hidden hover:border-primary/40 transition-colors shadow-sm bg-card group">
                  <CardHeader className="pb-3 bg-muted/20 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base truncate font-semibold" title={p.name}>{p.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeletePreset(p.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3 py-5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Font</span>
                      <span className="font-medium bg-secondary px-2 py-0.5 rounded text-xs">{p.fontFamily}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Fill Color</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full shadow-inner border border-border" style={{ backgroundColor: p.primaryColor.includes('FFFF') ? 'yellow' : p.primaryColor.includes('FFFFFF') ? 'white' : p.primaryColor.includes('FF0000') ? 'blue' : 'green' }} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Outline</span>
                      <div className="w-4 h-4 rounded-full shadow-inner border border-border bg-black" />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="text-muted-foreground text-xs">Vertical Margin</span>
                      <span className="text-xs font-medium">{p.marginV}px</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Advanced Features ──────────────────────────── */}
          <TabsContent value="advanced" className="m-0 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-5">
                <CardTitle>Advanced Modules</CardTitle>
                <CardDescription>Enable or disable experimental processing steps in the clipping pipeline.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6">
                <FeatureToggle
                  api={api}
                  getKey="facetrackGetEnabled"
                  setKey="facetrackSetEnabled"
                  title="🎯 Smart Face Tracking"
                  description="Use precise AI detection to automatically frame and follow subjects, keeping them centered in generated 9:16 vertical shorts."
                />
                <FeatureToggle
                  api={api}
                  getKey="dubbingGetEnabled"
                  setKey="dubbingSetEnabled"
                  title="🗣️ Auto-Dubbing Workflow"
                  description="Feed finalized clip scripts back into ElevenLabs to generate multi-language voiceovers for international virality."
                />
                <FeatureToggle
                  api={api}
                  getKey="loggerGetEnabled"
                  setKey="loggerSetEnabled"
                  title="📋 Verbose Diagnostics Logger"
                  description="Write extensive pipeline data and API payloads into a persistent `.log` file on your machine. Useful for debugging."
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Autopilot ──────────────────────────────────────── */}
          <TabsContent value="autopilot" className="m-0 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-500" /> Autopilot</CardTitle>
                    <CardDescription className="mt-1">Otomatis mencari konten viral di YouTube, mengunduh, dan membuat klip — tanpa intervensi manual.</CardDescription>
                  </div>
                  {/* Master Switch */}
                  <button
                    type="button"
                    onClick={async () => {
                      const newValue = !autopilotActive;
                      setAutopilotActive(newValue);
                      const res = await api?.autopilotToggle?.(newValue);
                      if (res?.success) {
                        setAutopilotMsg({ text: newValue ? '🤖 Autopilot aktif! Bot akan mulai bekerja.' : '⏹️ Autopilot dimatikan.', type: newValue ? 'success' : 'info' });
                      } else {
                        setAutopilotMsg({ text: res?.error || 'Gagal mengubah status.', type: 'error' });
                        setAutopilotActive(!newValue); // revert
                      }
                      setTimeout(() => setAutopilotMsg(null), 4000);
                    }}
                    className={[
                      'relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out shadow-sm cursor-pointer',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      autopilotActive ? 'bg-yellow-500' : 'bg-input',
                    ].join(' ')}
                  >
                    <span className={['pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300', autopilotActive ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
                  </button>
                </div>
                {autopilotMsg && (
                  <div className={`mt-3 text-sm px-3 py-2 rounded-md font-medium ${autopilotMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : autopilotMsg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {autopilotMsg.text}
                  </div>
                )}
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Keywords / Niche Target</Label>
                  <Input
                    value={autopilotKeywords}
                    onChange={e => setAutopilotKeywords(e.target.value)}
                    placeholder="podcast clips, motivation, interview highlights"
                  />
                  <p className="text-xs text-muted-foreground">Pisahkan dengan koma. Bot akan memilih satu secara acak setiap siklus.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Platform Sumber</Label>
                    <select
                      value={autopilotPlatform}
                      onChange={e => setAutopilotPlatform(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok (Segera Hadir)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Maks. Download / Hari</Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={autopilotLimit}
                      onChange={e => setAutopilotLimit(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t gap-3 p-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={async () => {
                    setAutopilotRunning(true);
                    setAutopilotMsg({ text: '⏳ Memulai siklus pencarian & download...', type: 'info' });
                    const res = await api?.autopilotRunNow?.();
                    setAutopilotRunning(false);
                    if (res?.success) {
                      setAutopilotMsg({ text: `✅ Berhasil! Project "${res.videoTitle}" telah dibuat secara otomatis.`, type: 'success' });
                    } else {
                      setAutopilotMsg({ text: `❌ ${res?.error || 'Gagal menjalankan.'}`, type: 'error' });
                    }
                    setTimeout(() => setAutopilotMsg(null), 6000);
                  }}
                  disabled={autopilotRunning}
                >
                  {autopilotRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                  Jalankan Sekarang
                </Button>
                <Button
                  onClick={async () => {
                    setAutopilotSaving(true);
                    const res = await api?.autopilotSaveConfig?.({
                      keywords: autopilotKeywords,
                      targetPlatform: autopilotPlatform,
                      maxDailyDownloads: autopilotLimit,
                      isActive: autopilotActive,
                    });
                    setAutopilotSaving(false);
                    if (res?.success) {
                      setAutopilotMsg({ text: '✅ Konfigurasi Autopilot disimpan!', type: 'success' });
                    } else {
                      setAutopilotMsg({ text: `❌ ${res?.error || 'Gagal menyimpan.'}`, type: 'error' });
                    }
                    setTimeout(() => setAutopilotMsg(null), 4000);
                  }}
                  disabled={autopilotSaving}
                >
                  {autopilotSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Simpan Konfigurasi
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ── Storage & Paths ─────────────────────────────────── */}
          <TabsContent value="storage" className="m-0 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-5">
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" /> Storage & Paths
                </CardTitle>
                <CardDescription>Tentukan folder penyimpanan untuk masing-masing kategori. Semua folder harus bisa ditulis.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                {storageMsg && (
                  <div className={`text-sm px-3 py-2 rounded-md font-medium ${storageMsg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {storageMsg.text}
                  </div>
                )}

                {([ 
                  { key: 'clips',      label: '🎬 Hasil Render Klip',       hint: 'Klip MP4 yang sudah dirender oleh FFmpeg' },
                  { key: 'brollCache', label: '📦 Cache B-Roll (Pexels)',   hint: 'Video B-Roll yang diunduh dari Pexels' },
                  { key: 'autopilot',  label: '🤖 Autopilot Downloads',     hint: 'Video yang diunduh otomatis dari YouTube' },
                ] as const).map(({ key, label, hint }) => {
                  const entry = storageDirs[key];
                  const displayPath = entry?.current || entry?.default || '';
                  const isCustom = !!entry?.current;
                  return (
                    <div key={key} className="space-y-2 p-4 border rounded-lg bg-card hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-semibold text-sm">{label}</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
                        </div>
                        {isCustom && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Kustom</span>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 bg-muted/40 rounded-md border px-3 py-1.5 text-xs font-mono text-muted-foreground truncate" title={displayPath}>
                          {displayPath || 'Belum dikonfigurasi'}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          onClick={async () => {
                            const res = await api?.openDirectoryPicker?.({ title: `Pilih folder untuk ${label}` });
                            if (res?.success && res.dirPath) {
                              const saveRes = await api?.storageDirsSet?.(key, res.dirPath);
                              if (saveRes?.success) {
                                setStorageDirs(prev => ({ ...prev, [key]: { ...prev[key], current: res.dirPath! } }));
                                setStorageMsg({ text: `✅ Folder "${label}" diperbarui.`, type: 'success' });
                              } else {
                                setStorageMsg({ text: `❌ Gagal menyimpan: ${saveRes?.error}`, type: 'error' });
                              }
                              setTimeout(() => setStorageMsg(null), 3500);
                            }
                          }}
                        >
                          <FolderOpen className="h-3.5 w-3.5 mr-1.5" /> Pilih
                        </Button>
                        {isCustom && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0 text-muted-foreground"
                            title="Reset ke folder default"
                            onClick={async () => {
                              const saveRes = await api?.storageDirsSet?.(key, '');
                              if (saveRes?.success) {
                                setStorageDirs(prev => ({ ...prev, [key]: { ...prev[key], current: '' } }));
                                setStorageMsg({ text: `↩️ "${label}" direset ke default.`, type: 'success' });
                              }
                              setTimeout(() => setStorageMsg(null), 3000);
                            }}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground/60">
                        Default: <span className="font-mono">{entry?.default || '—'}</span>
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}

// ── Internal: feature toggle component ───────────────────────────
function FeatureToggle({
  api, getKey, setKey, title, description, extra
}: {
  api: typeof window.electronAPI | undefined;
  getKey: string;
  setKey: string;
  title: string;
  description: string;
  extra?: React.ReactNode;
}) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!api) { setEnabled(true); return; }
    const apiRecord = api as unknown as Record<string, () => Promise<{ enabled: boolean }>>;
    if (apiRecord[getKey]) {
      apiRecord[getKey]()
        .then((r: { enabled: boolean }) => setEnabled(r.enabled))
        .catch(() => setEnabled(true));
    } else {
      setEnabled(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    if (enabled === null || !api) return;
    const next = !enabled;
    setEnabled(next);
    const apiRecord = api as unknown as Record<string, (v: boolean) => Promise<unknown>>;
    if (apiRecord[setKey]) {
      await apiRecord[setKey](next);
    }
  };

  return (
    <div className="flex items-center justify-between gap-6 p-5 rounded-xl border bg-card transition-colors hover:bg-muted/10 hover:border-primary/30">
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-[90%]">{description}</p>
        {extra}
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={enabled === null}
        title={enabled ? "Disable" : "Enable"}
        className={[
          "relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out shadow-sm",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          enabled ? "bg-primary" : "bg-input",
          enabled === null ? "opacity-50 cursor-wait" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-spring",
            enabled ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
