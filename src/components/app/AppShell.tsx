import { Sidebar } from "./Sidebar";
import { AIAssistant } from "./AIAssistant";
import { useApp } from "@/store/useAppStore";
import {
  TeacherOverview, ClassroomTwin, RiskTable, BridgeLesson, SilentStudents, UploadZone,
  StudentOverview, MistakeDNAReport, FutureFailureTimeline, PeerCircle, VoiceReasoning,
  ParentOverview, AdminOverview
} from "./Views";
import { ActionFeed, DailyPlan, LivePulse } from "./NewViews";
import { Search, Bell, Command, Brain, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LABELS: Record<string, string> = {
  overview: "Overview",
  inbox: "Smart Inbox",
  pulse: "Live Classroom Pulse",
  plan: "Today's Plan",
  twin: "Classroom Digital Twin",
  risk: "Student Risk Table",
  bridge: "Bridge Lesson AI",
  silent: "Silent Student Detector",
  upload: "Scan & Ingest",
  mistakes: "Mistake DNA Report",
  future: "Future Failure Timeline",
  peers: "AI Peer Circle",
  voice: "Voice Reasoning",
  heatmap: "Risk Heatmaps",
  forecast: "Failure Forecast",
  teachers: "Teacher Impact",
  gaps: "Concept Gaps",
  messages: "Teacher Messages",
};

export function AppShell() {
  const { role, activeView } = useApp();
  const [mobile, setMobile] = useState(false);

  const view = (() => {
    const key = `${role}:${activeView}`;
    switch (key) {
      case "teacher:overview": return <TeacherOverview />;
      case "teacher:inbox": return <ActionFeed />;
      case "teacher:pulse": return <LivePulse />;
      case "teacher:twin": return <ClassroomTwin />;
      case "teacher:risk": return <RiskTable />;
      case "teacher:bridge": return <BridgeLesson />;
      case "teacher:silent": return <SilentStudents />;
      case "teacher:upload": return <UploadZone />;

      case "student:overview": return <StudentOverview />;
      case "student:plan": return <DailyPlan />;
      case "student:mistakes": return <MistakeDNAReport />;
      case "student:future": return <FutureFailureTimeline />;
      case "student:peers": return <PeerCircle />;
      case "student:voice": return <VoiceReasoning />;

      case "parent:overview": return <ParentOverview />;
      case "parent:inbox": return <ActionFeed />;
      case "parent:gaps": return <MistakeDNAReport />;
      case "parent:future": return <FutureFailureTimeline />;
      case "parent:messages": return <ParentOverview />;

      case "admin:overview": return <AdminOverview />;
      case "admin:pulse": return <LivePulse />;
      case "admin:heatmap": return <AdminOverview />;
      case "admin:forecast": return <AdminOverview />;
      case "admin:teachers": return <AdminOverview />;

      default: return <TeacherOverview />;
    }
  })();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/70 backdrop-blur-xl flex items-center gap-3 px-4 lg:px-8">
          <button className="lg:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-muted" onClick={() => setMobile((v) => !v)}>
            <Menu className="h-4 w-4" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center"><Brain className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-display font-bold text-base tracking-tight">Orbit</span>
          </div>
          <div className="hidden lg:block text-xs text-muted-foreground">
            <span className="capitalize">{role}</span> <span className="mx-1.5 opacity-40">/</span> <span className="text-foreground font-medium">{NAV_LABELS[activeView] ?? "Overview"}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground w-72">
              <Search className="h-3.5 w-3.5" />
              <span>Search students, concepts, predictions…</span>
              <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] opacity-70"><Command className="h-3 w-3" />K</span>
            </div>
            <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-risk" />
            </button>
            <div className="h-9 w-9 rounded-lg gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">DT</div>
          </div>
        </header>

        {/* Mobile menu */}
        {mobile && (
          <div className="lg:hidden border-b border-border/60 bg-card p-3">
            <MobileNav close={() => setMobile(false)} />
          </div>
        )}

        <div className="flex-1 px-4 lg:px-8 py-6 max-w-[1500px] w-full mx-auto">
          {view}
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}

function MobileNav({ close }: { close: () => void }) {
  const { role, setRole, activeView, setActiveView } = useApp();
  const items: Record<string, string[]> = {
    teacher: ["overview","inbox","pulse","twin","risk","bridge","silent","upload"],
    student: ["overview","plan","mistakes","future","peers","voice"],
    parent: ["overview","inbox","gaps","future","messages"],
    admin: ["overview","pulse","heatmap","forecast","teachers"],
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-1.5">
        {(["teacher","student","parent","admin"] as const).map(r => (
          <button key={r} onClick={() => setRole(r)} className={cn("text-xs py-2 rounded-lg border", role === r ? "border-primary/40 bg-primary/10 text-primary" : "border-border/60 text-muted-foreground")}>{r}</button>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {items[role].map(v => (
          <button key={v} onClick={() => { setActiveView(v); close(); }} className={cn("text-xs px-3 py-1.5 rounded-lg border", activeView === v ? "border-primary/40 bg-primary/10 text-primary" : "border-border/60")}>
            {NAV_LABELS[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
