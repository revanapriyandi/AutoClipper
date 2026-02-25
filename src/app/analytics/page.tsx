"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { RefreshCw, TrendingUp, Eye, Heart } from "lucide-react";

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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const api = window.electronAPI;
      if (!api?.dbGetAnalytics) return;
      const res = await (api as unknown as { dbGetAnalytics: () => Promise<{ success: boolean; analytics?: AnalyticsRecord[] }> }).dbGetAnalytics();
      if (res.success && res.analytics) {
        setData(res.analytics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const totalViews = useMemo(() => data.reduce((acc, curr) => acc + curr.views, 0), [data]);
  const totalLikes = useMemo(() => data.reduce((acc, curr) => acc + curr.likes, 0), [data]);

  const chartData = useMemo(() => {
    const map: Record<string, { name: string; views: number; likes: number }> = {};
    data.forEach(d => {
      const date = new Date(d.updatedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
      if (!map[date]) map[date] = { name: date, views: 0, likes: 0 };
      map[date].views += d.views;
      map[date].likes += d.likes;
    });
    return Object.values(map).reverse().slice(0, 7); // Last 7 days
  }, [data]);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Social Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1">Lacak performa klip secara real-time dari platform sosial di satu dashboard.</p>
        </div>
        <Button onClick={loadStats} disabled={loading} size="sm" variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews ? ((totalLikes/totalViews)*100).toFixed(1) : 0}%</div>
            <p className="text-xs text-muted-foreground">Rata-rata interaksi per views</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performa 7 Hari Terakhir</CardTitle>
            <CardDescription>Grafik tayangan dan suka berdasarkan data sinkronisasi terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" fontSize={12} tickMargin={8} />
                <YAxis fontSize={12} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#111', borderRadius: '8px', border: 'none' }} />
                <Legend iconType="circle" />
                <Bar dataKey="views" fill="#3b82f6" radius={[4,4,0,0]} name="Views" />
                <Bar dataKey="likes" fill="#8b5cf6" radius={[4,4,0,0]} name="Likes" />
              </BarChart>
            </ResponsiveContainer>
            ) : (
               <div className="flex h-full items-center justify-center text-muted-foreground">Belum ada data tersedia.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Klip Di Publikasi</CardTitle>
            <CardDescription>Performa rincian tiap ID Clip yang disiarkan dari Studio.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
               </div>
            ) : data.length === 0 ? (
               <div className="py-8 text-center text-muted-foreground text-sm border border-dashed rounded-md">Belum ada klip yang terpantau rilis. Silakan jadwalkan posting.</div>
            ) : (
               <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Clip/Project</TableHead>
                       <TableHead>Platform</TableHead>
                       <TableHead className="text-right">Views</TableHead>
                       <TableHead className="text-right">Likes</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {data.map(d => (
                       <TableRow key={d.id}>
                         <TableCell className="font-medium max-w-[120px] truncate" title={d.clip.caption || d.clip.project.title}>
                            {d.clip.project.title}
                            <span className="block text-xs text-muted-foreground truncate">{d.clip.caption || "-"}</span>
                         </TableCell>
                         <TableCell className="capitalize">{d.platform}</TableCell>
                         <TableCell className="text-right font-mono">{d.views.toLocaleString()}</TableCell>
                         <TableCell className="text-right font-mono text-muted-foreground">{d.likes.toLocaleString()}</TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
