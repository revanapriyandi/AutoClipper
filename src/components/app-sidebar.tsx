"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Settings, Film, Scissors, Calendar, BarChart3,
  Zap, Layers, ListTodo, Clapperboard, MessageSquare
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/",              label: "Dashboard",    icon: Home         },
  { href: "/autopilot",    label: "Autopilot",    icon: Zap          },
  { href: "/scheduler",    label: "Calendar",     icon: Calendar     },
  { href: "/reviews",      label: "Approvals",    icon: MessageSquare},
  { href: "/analytics",    label: "Analytics",    icon: BarChart3    },
  { href: "/history",      label: "History",      icon: Film         },
  { href: "/clip-profiles",label: "Clip Profiles",icon: Layers       },
  { href: "/compilation",  label: "Compilation",  icon: Clapperboard },
  { href: "/jobs",         label: "Job Queue",    icon: ListTodo     },
  { href: "/settings",     label: "Settings",     icon: Settings     },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border">
      {/* App logo / branding — compact */}
      <SidebarHeader className="px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded p-1">
            <Scissors className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-foreground">AutoClipper</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 px-1.5">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-7 rounded-sm text-xs font-normal"
                    >
                      <Link href={item.href} className="flex items-center gap-2 px-2">
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — version badge */}
      <SidebarFooter className="px-3 py-2 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground/60">AutoClipper</span>
          <span className="bg-muted/60 border border-border px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-mono">v1.0.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
