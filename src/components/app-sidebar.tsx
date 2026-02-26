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
  Zap, Layers, ListTodo, Clapperboard
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/",              label: "Dashboard",    icon: Home        },
  { href: "/autopilot",    label: "Autopilot",    icon: Zap         },
  { href: "/calendar",     label: "Calendar",     icon: Calendar    },
  { href: "/analytics",    label: "Analytics",    icon: BarChart3   },
  { href: "/history",      label: "History",      icon: Film        },
  { href: "/clip-profiles",label: "Clip Profiles",icon: Layers      },
  { href: "/compilation",  label: "Compilation",  icon: Clapperboard },
  { href: "/jobs",         label: "Job Queue",    icon: ListTodo    },
  { href: "/settings",     label: "Settings",     icon: Settings    },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg p-1.5">
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base">AutoClipper</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
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

      <SidebarFooter className="p-4 text-xs text-muted-foreground border-t">
        <div className="flex items-center justify-between">
          <span>AutoClipper</span>
          <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">v1.0.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
