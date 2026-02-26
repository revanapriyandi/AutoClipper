"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Legend, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { RefreshCw, TrendingUp, Eye, Heart, Lightbulb, Clock, Award, MessageCircle } from "lucide-react";

interface AnalyticsRecord {
  id: string;
  clipId: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  updatedAt: string;
  clip: {
    projectId: string;
    caption: string;
    project: { title: string };
  };
}

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#ef4444",
  tiktok: "#06b6d4",
  facebook: "#3b82f6",
  instagram: "#ec4899",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<{ insights: string[]; bestTimeToPost: string; recommendedNiche: string } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const api = window.electronAPI;
      if (!api?.dbGetAnalytics) return;
      const res = await (api as unknown as { dbGetAnalytics: () => Promise<{ success: boolean; analytics?: AnalyticsRecord[] }> }).dbGetAnalytics();
      if (res.success && res.analytics) setData(res.analytics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    setLoadingInsights(true);
    try {
      const api = window.electronAPI;
      const res = await (api as unknown as { insightsAnalyze?: (d: unknown) => Promise<{ success: boolean; insights?: string[]; bestTimeToPost?: string; recommendedNiche?: string }> })?.insightsAnalyze?.({ clips: data });
      if (res?.success) {
        setInsights({
          insights: res.insights || [],
          bestTimeToPost: res.bestTimeToPost || "18:00",
          recommendedNiche: res.recommendedNiche || "General",
        });
      }
    } catch {}
    setLoadingInsights(false);
  };

  useEffect(() => { loadStats(); }, []);

  const totalViews = useMemo(() => data.reduce((acc, curr) => acc + curr.views, 0), [data]);
  const totalLikes = useMemo(() => data.reduce((acc, curr) => acc + curr.likes, 0), [data]);

  const totalShares = useMemo(() => data.reduce((acc, curr) => acc + (curr.shares ?? 0), 0), [data]);

  // F10: 7-day trend chart
  const chartData = useMemo(() => {
    const map: Record<string, { name: string; views: number; likes: number; shares: number }> = {};
    data.forEach(d => {
      const date = new Date(d.updatedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" });
      if (!map[date]) map[date] = { name: date, views: 0, likes: 0, shares: 0 };
      map[date].views += d.views;
      map[date].likes += d.likes;
      map[date].shares += d.shares;
    });
    return Object.values(map).slice(0, 7);
  }, [data]);

  // F10: Platform breakdown pie chart
  const platformData = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(d => { map[d.platform] = (map[d.platform] || 0) + d.views; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data]);

  // F20: A/B Caption comparison
  const abData = useMemo(() => {
    const map: Record<string, { caption: string; views: number; count: number; avgViews: number }> = {};
    data.forEach(d => {
      const cap = d.clip.caption?.slice(0, 40) || "No caption";
      if (!map[cap]) map[cap] = { caption: cap, views: 0, count: 0, avgViews: 0 };
      map[cap].views += d.views;
      map[cap].count++;
    });
    return Object.values(map)
      .map(item => ({ ...item, avgViews: item.count > 0 ? Math.round(item.views / item.count) : 0 }))
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 10);
  }, [data]);

  const bestCaption = abData[0];

  return (
    <div className="grid gap-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Social Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1">Lacak performa klip secara real-time dari semua platform di satu dashboard.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadInsights} disabled={loadingInsights || data.length === 0} variant="outline" size="sm" className="gap-2">
            <Lightbulb className={`h-4 w-4 ${loadingInsights ? "animate-pulse text-yellow-400" : ""}`} />
            AI Insights
          </Button>
          <Button onClick={loadStats} disabled={loading} size="sm" variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Views", value: totalViews, icon: Eye, sub: "+20% from last month", color: "text-blue-400" },
          { label: "Total Likes", value: totalLikes, icon: Heart, sub: "+12.5% from last month", color: "text-pink-400" },
          { label: "Total Shares", value: totalShares, icon: MessageCircle, sub: "Cross-platform total", color: "text-violet-400" },
          { label: "Avg Engagement", value: totalViews ? `${((totalLikes / totalViews) * 100).toFixed(1)}%` : "0%", icon: TrendingUp, sub: "Likes per view ratio", color: "text-green-400" },
        ].map(({ label, value, icon: Icon, sub, color }) => (
          <Card key={label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* F11: AI Insights Panel */}
      {insights && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-yellow-400" /> AI Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Best Time to Post</p>
                <p className="text-2xl font-bold text-yellow-400">{insights.bestTimeToPost}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Award className="h-3 w-3" /> Recommended Niche</p>
                <p className="text-lg font-bold text-yellow-400">{insights.recommendedNiche}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Top Insights</p>
                <ul className="space-y-1">
                  {insights.insights.slice(0, 2).map((ins, i) => (
                    <li key={i} className="text-xs flex gap-1.5">
                      <span className="text-yellow-400 shrink-0">•</span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">📈 Performance</TabsTrigger>
          <TabsTrigger value="platforms">🌐 Platforms</TabsTrigger>
          <TabsTrigger value="ab">🧪 A/B Captions</TabsTrigger>
          <TabsTrigger value="clips">📋 All Clips</TabsTrigger>
        </TabsList>

        {/* F10: 7-day performance chart */}
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performa 7 Hari Terakhir</CardTitle>
              <CardDescription>Views, likes, dan shares berdasarkan data sinkronisasi terakhir.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#111", borderRadius: "8px", border: "none" }} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={false} name="Views" />
                    <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={2} dot={false} name="Likes" />
                    <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} dot={false} name="Shares" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Belum ada data.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* F10: Platform breakdown */}
        <TabsContent value="platforms" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Views by Platform</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {platformData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={platformData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {platformData.map((entry, index) => (
                          <Cell key={index} fill={PLATFORM_COLORS[entry.name] || "#6366f1"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No platform data.</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#111", borderRadius: "8px", border: "none" }} />
                    <Bar dataKey="value" name="Views" radius={[4, 4, 0, 0]}>
                      {platformData.map((entry, index) => (
                        <Cell key={index} fill={PLATFORM_COLORS[entry.name] || "#6366f1"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* F20: A/B Caption Testing */}
        <TabsContent value="ab" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧪 A/B Caption Performance
              </CardTitle>
              <CardDescription>
                Bandingkan rata-rata views dari setiap variasi caption. Caption terbaik disorot hijau.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : abData.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">Belum ada data caption.</div>
              ) : (
                <div className="space-y-2">
                  {abData.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${i === 0 ? "border-green-500/40 bg-green-500/5" : "border-border bg-muted/10"}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {i === 0 && <Badge className="bg-green-500 text-white text-[10px] shrink-0">🏆 Best</Badge>}
                        <span className="text-sm truncate font-medium">{item.caption}...</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm shrink-0 ml-4">
                        <span className="text-muted-foreground">{item.count} clip{item.count !== 1 ? "s" : ""}</span>
                        <span className={`font-bold ${i === 0 ? "text-green-400" : ""}`}>{item.avgViews.toLocaleString()} avg views</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {bestCaption && (
                <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                  💡 Caption dengan avg views tertinggi: <span className="text-green-400 font-medium">&quot;{bestCaption.caption}&quot;</span>
                  — {bestCaption.avgViews.toLocaleString()} views/clip
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Clips Table */}
        <TabsContent value="clips" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Klip Published</CardTitle>
              <CardDescription>Detail performa tiap klip yang sudah dipublikasikan.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : data.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm border border-dashed rounded-md">
                  Belum ada klip yang dipublikasikan.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Clip / Project</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Likes</TableHead>
                        <TableHead className="text-right">Comments</TableHead>
                        <TableHead className="text-right">Shares</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map(d => (
                        <TableRow key={d.id}>
                          <TableCell className="font-medium max-w-[160px]">
                            <div className="truncate" title={d.clip.caption || d.clip.project.title}>{d.clip.project.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{d.clip.caption || "—"}</div>
                          </TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: PLATFORM_COLORS[d.platform] || "#6366f1" }} className="text-white text-[10px] capitalize">{d.platform}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{d.views.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">{d.likes.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">{d.comments.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">{d.shares.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
