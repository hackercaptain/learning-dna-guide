import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Brain, Activity, Network, Upload, Sparkles,
  GraduationCap, User, Heart, Shield, Sun, Moon, Mic, ChevronRight,
  Microscope, Waypoints, FlaskConical, MessagesSquare, Inbox, Flame, Radio
} from "lucide-react";
import { useApp } from "@/store/useAppStore";
import type { Role } from "@/data/mockData";
import { cn } from "@/lib/utils";

const ROLES: { id: Role; label: string; icon: any; color: string }[] = [
  { id: "teacher", label: "Teacher", icon: GraduationCap, color: "text-primary" },
  { id: "student", label: "Student", icon: User, color: "text-info" },
  { id: "parent", label: "Parent", icon: Heart, color: "text-warning" },
  { id: "admin", label: "School Admin", icon: Shield, color: "text-success" },
];

const NAV: Record<Role, { id: string; label: string; icon: any }[]> = {
  teacher: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "inbox", label: "Smart Inbox", icon: Inbox },
    { id: "pulse", label: "Live Classroom Pulse", icon: Radio },
    { id: "twin", label: "Classroom Digital Twin", icon: Network },
    { id: "risk", label: "Student Risk Table", icon: Activity },
    { id: "bridge", label: "Bridge Lesson AI", icon: Sparkles },
    { id: "silent", label: "Silent Student Detector", icon: Microscope },
    { id: "upload", label: "Scan & Ingest", icon: Upload },
  ],
  student: [
    { id: "overview", label: "My Learning DNA", icon: Brain },
    { id: "plan", label: "Today's Plan", icon: Flame },
    { id: "mistakes", label: "Mistake DNA Report", icon: FlaskConical },
    { id: "future", label: "Future Failure Timeline", icon: Waypoints },
    { id: "peers", label: "AI Peer Circle", icon: Users },
    { id: "voice", label: "Voice Reasoning", icon: Mic },
  ],
  parent: [
    { id: "overview", label: "Child Overview", icon: Heart },
    { id: "inbox", label: "Teacher Inbox", icon: Inbox },
    { id: "gaps", label: "Concept Gaps", icon: Brain },
    { id: "future", label: "Predicted Risks", icon: Waypoints },
    { id: "messages", label: "Teacher Messages", icon: MessagesSquare },
  ],
  admin: [
    { id: "overview", label: "School Intelligence", icon: LayoutDashboard },
    { id: "pulse", label: "Live Pulse", icon: Radio },
    { id: "heatmap", label: "Risk Heatmaps", icon: Activity },
    { id: "forecast", label: "Failure Forecast", icon: Waypoints },
    { id: "teachers", label: "Teacher Impact", icon: GraduationCap },
  ],
};

export function Sidebar() {
  const { role, setRole, activeView, setActiveView, theme, toggleTheme } = useApp();
  const items = NAV[role];

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Brain className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -inset-1 rounded-2xl border border-primary/30 animate-pulse-ring" />
          </div>
          <div>
            <div className="font-semibold leading-tight">MistakeDNA <span className="text-gradient">AI</span></div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Early Intervention OS</div>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="px-3 py-3 border-b border-border/60">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-2">Role</div>
        <div className="grid grid-cols-2 gap-1.5">
          {ROLES.map((r) => {
            const active = role === r.id;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "relative flex flex-col items-start gap-1 rounded-lg p-2.5 text-left transition-all border",
                  active
                    ? "border-primary/40 bg-primary/10 shadow-soft"
                    : "border-transparent hover:bg-muted/60"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-xs font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                  {r.label}
                </span>
                {active && (
                  <motion.span layoutId="role-dot" className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-1">Workspace</div>
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "group w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-primary")} />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
            </button>
          );
        })}
      </nav>

      {/* Theme */}
      <div className="border-t border-border/60 p-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">v1.0 · Hackathon</div>
        <button
          onClick={toggleTheme}
          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted/60 transition-colors"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
