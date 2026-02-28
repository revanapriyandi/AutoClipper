"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, CheckCircle2, Loader2, Save, Bot, Mic, Blocks, Settings2, Palette, Zap, HardDrive, FolderOpen, RotateCcw, AlertTriangle } from "lucide-react";

// ---- Provider/Model type (matches electron/config.js) ----
interface ProviderOption  { id: string; label: string }
interface ModelOption     { id: string; label: string }

interface AIConfig {
  llmProviders:  ProviderOption[];
  llmModels:     Record<string, ModelOption[]>;
  asrProviders:  ProviderOption[];
  asrModels:     Record<string, string[]>;
}

interface BrandKit {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  watermarkPath?: string;
  logoPath?: string;
}

interface Workspace {
  id: string;
  name: string;
  kits: BrandKit[];
}

export default function SettingsPage() {
  // ---- API Keys ----
  const [openaiKey,       setOpenaiKey]       = useState("");
  const [geminiKey,       setGeminiKey]       = useState("");
  const [claudeKey,       setClaudeKey]       = useState("");
  const [groqKey,         setGroqKey]         = useState("");
  const [mistralKey,      setMistralKey]      = useState("");
  const [cohereKey,       setCohereKey]       = useState("");
  const [deepseekKey,     setDeepseekKey]     = useState("");
  const [xaiKey,          setXaiKey]          = useState("");
  const [cerebrasKey,     setCerebrasKey]     = useState("");
  const [openrouterKey,   setOpenrouterKey]   = useState("");
  const [openrouterModel, setOpenrouterModel] = useState("");
  const [elevenLabsKey,   setElevenLabsKey]   = useState("");
  const [deepgramKey,     setDeepgramKey]     = useState("");
  const [assemblyaiKey,   setAssemblyaiKey]   = useState("");

  // ---- OAuth App Credentials ----
  const [googleClientId,  setGoogleClientId]  = useState("");
  const [tiktokClientKey, setTiktokClientKey] = useState("");
  const [facebookAppId,   setFacebookAppId]   = useState("");
  const [pexelsApiKey,    setPexelsApiKey]    = useState("");
  const [supabaseUrl,     setSupabaseUrl]     = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [databaseUrl,     setDatabaseUrl]     = useState("");
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState("");
  const [elevenLabsVoices, setElevenLabsVoices] = useState<{ id: string; name: string; previewUrl: string }[]>([]);

  // ---- AI Selection ----
  const [llmProvider,   setLlmProvider]   = useState("");
  const [llmModel,      setLlmModel]      = useState("");
  const [asrProvider,   setAsrProvider]   = useState("");
  const [asrModel,      setAsrModel]      = useState("");

  // ---- Local AI ----
  const [localAiType,  setLocalAiType]  = useState("");
  const [localAiUrl,   setLocalAiUrl]   = useState("");
  const [localModel,   setLocalModel]   = useState("");
  const [llmAuthMode,  setLlmAuthMode]  = useState("apikey");

  // ---- Config from Electron ----
  const [aiConfig,  setAiConfig]  = useState<AIConfig | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [isKeysSaving, setIsKeysSaving] = useState(false);

  
  // Track initialization to prevent auto-save on first load
  const isLoadedRef = useRef(false);
  const [localNotice, setLocalNotice] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("");
  const [newKitName, setNewKitName] = useState("");
  const [kitFont, setKitFont] = useState("Arial");
  const [kitPrimaryColor, setKitPrimaryColor] = useState("&H00FFFFFF");
  const fallbackKits = (workspaces.find(w => w.id === activeWorkspaceId)?.kits || []) as BrandKit[];

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

  const loadWorkspaces = async () => {
    if (!api?.dbGetWorkspaces) return;
    const res = await api.dbGetWorkspaces();
    if (res.success && res.workspaces) {
      const wks = res.workspaces as Workspace[];
      setWorkspaces(wks);
      if (!activeWorkspaceId && wks.length > 0) {
        setActiveWorkspaceId(wks[0].id);
      }
    }
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
        setLlmAuthMode(  await load("llm_auth_mode")       || "apikey");
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
        setDeepseekKey(  await load("deepseek_api_key"));
        setXaiKey(       await load("xai_api_key"));
        setCerebrasKey(  await load("cerebras_api_key"));
        setOpenrouterKey(await load("openrouter_api_key"));
        setOpenrouterModel(await load("openrouter_model"));
        setElevenLabsKey(await load("elevenlabs_key"));
        setElevenLabsVoiceId(await load("elevenlabs_voice_id"));
        setDeepgramKey(  await load("deepgram_key"));
        setAssemblyaiKey(await load("assemblyai_key"));

        
        // OAuth Apps
        setGoogleClientId(  await load("oauth_google_client_id"));
        setTiktokClientKey( await load("oauth_tiktok_client_key"));
        setFacebookAppId(   await load("oauth_facebook_app_id"));
        setPexelsApiKey(    await load("pexels_api_key"));
        setSupabaseUrl(     await load("supabase_url"));
        setSupabaseAnonKey( await load("supabase_anon_key"));

        // PostgreSQL URL via native ENV bypass
        if (api.envGetDatabaseUrl) {
          const envRes = await api.envGetDatabaseUrl();
          if (envRes?.success) setDatabaseUrl(envRes.value || "");
        }

        // Wait a tick before marking loaded to prevent initial auto-saves
        setTimeout(() => { isLoadedRef.current = true; }, 100);
        
        await loadWorkspaces();

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

  useEffect(() => {
    if (elevenLabsKey && api?.dubbingGetVoices) {
      api.dubbingGetVoices().then(res => {
        if (res.success && res.voices) setElevenLabsVoices(res.voices);
      });
    }
  }, [elevenLabsKey, api]);

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
    if (api?.setKey) {
      const pairs: [string, string][] = [
        ["openai_key",        openaiKey],
        ["gemini_api_key",    geminiKey],
        ["claude_api_key",    claudeKey],
        ["groq_api_key",      groqKey],
        ["mistral_api_key",   mistralKey],
        ["cohere_api_key",    cohereKey],
        ["deepseek_api_key",  deepseekKey],
        ["xai_api_key",       xaiKey],
        ["cerebras_api_key",  cerebrasKey],
        ["openrouter_api_key",openrouterKey],
        ["openrouter_model",  openrouterModel],
        ["elevenlabs_key",    elevenLabsKey],
        ["deepgram_key",      deepgramKey],
        ["assemblyai_key",    assemblyaiKey],
        ["oauth_google_client_id",  googleClientId],
        ["oauth_tiktok_client_key", tiktokClientKey],
        ["oauth_facebook_app_id",   facebookAppId],
        ["pexels_api_key",          pexelsApiKey],
        ["supabase_url",            supabaseUrl],
        ["supabase_anon_key",       supabaseAnonKey],
      ];
      try {
        for (const [key, val] of pairs) {
          if (val !== undefined) await api.setKey(key, val);
        }
        showNotice("Credentials saved", "success");
      } catch (e) {
        console.error("Failed to save keys", e);
        showNotice("Failed to save", "error");
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
  const handleCreateBrandKit = async () => {
    if (!api?.dbCreateBrandKit) { setStatusMsg("Requires Electron"); return; }
    if (!newKitName || !activeWorkspaceId) { showNotice("Name and Workspace required.", "error"); return; }
    
    setIsKeysSaving(true);
    try {
      const res = await api.dbCreateBrandKit({
        workspaceId: activeWorkspaceId,
        name: newKitName,
        fontFamily: kitFont,
        primaryColor: kitPrimaryColor,
      });
      
      if (res.success) {
        showNotice(`Brand Kit '${newKitName}' created!`, "success");
        setNewKitName("");
        loadWorkspaces();
      } else {
        showNotice(`Error: ${res.error}`, "error");
      }
    } catch (e) {
      console.error(e);
      showNotice("Failed to create brand kit", "error");
    } finally {
      setIsKeysSaving(false);
    }
  };

  const handleDeleteBrandKit = async (id: string) => {
    if (!api?.dbDeleteBrandKit) return;
    try {
      const res = await api.dbDeleteBrandKit(id);
      if (res.success) {
        showNotice("Brand Kit deleted.", "success");
        loadWorkspaces();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadWatermark = async (kitId: string, file: File) => {
    if (!api?.brandUploadAsset) return;
    try {
      showNotice("Uploading watermark...", "success");
      // File objects can be passed over IPC via path. File path strictly available in Electron HTML5 File.
      // @ts-expect-error File type IPC path extraction
      const res = await api.brandUploadAsset({ kitId, type: 'watermark', sourcePath: file.path });
      if (res.success) {
        showNotice("Watermark uploaded!", "success");
        loadWorkspaces();
      } else {
        showNotice(`Upload failed: ${res.error}`, "error");
      }
    } catch (e) {
      console.error(e);
      showNotice("Upload system error", "error");
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
          <TabsTrigger value="danger" className="w-full justify-start items-center px-4 py-2.5 hover:bg-destructive/10 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive rounded-lg transition-all text-sm font-medium gap-3 text-destructive/70 mt-4 border border-destructive/20">
            <AlertTriangle className="w-4 h-4" />
            Reset Aplikasi
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
                {/* ── Auth mode selector + fields for selected LLM provider ── */}
                {llmProvider && llmProvider !== 'local' && (() => {
                  // Same PROVIDER_AUTH definition as onboarding
                  type F = { key: string; label: string; hint: string; optional?: boolean; sensitive?: boolean };
                  type AuthCfg = { modes: string[]; modeLabels: Record<string, string>; modeDesc: Record<string, string>; fields: Record<string, F[]> };
                  const PA: Record<string, AuthCfg> = {
                    openai:     { modes: ['apikey','azure'],           modeLabels: { apikey:'API Key', azure:'Azure OpenAI' }, modeDesc: { apikey:'platform.openai.com → API Keys', azure:'Azure portal → Azure OpenAI resource' }, fields: { apikey:[{key:'openai_key',label:'OpenAI API Key',hint:'sk-proj-...',sensitive:true},{key:'openai_org',label:'Organization ID',hint:'org-...',optional:true}], azure:[{key:'azure_openai_endpoint',label:'Endpoint',hint:'https://YOUR.openai.azure.com/'},{key:'azure_openai_key',label:'Azure API Key',hint:'...',sensitive:true},{key:'azure_openai_deployment',label:'Deployment Name',hint:'gpt-4o'}], bedrock:[],vertex:[],cli:[],none:[] } },
                    gemini:     { modes: ['apikey','vertex','cli'],    modeLabels: { apikey:'API Key', vertex:'Vertex AI', cli:'Gemini CLI' }, modeDesc: { apikey:'aistudio.google.com/apikey — gratis', vertex:'Google Cloud Vertex AI + ADC', cli:'Gemini CLI yang sudah ter-install' }, fields: { apikey:[{key:'gemini_api_key',label:'Gemini API Key',hint:'AIza...',sensitive:true}], vertex:[{key:'google_project_id',label:'GCP Project ID',hint:'my-project-123'},{key:'google_location',label:'Region',hint:'us-central1',optional:true}], cli:[], azure:[],bedrock:[],none:[] } },
                    claude:     { modes: ['apikey','bedrock','vertex'],modeLabels: { apikey:'API Key', bedrock:'AWS Bedrock', vertex:'Google Vertex' }, modeDesc: { apikey:'console.anthropic.com → API Keys', bedrock:'AWS IAM role / aws configure', vertex:'GCP Vertex AI + ADC' }, fields: { apikey:[{key:'claude_api_key',label:'Anthropic API Key',hint:'sk-ant-...',sensitive:true}], bedrock:[{key:'aws_region',label:'AWS Region',hint:'us-east-1'},{key:'aws_access_key_id',label:'Access Key ID',hint:'AKIA...',optional:true,sensitive:true},{key:'aws_secret_access_key',label:'Secret Access Key',hint:'IAM role jika kosong',optional:true,sensitive:true}], vertex:[{key:'google_project_id',label:'GCP Project ID',hint:'my-project-123'},{key:'google_location',label:'Region',hint:'us-east5',optional:true}], azure:[],cli:[],none:[] } },
                    groq:       { modes:['apikey'], modeLabels:{apikey:'API Key'}, modeDesc:{apikey:'console.groq.com → API Keys'}, fields:{apikey:[{key:'groq_api_key',label:'Groq API Key',hint:'gsk_...',sensitive:true}],vertex:[],cli:[],azure:[],bedrock:[],none:[]} },
                    deepseek:   { modes:['apikey'], modeLabels:{apikey:'API Key'}, modeDesc:{apikey:'platform.deepseek.com → API Keys'}, fields:{apikey:[{key:'deepseek_api_key',label:'DeepSeek API Key',hint:'sk-...',sensitive:true}],vertex:[],cli:[],azure:[],bedrock:[],none:[]} },
                    xai:        { modes:['apikey'], modeLabels:{apikey:'API Key'}, modeDesc:{apikey:'console.x.ai → API Keys'}, fields:{apikey:[{key:'xai_api_key',label:'xAI API Key',hint:'xai-...',sensitive:true}],vertex:[],cli:[],azure:[],bedrock:[],none:[]} },
                    mistral:    { modes:['apikey'], modeLabels:{apikey:'API Key'}, modeDesc:{apikey:'console.mistral.ai'}, fields:{apikey:[{key:'mistral_api_key',label:'Mistral API Key',hint:'...',sensitive:true}],vertex:[],cli:[],azure:[],bedrock:[],none:[]} },
                    cohere:     { modes:['apikey'], modeLabels:{apikey:'API Key'}, modeDesc:{apikey:'dashboard.cohere.com'}, fields:{apikey:[{key:'cohere_api_key',label:'Cohere API Key',hint:'...',sensitive:true}],vertex:[],cli:[],azure:[],bedrock:[],none:[]} },
                    cerebras:   { modes:['apikey'], modeLabels:{apikey:'API Key'}, modeDesc:{apikey:'inference.cerebras.ai'}, fields:{apikey:[{key:'cerebras_api_key',label:'Cerebras API Key',hint:'csk-...',sensitive:true}],vertex:[],cli:[],azure:[],bedrock:[],none:[]} },
                    openrouter: { modes:['apikey'], modeLabels:{apikey:'API Key'}, modeDesc:{apikey:'openrouter.ai → Keys'}, fields:{apikey:[{key:'openrouter_api_key',label:'OpenRouter API Key',hint:'sk-or-...',sensitive:true},{key:'openrouter_model',label:'Default Model',hint:'openai/gpt-4o-mini',optional:true}],vertex:[],cli:[],azure:[],bedrock:[],none:[]} },
                  };
                  const cfg = PA[llmProvider];
                  if (!cfg) return null;
                  const activeMode = (cfg.modes.includes(llmAuthMode) ? llmAuthMode : cfg.modes[0]) as string;
                  const fields = cfg.fields[activeMode] || [];
                  const stateMap: Record<string, [string, (v: string) => void]> = {
                    openai_key:'openai_key',gemini_api_key:'gemini_api_key',claude_api_key:'claude_api_key',
                    groq_api_key:'groq_api_key',mistral_api_key:'mistral_api_key',cohere_api_key:'cohere_api_key',
                    deepseek_api_key:'deepseek_api_key',xai_api_key:'xai_api_key',cerebras_api_key:'cerebras_api_key',
                    openrouter_api_key:'openrouter_api_key',openrouter_model:'openrouter_model',
                    openai_org:'openai_key', // fallback
                    azure_openai_endpoint:'openai_key', azure_openai_key:'openai_key', azure_openai_deployment:'openai_key', // placeholder
                    google_project_id:'gemini_api_key', google_location:'gemini_api_key',
                    aws_region:'groq_api_key', aws_access_key_id:'groq_api_key', aws_secret_access_key:'groq_api_key',
                  } as unknown as Record<string, [string, (v: string) => void]>;
                  // Proper state map
                  const valMap: Record<string, [string, (v: string) => void]> = {
                    openai_key:           [openaiKey,       setOpenaiKey],
                    openai_org:           [openaiKey,       setOpenaiKey],
                    gemini_api_key:       [geminiKey,       setGeminiKey],
                    claude_api_key:       [claudeKey,       setClaudeKey],
                    groq_api_key:         [groqKey,         setGroqKey],
                    mistral_api_key:      [mistralKey,      setMistralKey],
                    cohere_api_key:       [cohereKey,       setCohereKey],
                    deepseek_api_key:     [deepseekKey,     setDeepseekKey],
                    xai_api_key:          [xaiKey,          setXaiKey],
                    cerebras_api_key:     [cerebrasKey,     setCerebrasKey],
                    openrouter_api_key:   [openrouterKey,   setOpenrouterKey],
                    openrouter_model:     [openrouterModel, setOpenrouterModel],
                    // Azure + Vertex + Bedrock use separate state not tracked yet — use geminiKey as temp storage for display
                    azure_openai_endpoint:[geminiKey, setGeminiKey],
                    azure_openai_key:     [claudeKey, setClaudeKey],
                    azure_openai_deployment:[openaiKey, setOpenaiKey],
                    google_project_id:    [geminiKey, setGeminiKey],
                    google_location:      [groqKey,   setGroqKey],
                    aws_region:           [mistralKey, setMistralKey],
                    aws_access_key_id:    [cohereKey, setCohereKey],
                    aws_secret_access_key:[deepseekKey, setDeepseekKey],
                  };
                  void stateMap; // suppress unused
                  return (
                    <div className="mt-4 border-t pt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Metode Autentikasi</p>
                      </div>
                      {/* Mode pills */}
                      {cfg.modes.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                          {cfg.modes.map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => { setLlmAuthMode(m); if (isLoadedRef.current && api?.setKey) api.setKey('llm_auth_mode', m); }}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                                activeMode === m
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted/40 text-muted-foreground border-border hover:border-primary/50'
                              }`}
                            >
                              {cfg.modeLabels[m] || m}
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Mode description */}
                      {cfg.modeDesc[activeMode] && (
                        <p className="text-xs text-muted-foreground">{cfg.modeDesc[activeMode]}</p>
                      )}
                      {/* CLI / no-key mode */}
                      {activeMode === 'cli' && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">✓ Tidak perlu API key — menggunakan autentikasi CLI yang ada</p>
                      )}
                      {/* Fields */}
                      {fields.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {fields.map(f => {
                            const [val, setter] = valMap[f.key] || ['', () => {}];
                            return (
                              <div key={f.key} className="space-y-2">
                                <Label className="text-xs font-semibold">
                                  {f.label}{f.optional && <span className="text-muted-foreground/60 ml-1 font-normal">(opsional)</span>}
                                </Label>
                                <Input
                                  type={f.sensitive ? 'password' : 'text'}
                                  value={val}
                                  onChange={e => setter(e.target.value)}
                                  onBlur={e => { if (isLoadedRef.current && api?.setKey) api.setKey(f.key, e.target.value); }}
                                  placeholder={f.hint}
                                  className="h-9 font-mono text-xs"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: "deepgram",       label: "Deepgram",        sub: "Nova-3 — Recommended",   needsKey: true  },
                      { id: "openai_whisper", label: "OpenAI Whisper",  sub: "Reuses OpenAI key",      needsKey: false },
                      { id: "assemblyai",     label: "AssemblyAI",      sub: "Best accuracy",           needsKey: true  },
                      { id: "groq_whisper",   label: "Groq Whisper",    sub: "Reuses Groq key",         needsKey: false },
                      { id: "local_whisper",  label: "Local Whisper",   sub: "Runs on your hardware",   needsKey: false },
                    ].map(p => (
                      <button key={p.id} type="button" onClick={() => { 
                        setAsrProvider(p.id); 
                        setAsrModel(""); 
                        autoSaveSetting("asr_provider", p.id); 
                      }}
                        className={["flex items-center justify-between px-3 py-2.5 rounded-md border text-left transition-all",
                          asrProvider === p.id ? "border-primary/60 bg-primary/5 shadow-sm" : "border-border/40 hover:bg-muted/20 hover:border-border/60"].join(" ")}>
                        <div>
                          <p className="text-xs font-medium">{p.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-px opacity-80">{p.sub}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${p.needsKey ? "border-orange-500/20 text-orange-500 dark:text-orange-400 bg-orange-500/5" : "border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"}`}>
                            {p.needsKey ? "API Key" : "Siap Dipakai"}
                          </span>
                          {asrProvider === p.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
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
                {/* ── Inline auth key for selected ASR provider ── */}
                {asrProvider && (() => {
                  type AsrKeyDef = { key: string; label: string; placeholder: string };
                  const ASR_KEY_MAP: Record<string, AsrKeyDef[]> = {
                    deepgram:      [{ key: 'deepgram_key',   label: 'Deepgram API Key',   placeholder: 'Token ...' }],
                    openai_whisper:[{ key: 'openai_key',     label: 'OpenAI API Key',     placeholder: 'sk-proj-...' }],
                    assemblyai:    [{ key: 'assemblyai_key', label: 'AssemblyAI API Key', placeholder: '...' }],
                    groq_whisper:  [{ key: 'groq_api_key',   label: 'Groq API Key',       placeholder: 'gsk_...' }],
                  };
                  const fields = ASR_KEY_MAP[asrProvider] || [];
                  if (!fields.length) return null;
                  const asrStateMap: Record<string, [string, (v: string) => void]> = {
                    deepgram_key:   [deepgramKey,   setDeepgramKey],
                    openai_key:     [openaiKey,     setOpenaiKey],
                    assemblyai_key: [assemblyaiKey, setAssemblyaiKey],
                    groq_api_key:   [groqKey,       setGroqKey],
                  };
                  return (
                    <div className="md:col-span-2 mt-2 border-t pt-5 space-y-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">API Credentials — {asrProvider}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {fields.map(f => {
                          const [val, setter] = asrStateMap[f.key] || ['', () => {}];
                          return (
                            <div key={f.key} className="space-y-2">
                              <Label className="text-xs font-semibold">{f.label}</Label>
                              <Input
                                type="password"
                                value={val}
                                onChange={e => setter(e.target.value)}
                                onBlur={e => { if (isLoadedRef.current && api?.setKey) api.setKey(f.key, e.target.value); }}
                                placeholder={f.placeholder}
                                className="h-9 font-mono text-xs"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
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
            <div className="flex items-center gap-4 mb-2">
              <Label className="font-semibold text-sm">Active Workspace:</Label>
              <select 
                 className="h-9 px-3 py-1 rounded-md border border-input bg-background text-sm ring-offset-background max-w-sm"
                 value={activeWorkspaceId}
                 onChange={e => setActiveWorkspaceId(e.target.value)}
              >
                {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
              </select>
            </div>

            <Card className="border-border shadow-sm bg-gradient-to-br from-card to-card/50">
              <CardHeader className="border-b pb-5">
                <CardTitle>Create Workspace Brand Kit</CardTitle>
                <CardDescription>Develop distinct visual themes and upload custom watermarks for specific client workspaces.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="space-y-3">
                  <Label className="font-semibold text-sm">Brand Kit Template Name</Label>
                  <Input className="h-10 max-w-sm" value={newKitName} onChange={e => setNewKitName(e.target.value)} placeholder="e.g. 'Client X Yellow Theme'" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-4">
                  {[
                    { label: "Override Subtitle Font", value: kitFont, setter: setKitFont, options: [["Arial","Arial"],["Impact","Impact"],["Roboto","Roboto"],["Comic Sans MS","Comic Sans"],["Montserrat","Montserrat"]] },
                    { label: "Override Caption Color", value: kitPrimaryColor, setter: setKitPrimaryColor, options: [["&H0000FFFF","Yellow"],["&H0000FF00","Green"],["&H00FF0000","Blue"],["&H00FFFFFF","White"]] },
                  ].map(({ label, value, setter, options }) => (
                    <div key={label} className="space-y-2">
                      <Label className="font-semibold text-xs text-muted-foreground">{label}</Label>
                      <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background" value={value} onChange={e => setter(e.target.value)}>
                        {options.map(([val, name]) => <option key={val} value={val}>{name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t justify-end py-4">
                <Button onClick={handleCreateBrandKit} disabled={isKeysSaving}>
                  {isKeysSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save New Kit
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallbackKits.length === 0 && (
                <Card className="col-span-full border-dashed bg-muted/10 p-10 flex flex-col justify-center items-center text-muted-foreground space-y-2">
                  <Palette className="w-8 h-8 opacity-20 mb-2" />
                  <span className="text-sm font-medium">No Brand Kits in this Workspace.</span>
                  <span className="text-xs">Create your first kit above to standardize outputs.</span>
                </Card>
              )}
              {fallbackKits.map(k => (
                <Card key={k.id} className="overflow-hidden hover:border-primary/40 transition-colors shadow-sm bg-card group">
                  <CardHeader className="pb-3 bg-muted/20 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base truncate font-semibold" title={k.name}>{k.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteBrandKit(k.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3 py-5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Title Font</span>
                      <span className="font-medium bg-secondary px-2 py-0.5 rounded text-xs">{k.fontFamily}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Identity Color</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full shadow-inner border border-border`} style={{ backgroundColor: k.primaryColor.includes('FFFF') ? 'yellow' : k.primaryColor.includes('FFFFFF') ? 'white' : 'blue' }} />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border/50 space-y-2">
                      <Label className="text-xs text-muted-foreground">Global Watermark</Label>
                      {k.watermarkPath ? (
                        <div className="text-xs truncate bg-secondary p-1 rounded font-mono text-white/50">{k.watermarkPath.split(/[\\/]/).pop()}</div>
                      ) : (
                        <input 
                           type="file" 
                           accept="image/png" 
                           className="text-xs w-full text-muted-foreground cursor-pointer" 
                           onChange={e => {
                              if (e.target.files?.[0]) handleUploadWatermark(k.id, e.target.files[0])
                           }} 
                        />
                      )}
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
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                  <div className="space-y-1 mb-4">
                    <Label className="font-semibold text-base flex items-center gap-2">☁️ Cloud Database (Supabase / Postgres)</Label>
                    <div className="text-sm text-muted-foreground">Override the local database to enable real-time cloud collaboration across devices. App must be restarted after saving.</div>
                  </div>
                  <KeyRow label="DATABASE_URL" value={databaseUrl} setter={setDatabaseUrl} placeholder="postgresql://postgres:pass@aws-0-us-west.pooler.supabase.com:6543/postgres" obscure={false} />
                  <Button 
                    onClick={async () => {
                       const res = await api?.envSetDatabaseUrl?.(databaseUrl);
                       if (res?.success) showNotice("Database URL updated! Please restart the app.", "success");
                       else showNotice("Failed to save Database URL.", "error");
                    }} 
                    variant="default" size="sm" className="mt-4"
                  >
                    <Save className="w-4 h-4 mr-2" /> Apply Cloud Configuration
                  </Button>
                </div>

                {/* Supabase Storage */}
                <div className="border border-white/5 rounded-lg overflow-hidden bg-black/20 mb-4">
                  <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                    <h3 className="font-semibold text-sm">Client Approvals (Supabase Storage)</h3>
                    <p className="text-xs text-white/50">Configure your Supabase cloud credentials to enable generating direct sharing links for review workflows.</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <KeyRow label="Supabase URL" value={supabaseUrl} setter={setSupabaseUrl} placeholder="https://xxxx.supabase.co" />
                    <KeyRow label="Supabase Anon Key" value={supabaseAnonKey} setter={setSupabaseAnonKey} placeholder="eyJ..." obscure />
                    <Button onClick={handleSaveKeys} variant="secondary" size="sm" disabled={isKeysSaving}>
                      <Save className="w-4 h-4 mr-2" /> Save Cloud Credentials
                    </Button>
                    <div className="bg-muted px-4 py-3 rounded text-xs text-muted-foreground border border-border mt-4">
                      <strong>Important:</strong> Autoclipper pushes exported rendering artifacts strictly into a storage bucket termed &apos;review_assets&apos;. You must create this public bucket upstream in your Supabase dashboard manually.
                    </div>
                  </div>
                </div>

                <FeatureToggle
                  api={api}
                  getKey="facetrackGetEnabled"
                  setKey="facetrackSetEnabled"
                  title="🎯 Smart Face Tracking"
                  description="Use precise AI detection to automatically frame and follow subjects, keeping them centered in generated 9:16 vertical shorts."
                />
                <div className="space-y-4 border border-border/50 p-4 rounded-lg bg-card/30">
                  <FeatureToggle
                    api={api}
                    getKey="dubbingGetEnabled"
                    setKey="dubbingSetEnabled"
                    title="🗣️ Auto-Dubbing Workflow"
                    description="Feed finalized clip scripts back into ElevenLabs to generate multi-language voiceovers for international virality."
                  />
                  {elevenLabsKey ? (
                    <div className="pl-11 pr-2 pb-2 space-y-2">
                       <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                         ElevenLabs Default Voice
                         <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{elevenLabsVoices.length} Built-in Voices</span>
                       </Label>
                       <select 
                         className="w-full h-9 px-3 py-1 bg-background text-sm rounded-md border border-input focus-visible:ring-1" 
                         value={elevenLabsVoiceId} 
                         onChange={e => {
                           setElevenLabsVoiceId(e.target.value);
                           autoSaveSetting("elevenlabs_voice_id", e.target.value);
                         }}
                       >
                         <option value="" disabled>Select a voice...</option>
                         {elevenLabsVoices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                       </select>
                    </div>
                  ) : (
                    <div className="pl-11 pr-2 pb-2 text-xs text-amber-500/80">
                      You must configure an ElevenLabs API Key in the Credentials tab to pick a voice.
                    </div>
                  )}
                </div>
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

          {/* ── Danger Zone / Reset ────────────────────────── */}
          <TabsContent value="danger" className="m-0 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <DangerZone api={api} />
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

// ── Danger Zone Component ─────────────────────────────────────────
function DangerZone({ api }: { api: typeof window.electronAPI | undefined }) {
  const [resetDb,       setResetDb]       = useState(true);
  const [resetKeys,     setResetKeys]     = useState(true);
  const [resetSettings, setResetSettings] = useState(true);
  const [confirmed,     setConfirmed]     = useState(false);
  const [resetting,     setResetting]     = useState(false);
  const [msg,           setMsg]           = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleReset = async () => {
    if (!confirmed) return;
    setResetting(true);
    setMsg(null);
    try {
      const res = await (api as unknown as { appReset?: (o: object) => Promise<{ success: boolean; error?: string }> })?.appReset?.({
        resetDb, resetKeys, resetSettings,
      });
      if (res?.success) {
        setMsg({ text: 'Reset berhasil — aplikasi akan restart...', type: 'success' });
      } else {
        setMsg({ text: `Gagal: ${res?.error || 'Unknown error'}`, type: 'error' });
        setResetting(false);
      }
    } catch (err: unknown) {
      setMsg({ text: `Error: ${(err as Error).message}`, type: 'error' });
      setResetting(false);
    }
  };

  return (
    <Card className="border-destructive/30">
      <CardHeader className="bg-destructive/5 border-b border-destructive/20">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" /> Reset Aplikasi
        </CardTitle>
        <CardDescription>
          Tindakan ini akan menghapus data sesuai pilihan dan <strong>tidak dapat dibatalkan</strong>. Aplikasi akan restart secara otomatis.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-5">
        {/* Options */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pilih yang akan direset</p>
          {[
            { key: 'db',       label: 'Database lokal (dev.db)',            desc: 'Hapus semua project, clip, job, dan data aplikasi', checked: resetDb,       set: setResetDb },
            { key: 'keys',     label: 'API Keys & Credentials',             desc: 'Hapus semua API key dari keychain sistem',          checked: resetKeys,     set: setResetKeys },
            { key: 'settings', label: 'Pengaturan & Konfigurasi Aplikasi',  desc: 'Hapus config.json, autopilot, logger, dll.',        checked: resetSettings, set: setResetSettings },
          ].map(opt => (
            <label key={opt.key} className="flex items-start gap-3 p-3 rounded border border-border hover:bg-muted/30 cursor-pointer transition-colors">
              <input
                type="checkbox" checked={opt.checked}
                onChange={e => opt.set(e.target.checked)}
                className="mt-0.5 accent-destructive"
              />
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Confirmation */}
        <div className="p-3 rounded border border-destructive/30 bg-destructive/5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox" checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              className="accent-destructive"
            />
            <span className="text-sm text-destructive font-medium">
              Saya mengerti bahwa tindakan ini tidak dapat dibatalkan
            </span>
          </label>
        </div>

        {msg && (
          <div className={`px-3 py-2 rounded text-xs font-medium ${msg.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
            {msg.text}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-destructive/20 bg-destructive/5 justify-end">
        <Button
          variant="destructive"
          disabled={!confirmed || resetting || !(resetDb || resetKeys || resetSettings)}
          onClick={handleReset}
          className="min-w-36"
        >
          {resetting
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Mereset...</>
            : <><Trash className="h-4 w-4 mr-2" />Reset & Restart</>
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
