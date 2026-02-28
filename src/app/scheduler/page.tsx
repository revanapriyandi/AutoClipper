"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Video, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduleModal } from "@/components/ScheduleModal";

interface Job {
  id: string;
  type: string;
  status: string;
  scheduledAt?: string;
  createdAt: string;
  payloadJson: string;
}

export default function SchedulerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [currentDate]);

  const loadJobs = async () => {
    if (!window.electronAPI?.jobGetAll) return;
    try {
      // Fetch specifically jobs that have a POST tag since RENDER jobs aren't scheduled
      const res = await window.electronAPI.jobGetAll({ pageSize: 500 }); // Large page to catch all month
      if (res.success && res.jobs) {
        const fetchJobs = res.jobs as Job[];
        setJobs(fetchJobs.filter((j) => j.type === 'POST' || !!j.scheduledAt));
      }
    } catch (e) {
      console.error("Scheduler fetch failed", e);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToday   = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd   = endOfMonth(monthStart);
  
  // Basic padding to ensure calendar always starts on a Sunday/Monday gracefully
  const startDate = monthStart; 
  const endDate   = monthEnd;
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="flex-1 overflow-auto bg-background animate-in fade-in duration-300">
      <div className="p-8 max-w-[1400px] mx-auto min-h-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-border/50 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-indigo-500" />
              Content Scheduler
            </h1>
            <p className="text-muted-foreground mt-2">Visually manage and schedule automated social media uploads.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button onClick={goToday} variant="outline" className="shadow-sm">Today</Button>
             <div className="flex items-center rounded-md border border-input overflow-hidden shadow-sm">
               <Button onClick={prevMonth} variant="ghost" size="icon" className="rounded-none border-r border-input h-10 w-10"><ChevronLeft className="h-5 w-5" /></Button>
               <div className="px-6 font-semibold text-sm min-w-[150px] text-center w-full">
                 {format(currentDate, "MMMM yyyy")}
               </div>
               <Button onClick={nextMonth} variant="ghost" size="icon" className="rounded-none border-l border-input h-10 w-10"><ChevronRight className="h-5 w-5" /></Button>
             </div>
             <Button onClick={() => setIsModalOpen(true)} variant="default" className="shadow-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white ml-2">
                <Plus className="h-4 w-4 mr-2" /> New Post
             </Button>
          </div>
        </div>

        <Card className="border-border shadow-sm bg-card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border/50 bg-muted/20">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 bg-border/20 gap-px">
            {daysInMonth.map((day) => {
               // Find jobs scheduled on this day
               const dayJobs = jobs.filter(j => j.scheduledAt && isSameDay(new Date(j.scheduledAt), day));
               
               return (
                 <div 
                   key={day.toString()} 
                   className={`min-h-[140px] bg-background p-2 transition-colors ${
                     !isSameMonth(day, monthStart) ? "opacity-50 bg-muted/10" : ""
                   } ${isToday(day) ? "bg-indigo-50/50 dark:bg-indigo-950/20" : "hover:bg-muted/10"} flex flex-col`}
                 >
                   <div className="flex justify-between items-start mb-2">
                     <span className={`text-sm font-semibold p-1.5 min-w-8 text-center rounded-full ${isToday(day) ? "bg-indigo-600 text-white" : "text-foreground"}`}>
                       {format(day, "d")}
                     </span>
                     {dayJobs.length > 0 && <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{dayJobs.length}</span>}
                   </div>
                   
                   <div className="flex-1 overflow-y-auto space-y-1.5 px-0.5 custom-scrollbar">
                     {dayJobs.map(job => {
                        let payload: { targetPlatform?: string } = {};
                        try { payload = JSON.parse(job.payloadJson); } catch {}
                        const targetStr = payload.targetPlatform || 'auto';
                        const timeStr = format(new Date(job.scheduledAt!), "HH:mm");
                        
                        return (
                          <div key={job.id} onClick={() => {}} className="text-xs p-2 rounded-md border shadow-sm cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 transition-all group relative bg-card text-card-foreground">
                            <div className="flex items-center gap-1.5 font-semibold mb-1">
                               {job.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Clock className="w-3 h-3 text-amber-500" />}
                               {timeStr}
                            </div>
                            <div className="truncate text-muted-foreground leading-tight flex items-center gap-1">
                               <Video className="w-3 h-3 flex-shrink-0" />
                               <span className="truncate">{targetStr}</span>
                            </div>
                          </div>
                        )
                     })}
                   </div>
                 </div>
               )
            })}
          </div>
        </Card>

      </div>
      
      <ScheduleModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onScheduled={loadJobs}
      />
    </div>
  );
}
