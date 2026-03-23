import { cn } from "@/lib/utils";
import { NavLink as RouterNavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileUp,
  ClipboardList,
  BarChart3,
  RotateCcw,
  Settings,
  Zap,
  LogOut } from
"lucide-react";

const navItems = [
{ to: "/", icon: LayoutDashboard, label: "Dashboard" },
{ to: "/create-exam", icon: FileUp, label: "Create Exam" },
{ to: "/exams", icon: ClipboardList, label: "My Exams" },
{ to: "/results", icon: BarChart3, label: "Results" },
{ to: "/remarking", icon: RotateCcw, label: "Remarking" },
{ to: "/settings", icon: Settings, label: "Settings" }];


export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-accent-foreground">THRIVE AFRICA'S  
TUTOR</h1>
          <p className="text-xs text-sidebar-foreground/60">Exam Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => <RouterNavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
              isActive ?
              "bg-sidebar-accent text-sidebar-accent-foreground" :
              "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )
            }>
          
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </RouterNavLink>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">Ama Koranteng</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Mathematics Teacher</p>
          </div>
          <button className="rounded-md p-1.5 text-sidebar-foreground/50 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>);

}