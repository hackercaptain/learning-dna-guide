import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Inbox, Bell, Sparkles, Zap, Send, CheckCircle2, Clock, AlertTriangle, Filter,
  Flame, Trophy, Target, BookOpen, PlayCircle, ChevronRight, Activity, Hand, Waves,
  Headphones, MessagesSquare, Lightbulb, ArrowUpRight, CircleDot, Radio
} from "lucide-react";
import { Card, CardHeader, Pill, Stat } from "./Primitives";
import { students, interventions } from "@/data/mockData";
import { cn } from "@/lib/utils";

/* ============================================================
   HERO (shared bold header)
============================================================ */
export function BoldHero({
  eyebrow, title, subtitle, action,
}: { eyebrow: string; title: React.ReactNode; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-6 lg:p-8 noise">
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full gradient-primary opacity-30 blur-3xl animate-aurora pointer-events-none" />
      <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full gradient-dna opacity-20 blur-3xl animate-aurora pointer-events-none" />
      <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {eyebrow}
          </div>
          <h1 className="mt-4 font-display text-3xl lg:text-5xl leading-[1.05] max-w-2xl">{title}</h1>
          <p className="mt-3 text-sm lg:text-base text-muted-foreground max-w-xl">{subtitle}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

/* ============================================================
   ACTION FEED — Smart Notifications + AI Recommendations
   (Teacher/Parent inbox with one-click actions)
============================================================ */
type ActionItem = {
  id: string;
  kind: "risk" | "ai" | "parent" | "win" | "silent";
  title: string;
  body: string;
  student?: string;
  ts: string;
  urgency: "high" | "med" | "low";
  cta: string;
};

const ACTION_SEED: ActionItem[] = [
  { id: "a1", kind: "risk", title: "Algebra readiness collapse predicted", body: "8 students will fail tomorrow's quiz unless a bridge lesson on Fractions is taught first.", ts: "2m ago", urgency: "high", cta: "Run Bridge Lesson" },
  { id: "a2", kind: "ai", title: "Suggested intervention for Rahul", body: "Replace MCQ practice with a 5-min voice-reasoning drill on denominator alignment.", student: "Rahul", ts: "8m ago", urgency: "high", cta: "Apply Plan" },
  { id: "a3", kind: "silent", title: "3 silent students detected", body: "Priya, Karan, Diya haven't asked a question in 14 days. Confusion signals rising.", ts: "21m ago", urgency: "med", cta: "Open Detector" },
  { id: "a4", kind: "parent", title: "Draft message to Sneha's parent", body: "Sneha's confidence dropped 18% this week. AI drafted a supportive Hinglish update.", student: "Sneha", ts: "45m ago", urgency: "med", cta: "Review & Send" },
  { id: "a5", kind: "win", title: "Class breakthrough on Equations", body: "Mastery jumped +12% after yesterday's peer-circle exercise. Lock it into Monday's plan?", ts: "1h ago", urgency: "low", cta: "Lock In" },
  { id: "a6", kind: "ai", title: "Bilingual recap ready", body: "Auto-generated Hindi+English recap for Photosynthesis is queued for Grade 7-B.", ts: "2h ago", urgency: "low", cta: "Publish" },
];

const KIND_META: Record<ActionItem["kind"], { icon: any; tone: any; label: string }> = {
  risk:   { icon: AlertTriangle, tone: "risk",    label: "Risk Alert" },
  ai:     { icon: Sparkles,      tone: "primary", label: "AI Plan" },
  parent: { icon: MessagesSquare,tone: "warning", label: "Parent Loop" },
  win:    { icon: Trophy,        tone: "success", label: "Class Win" },
  silent: { icon: Waves,         tone: "info",    label: "Silent Signal" },
};

export function ActionFeed() {
  const [items, setItems] = useState(ACTION_SEED);
  const [filter, setFilter] = useState<"all" | ActionItem["kind"]>("all");
  const [done, setDone] = useState<string[]>([]);

  const visible = items.filter((i) => (filter === "all" ? true : i.kind === filter));
  const counts = useMemo(() => ({
    high: items.filter((i) => i.urgency === "high").length,
    today: items.length,
    resolved: done.length,
  }), [items, done]);

  return (
    <div className="space-y-6">
      <BoldHero
        eyebrow="Smart Inbox"
        title={<>One feed. Every decision. <span className="text-gradient">Zero noise.</span></>}
        subtitle="AI prioritizes the actions that move student outcomes the most — drafts the message, queues the lesson, books the intervention."
        action={
          <div className="flex gap-3">
            <Stat label="Critical now" value={counts.high} tone="risk" icon={<AlertTriangle className="h-4 w-4" />} />
            <Stat label="Resolved today" value={counts.resolved} tone="success" icon={<CheckCircle2 className="h-4 w-4" />} />
          </div>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border/60">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["all","risk","ai","silent","parent","win"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-all capitalize",
                filter === f
                  ? "border-primary/50 bg-primary/15 text-foreground ring-glow"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : KIND_META[f].label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-primary animate-pulse" /> Live feed
          </span>
        </div>

        <div className="divide-y divide-border/60">
          <AnimatePresence initial={false}>
            {visible.map((i) => {
              const meta = KIND_META[i.kind];
              const Icon = meta.icon;
              const isDone = done.includes(i.id);
              return (
                <motion.div
                  key={i.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isDone ? 0.4 : 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="group flex gap-4 p-4 lg:p-5 hover:bg-primary/5 transition-colors"
                >
                  <div className={cn(
                    "h-11 w-11 rounded-xl grid place-items-center shrink-0",
                    meta.tone === "risk" && "bg-risk/15 text-risk",
                    meta.tone === "primary" && "bg-primary/15 text-primary",
                    meta.tone === "warning" && "bg-warning/15 text-warning",
                    meta.tone === "success" && "bg-success/15 text-success",
                    meta.tone === "info" && "bg-info/15 text-info",
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={meta.tone}>{meta.label}</Pill>
                      <Pill tone={i.urgency === "high" ? "risk" : i.urgency === "med" ? "warning" : "default"}>{i.urgency}</Pill>
                      {i.student && <span className="text-[11px] text-muted-foreground">· {i.student}</span>}
                      <span className="ml-auto text-[11px] text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />{i.ts}</span>
                    </div>
                    <div className="mt-1.5 font-medium text-sm lg:text-[15px]">{i.title}</div>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 leading-relaxed">{i.body}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!isDone ? (
                      <>
                        <button
                          onClick={() => { setDone((d) => [...d, i.id]); toast.success(i.cta, { description: i.title }); }}
                          className="text-xs px-3 py-2 rounded-lg gradient-primary text-primary-foreground font-medium inline-flex items-center gap-1.5 shadow-glow hover:opacity-90"
                        >
                          {i.cta} <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => { setItems((arr) => arr.filter((x) => x.id !== i.id)); toast("Snoozed for 1 hour"); }}
                          className="text-xs px-2.5 py-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground"
                        >
                          Snooze
                        </button>
                      </>
                    ) : (
                      <span className="text-xs inline-flex items-center gap-1.5 text-success"><CheckCircle2 className="h-4 w-4" /> Actioned</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   DAILY PLAN — Student streaks + personalized practice
============================================================ */
export function DailyPlan() {
  const me = students[0];
  const [completed, setCompleted] = useState<string[]>([]);
  const tasks = useMemo(() => ([
    { id: "t1", title: `Warm-up: 5 quick ${me.weakConcepts[0]} reps`, mins: 5, xp: 20, icon: Flame, kind: "Warm-up" },
    { id: "t2", title: `Concept video — ${me.weakConcepts[0]} root cause`, mins: 7, xp: 35, icon: PlayCircle, kind: "Watch" },
    { id: "t3", title: `Voice reasoning: explain ${me.weakConcepts[1]} in your own words`, mins: 4, xp: 40, icon: Headphones, kind: "Voice" },
    { id: "t4", title: `Mistake-DNA drill: 6 targeted questions`, mins: 10, xp: 60, icon: Target, kind: "Drill" },
    { id: "t5", title: `Peer circle: help a friend with ${me.topConcepts[0]}`, mins: 8, xp: 50, icon: MessagesSquare, kind: "Teach" },
  ]), [me]);

  const totalXp = tasks.reduce((s, t) => s + t.xp, 0);
  const earnedXp = tasks.filter((t) => completed.includes(t.id)).reduce((s, t) => s + t.xp, 0);
  const pct = Math.round((earnedXp / totalXp) * 100);
  const streak = 12;

  return (
    <div className="space-y-6">
      <BoldHero
        eyebrow={`Hey ${me.name} 👋`}
        title={<>Your <span className="text-gradient">12-minute</span> path to mastery today.</>}
        subtitle="A bite-sized plan tuned to your Mistake-DNA. Finish it to keep your streak alive and unlock tomorrow's bonus."
        action={
          <div className="flex items-center gap-4 rounded-2xl glass px-5 py-4">
            <div className="relative">
              <Flame className="h-10 w-10 text-warning" />
              <span className="absolute -inset-1 rounded-full bg-warning/30 blur-lg animate-pulse" />
            </div>
            <div>
              <div className="text-3xl font-display font-bold leading-none">{streak}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">day streak</div>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Today's XP" value={`${earnedXp} / ${totalXp}`} tone="primary" icon={<Trophy className="h-4 w-4" />} />
        <Stat label="Streak" value={`${streak} 🔥`} tone="warning" icon={<Flame className="h-4 w-4" />} />
        <Stat label="Mastery" value={`${me.mastery}%`} delta="+4%" tone="success" icon={<Target className="h-4 w-4" />} />
        <Stat label="Next Unlock" value="Bonus quest" tone="info" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader title="Today's plan" subtitle="Auto-generated · adapts as you learn" icon={<BookOpen className="h-4 w-4" />} right={<Pill tone="primary">{pct}% done</Pill>} />
        <div className="px-5 pb-5">
          <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />
          </div>
          <div className="space-y-2.5">
            {tasks.map((t, idx) => {
              const Icon = t.icon;
              const done = completed.includes(t.id);
              return (
                <motion.button
                  key={t.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setCompleted((c) => done ? c.filter((x) => x !== t.id) : [...c, t.id])}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                    done
                      ? "border-success/40 bg-success/5"
                      : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <div className="text-[11px] font-mono text-muted-foreground w-6">{String(idx + 1).padStart(2,"0")}</div>
                  <div className={cn(
                    "h-11 w-11 rounded-xl grid place-items-center",
                    done ? "bg-success/20 text-success" : "bg-primary/15 text-primary"
                  )}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Pill tone={done ? "success" : "default"}>{t.kind}</Pill>
                      <span className="text-[11px] text-muted-foreground">{t.mins} min · +{t.xp} XP</span>
                    </div>
                    <div className={cn("mt-1 text-sm font-medium", done && "line-through opacity-70")}>{t.title}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { t: "Concept Mastered", v: "Fractions · Like denominators", icon: CheckCircle2, tone: "success" as const },
          { t: "Boss Battle", v: "Quadratic Equations · Friday", icon: Trophy, tone: "warning" as const },
          { t: "AI Tip", v: "Slow down on transposition — sign errors caught 3x.", icon: Lightbulb, tone: "primary" as const },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-xl grid place-items-center",
                  c.tone === "success" && "bg-success/15 text-success",
                  c.tone === "warning" && "bg-warning/15 text-warning",
                  c.tone === "primary" && "bg-primary/15 text-primary",
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.t}</div>
              </div>
              <div className="mt-3 font-display text-lg leading-snug">{c.v}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   LIVE PULSE — Real-time classroom engagement
============================================================ */
export function LivePulse() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  // derive live signals (pseudo-random but stable across renders within tick)
  const cohort = students.slice(0, 30);
  const seedFor = (i: number) => {
    const x = Math.sin((i + 1) * 9.13 + tick * 0.7) * 10000;
    return x - Math.floor(x);
  };
  const cells = cohort.map((s, i) => {
    const conf = seedFor(i);
    const state = conf < 0.12 ? "confused" : conf < 0.22 ? "raised" : conf < 0.55 ? "engaged" : "calm";
    return { s, state, conf };
  });
  const confused = cells.filter((c) => c.state === "confused").length;
  const raised = cells.filter((c) => c.state === "raised").length;
  const engagement = Math.round(cells.filter((c) => c.state !== "confused").length / cells.length * 100);

  return (
    <div className="space-y-6">
      <BoldHero
        eyebrow="Live Classroom Pulse"
        title={<>The room, <span className="text-gradient">in real time</span>.</>}
        subtitle="See confusion ripple, hands rise, and energy shift as you teach. Take the next move before a student gets lost."
        action={
          <div className="rounded-2xl glass px-5 py-3 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            <div className="text-xs">
              <div className="font-medium">Grade 8-A · Algebra</div>
              <div className="text-muted-foreground">Streaming · 12:42 elapsed</div>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Engagement" value={`${engagement}%`} tone={engagement > 75 ? "success" : engagement > 55 ? "warning" : "risk"} icon={<Activity className="h-4 w-4" />} />
        <Stat label="Confused now" value={confused} tone="risk" icon={<AlertTriangle className="h-4 w-4" />} />
        <Stat label="Hands raised" value={raised} tone="warning" icon={<Hand className="h-4 w-4" />} />
        <Stat label="Silent for 4m+" value={4} tone="info" icon={<Waves className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Classroom heatmap" subtitle="Each tile is a student · updates every 2s" icon={<CircleDot className="h-4 w-4" />} />
          <div className="p-5 pt-0">
            <div className="rounded-2xl bg-muted/30 border border-border/40 p-4 grid grid-cols-6 lg:grid-cols-10 gap-1.5">
              {cells.map((c, i) => {
                const color =
                  c.state === "confused" ? "bg-risk shadow-[0_0_18px_var(--risk)]" :
                  c.state === "raised"   ? "bg-warning" :
                  c.state === "engaged"  ? "bg-primary/80" :
                                           "bg-success/60";
                return (
                  <motion.div
                    key={c.s.id}
                    layout
                    initial={false}
                    animate={{ scale: c.state === "confused" ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 1.4, repeat: c.state === "confused" ? Infinity : 0 }}
                    title={`${c.s.name} · ${c.state}`}
                    className={cn("aspect-square rounded-md cursor-pointer", color)}
                  />
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <Legend dot="bg-success/60" label="Calm / Following" />
              <Legend dot="bg-primary/80" label="Engaged" />
              <Legend dot="bg-warning" label="Hand raised" />
              <Legend dot="bg-risk" label="Confusion spike" />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="AI moves to make now" subtitle="Ranked by impact" icon={<Sparkles className="h-4 w-4" />} right={<Pill tone="primary">Live</Pill>} />
          <div className="p-5 pt-0 space-y-2.5">
            {[
              { t: "Pause and re-explain", d: `${confused} students confused on transposition. 90 sec recap recommended.`, tone: "risk" as const, cta: "Trigger recap" },
              { t: "Call on a hand", d: `${raised} hands raised — Priya hasn't spoken in 3 lessons.`, tone: "warning" as const, cta: "Suggest pick" },
              { t: "Drop a checkpoint poll", d: "Pulse confidence with a 1-question check before moving on.", tone: "primary" as const, cta: "Send poll" },
              { t: "Nudge silent group", d: "Karan, Diya, Veer disengaged. Trigger discreet ping.", tone: "info" as const, cta: "Ping students" },
            ].map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 3 }}
                className="rounded-xl border border-border/60 p-3 flex items-start gap-3 hover:border-primary/40 transition-colors"
              >
                <div className={cn(
                  "h-9 w-9 rounded-lg grid place-items-center shrink-0",
                  m.tone === "risk" && "bg-risk/15 text-risk",
                  m.tone === "warning" && "bg-warning/15 text-warning",
                  m.tone === "primary" && "bg-primary/15 text-primary",
                  m.tone === "info" && "bg-info/15 text-info",
                )}>
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{m.t}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{m.d}</div>
                </div>
                <button className="text-[11px] px-2.5 py-1.5 rounded-lg gradient-primary text-primary-foreground font-medium whitespace-nowrap">{m.cta}</button>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-sm", dot)} />
      {label}
    </span>
  );
}
