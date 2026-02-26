"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Calendar, Clock, Star, RefreshCw } from "lucide-react";

interface ScheduledJob {
  id: string;
  type: string;
  status: string;
  scheduledAt: string;
  title?: string;
  platform?: string;
}

interface OptimalTime {
  bestTime: string;
  avgViews: number;
}

interface CalendarData {
  grouped: Record<number, ScheduledJob[]>;
}

const STATUS_COLORS: Record<string, string> = {
  QUEUED: "bg-muted text-muted-foreground",
  PROCESSING: "bg-blue-500/20 text-blue-400",
  COMPLETED: "bg-green-500/20 text-green-400",
  FAILED: "bg-red-500/20 text-red-400",
};

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "text-red-400",
  tiktok: "text-cyan-400",
  facebook: "text-blue-400",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [calData, setCalData] = useState<CalendarData>({ grouped: {} });
  const [loading, setLoading] = useState(true);
  const [optimals, setOptimals] = useState<Record<string, OptimalTime>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const api = window.electronAPI as unknown as {
        calendarGetMonth?: (opts: { year: number; month: number }) => Promise<{ success: boolean; grouped?: Record<number, ScheduledJob[]> }>;
        calendarGetOptimalTimes?: () => Promise<{ success: boolean; suggestions?: Record<string, OptimalTime> }>;
      };

      const [calRes, optRes] = await Promise.all([
        api.calendarGetMonth?.({ year, month }),
        api.calendarGetOptimalTimes?.(),
      ]);

      if (calRes?.success) setCalData({ grouped: calRes.grouped || {} });
      if (optRes?.success && optRes.suggestions) setOptimals(optRes.suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { loadCalendar(); }, [loadCalendar]);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  // Build calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedJobs = selectedDay ? (calData.grouped[selectedDay] || []) : [];

  return (
    <div className="grid gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Content Calendar
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage scheduled posts. Click a day to see details.
          </p>
        </div>
        <Button onClick={loadCalendar} disabled={loading} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="md:col-span-2 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">{MONTHS[month - 1]} {year}</h3>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="py-1 font-medium">{d}</div>
            ))}
          </div>

          {/* Calendar Cells */}
          {loading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
                const jobs = calData.grouped[day] || [];
                const isSelected = selectedDay === day;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(prev => prev === day ? null : day)}
                    className={`
                      min-h-[64px] p-1 rounded-lg border cursor-pointer transition-all
                      ${isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}
                      ${isToday ? "ring-1 ring-primary" : ""}
                    `}
                  >
                    <div className={`text-[11px] font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {jobs.slice(0, 2).map(job => (
                        <div
                          key={job.id}
                          className={`text-[9px] px-1 py-0.5 rounded truncate ${STATUS_COLORS[job.status] || "bg-muted text-muted-foreground"}`}
                        >
                          {job.title || job.type}
                        </div>
                      ))}
                      {jobs.length > 2 && (
                        <div className="text-[9px] text-muted-foreground px-1">+{jobs.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Day Jobs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {selectedDay ? `${MONTHS[month - 1]} ${selectedDay}` : "Select a day"}
              </CardTitle>
              <CardDescription className="text-xs">
                {selectedDay ? `${selectedJobs.length} scheduled post${selectedJobs.length !== 1 ? "s" : ""}` : "Click on a calendar day to see its posts"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedJobs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No posts scheduled for this day.</p>
              ) : (
                selectedJobs.map(job => (
                  <div key={job.id} className="p-2 rounded-lg border border-border/50 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium truncate flex-1">{job.title || job.type}</p>
                      <Badge className={`text-[9px] shrink-0 ${STATUS_COLORS[job.status] || ""}`}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{new Date(job.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {job.platform && (
                        <span className={`capitalize ${PLATFORM_COLORS[job.platform] || ""}`}>
                          {job.platform}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Optimal Posting Times */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-yellow-400" />
                Optimal Posting Times
              </CardTitle>
              <CardDescription className="text-xs">Based on your analytics data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries({ youtube: "YouTube", tiktok: "TikTok", facebook: "Facebook" }).map(([platform, label]) => {
                const opt = optimals[platform];
                return (
                  <div key={platform} className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${PLATFORM_COLORS[platform] || ""}`}>{label}</span>
                    <span className="text-muted-foreground font-mono">
                      {opt ? opt.bestTime : "--:--"}
                    </span>
                  </div>
                );
              })}
              {Object.keys(optimals).length === 0 && (
                <p className="text-[10px] text-muted-foreground">Post clips to get personalized suggestions.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
