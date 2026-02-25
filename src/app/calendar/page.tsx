"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Youtube, Music2, Facebook } from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<{ id: string; payloadJson: string; scheduledAt: string; status: string }[]>([]);

  useEffect(() => {
    loadScheduledJobs();
  }, []);

  const loadScheduledJobs = async () => {
    try {
      const api = window.electronAPI as unknown as { dbGetScheduledJobs: () => Promise<{ success: boolean; jobs?: { id: string; payloadJson: string; scheduledAt: string; status: string }[] }> };
      if (!api) return;
      const res = await api.dbGetScheduledJobs();
      if (res.success && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const end = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
    return eachDayOfInterval({ start, end });
  };

  const getPlatformIcon = (payloadStr: string) => {
    try {
      const payload = JSON.parse(payloadStr);
      if (payload.platform === 'youtube') return <Youtube className="w-3 h-3 text-red-500" />;
      if (payload.platform === 'tiktok') return <Music2 className="w-3 h-3 text-cyan-400" />;
      if (payload.platform === 'facebook') return <Facebook className="w-3 h-3 text-blue-500" />;
    } catch {}
    return <CalIcon className="w-3 h-3" />;
  };

  const days = getDaysInMonth();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Calendar 🗓️</h2>
          <p className="text-muted-foreground text-sm mt-1">Jadwalkan postingan klip ke platform media sosial.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{format(currentDate, "MMMM yyyy")}</CardTitle>
            <CardDescription>Drag and drop support coming in v2.0</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center font-medium text-xs text-muted-foreground p-2">{d}</div>
            ))}
            
            {days.map((day, i) => {
              const pendingJobs = jobs.filter(j => j.scheduledAt && isSameDay(new Date(j.scheduledAt), day));
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();

              return (
                <div 
                  key={i} 
                  className={`min-h-[100px] border rounded-lg p-2 transition-colors hover:border-primary/50 ${
                    isCurrentMonth ? "bg-card" : "bg-muted/30 text-muted-foreground/50"
                  }`}
                >
                  <div className="text-xs font-medium mb-1">{format(day, "d")}</div>
                  <div className="space-y-1">
                    {pendingJobs.map(job => (
                      <div key={job.id} title={job.payloadJson} className="flex flex-col gap-1 p-1.5 rounded bg-primary/10 text-[10px] leading-tight overflow-hidden">
                        <div className="flex items-center gap-1 font-medium">
                          {getPlatformIcon(job.payloadJson)}
                          <span className="truncate">{JSON.parse(job.payloadJson || "{}").title || "Draft"}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-70">
                          <span>{format(new Date(job.scheduledAt), "HH:mm")}</span>
                          <span className="uppercase text-[8px] tracking-wider font-semibold">{job.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
