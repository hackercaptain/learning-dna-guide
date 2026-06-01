import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, AlertCircle, CheckCircle2, Send, Loader2, RotateCcw, Sparkles,
  BarChart3, Users, Clock, Target, GraduationCap, BookOpen, ArrowRight, Flame, TrendingUp,
  Filter, Calendar as CalendarIcon,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Mode = "student" | "teacher";
type FeedbackState = "idle" | "loading" | "gap" | "correct";
type Subject = "all" | "biology" | "chemistry" | "physics" | "math";
type DateRange = "today" | "week" | "month";

const SAMPLE_QUESTION = {
  subject: "Biology · Grade 8",
  prompt: "Explain the process of photosynthesis in one sentence.",
  hint: "Plants use sunlight to convert carbon dioxide and water into glucose and oxygen inside chloroplasts.",
  gapConcept: "Chloroplast Function",
  supportive:
    "You're close! Your answer mentions sunlight, but it's missing the role of chloroplasts — the tiny structures inside plant cells where photosynthesis actually happens.",
};

type Gap = {
  concept: string;
  struggling: number;
  total: number;
  severity: "high" | "med" | "low";
  note: string;
  subject: Exclude<Subject, "all">;
  // share of this gap attributable to each window (today / week / month)
  window: { today: number; week: number; month: number };
};

const ALL_GAPS: Gap[] = [
  // Biology — Photosynthesis unit
  { concept: "Chloroplast Function",        struggling: 22, total: 28, severity: "high", note: "Most-missed concept this week — recommend a 10-min recap.", subject: "biology",   window: { today: 0.35, week: 1, month: 1 } },
  { concept: "Light-dependent Reactions",   struggling: 18, total: 28, severity: "high", note: "Students confuse inputs and outputs.",                          subject: "biology",   window: { today: 0.30, week: 1, month: 1 } },
  { concept: "Calvin Cycle Steps",          struggling: 14, total: 28, severity: "med",  note: "Order of steps unclear in 50% of responses.",                   subject: "biology",   window: { today: 0.25, week: 0.85, month: 1 } },
  { concept: "Role of Chlorophyll",         struggling: 10, total: 28, severity: "med",  note: "Often confused with chloroplast.",                              subject: "biology",   window: { today: 0.20, week: 0.7, month: 1 } },
  { concept: "Glucose vs Oxygen Output",    struggling: 6,  total: 28, severity: "low",  note: "Mostly understood — keep reinforcing.",                         subject: "biology",   window: { today: 0.15, week: 0.6, month: 1 } },
  { concept: "Stomata & Gas Exchange",      struggling: 4,  total: 28, severity: "low",  note: "Strong area.",                                                  subject: "biology",   window: { today: 0.1,  week: 0.5, month: 1 } },
  // Chemistry — Bonding & Reactions
  { concept: "Ionic vs Covalent Bonding",   struggling: 19, total: 26, severity: "high", note: "Students mix up electron transfer vs sharing.",                 subject: "chemistry", window: { today: 0.4,  week: 1, month: 1 } },
  { concept: "Balancing Equations",         struggling: 15, total: 26, severity: "high", note: "Coefficient placement is the recurring error.",                 subject: "chemistry", window: { today: 0.3,  week: 0.9, month: 1 } },
  { concept: "Mole Concept",                struggling: 11, total: 26, severity: "med",  note: "Unit conversion gaps persist.",                                 subject: "chemistry", window: { today: 0.2,  week: 0.75, month: 1 } },
  { concept: "Acids, Bases & pH",           struggling: 5,  total: 26, severity: "low",  note: "Strong — only edge cases missed.",                              subject: "chemistry", window: { today: 0.15, week: 0.6, month: 1 } },
  // Physics — Motion & Forces
  { concept: "Newton's Third Law",          struggling: 17, total: 24, severity: "high", note: "Action–reaction pairs misidentified.",                          subject: "physics",   window: { today: 0.35, week: 1, month: 1 } },
  { concept: "Free-body Diagrams",          struggling: 13, total: 24, severity: "med",  note: "Friction direction confuses many.",                             subject: "physics",   window: { today: 0.25, week: 0.85, month: 1 } },
  { concept: "Projectile Motion",           struggling: 9,  total: 24, severity: "med",  note: "Independence of axes not internalized.",                        subject: "physics",   window: { today: 0.2,  week: 0.7, month: 1 } },
  { concept: "Units & Dimensions",          struggling: 4,  total: 24, severity: "low",  note: "Solid baseline.",                                               subject: "physics",   window: { today: 0.1,  week: 0.5, month: 1 } },
  // Math — Algebra
  { concept: "Quadratic Factoring",         struggling: 20, total: 30, severity: "high", note: "Sign errors dominate.",                                         subject: "math",      window: { today: 0.4,  week: 1, month: 1 } },
  { concept: "Word Problems → Equations",   struggling: 16, total: 30, severity: "high", note: "Translation step is the bottleneck.",                           subject: "math",      window: { today: 0.3,  week: 0.9, month: 1 } },
  { concept: "Exponent Rules",              struggling: 12, total: 30, severity: "med",  note: "Negative exponents confuse half the class.",                    subject: "math",      window: { today: 0.25, week: 0.8, month: 1 } },
  { concept: "Linear Inequalities",         struggling: 6,  total: 30, severity: "low",  note: "Mostly mastered.",                                              subject: "math",      window: { today: 0.15, week: 0.6, month: 1 } },
];

const SUBJECT_LABEL: Record<Subject, string> = {
  all: "All subjects", biology: "Biology", chemistry: "Chemistry", physics: "Physics", math: "Math",
};
const RANGE_LABEL: Record<DateRange, string> = {
  today: "Today", week: "This week", month: "This month",
};


export function KairosApp() {
  const [mode, setMode] = useState<Mode>("student");

  return (
    <div className="min-h-screen w-full">
      <Header mode={mode} setMode={setMode} />
      <main className="px-4 sm:px-6 lg:px-10 pb-20 pt-6 lg:pt-10 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {mode === "student" ? (
            <motion.div key="student" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
              <StudentView />
            </motion.div>
          ) : (
            <motion.div key="teacher" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
              <TeacherDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ───────────────── Header ───────────────── */
function Header({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Brain className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -inset-1 rounded-2xl border border-primary/30 animate-pulse-ring" />
          </div>
          <div className="leading-none">
            <div className="font-display font-bold text-xl tracking-tight">Kairos<span className="text-gradient">.</span></div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Right moment learning</div>
          </div>
        </div>

        <ModeToggle mode={mode} setMode={setMode} />
      </div>
    </header>
  );
}

function ModeToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="relative inline-flex items-center rounded-full glass p-1 text-xs font-medium">
      {(["student", "teacher"] as const).map((m) => {
        const active = mode === m;
        const Icon = m === "student" ? BookOpen : GraduationCap;
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "relative z-10 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full transition-colors capitalize",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full gradient-primary shadow-glow"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="relative h-3.5 w-3.5" />
            <span className="relative">{m}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────── Student View ───────────────── */
function StudentView() {
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<FeedbackState>("idle");

  const submit = () => {
    if (!answer.trim()) {
      toast("Type your answer first");
      return;
    }
    setState("loading");
    setTimeout(() => {
      // Heuristic: mention "chloroplast" → correct, else gap
      const ok = /chloroplast/i.test(answer);
      setState(ok ? "correct" : "gap");
    }, 2000);
  };

  const reset = () => {
    setAnswer("");
    setState("idle");
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary font-medium">
          <Sparkles className="h-3 w-3" />
          AI-powered assessment
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
          Answer in your own words. <span className="text-gradient">We'll find the gap.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Kairos analyzes your reasoning — not just your final answer — to catch misunderstandings the moment they form.
        </p>
      </div>

      <motion.div
        layout
        transition={{ layout: { duration: 0.45, type: "spring", stiffness: 120, damping: 20 } }}
        className="relative mx-auto max-w-3xl"
      >
        <div className="absolute -inset-1 rounded-[2.5rem] gradient-primary opacity-40 blur-3xl pointer-events-none" />
        <div className="relative rounded-[2.5rem] glass-strong overflow-hidden shadow-[0_30px_80px_-20px_oklch(0.62_0.24_277/0.45),0_10px_30px_-10px_oklch(0_0_0/0.5)]">
          {/* Question */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              {SAMPLE_QUESTION.subject}
              <span className="ml-auto inline-flex items-center gap-1 text-primary">
                <Target className="h-3 w-3" /> Question 1 of 5
              </span>
            </div>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl leading-snug">
              {SAMPLE_QUESTION.prompt}
            </h2>

            <div className="mt-6">
              <label className="text-xs text-muted-foreground">Your answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={state === "loading"}
                rows={4}
                placeholder="Type your reasoning here…"
                className="mt-2 w-full rounded-3xl border border-border/60 bg-card/60 px-5 py-4 text-[15px] leading-relaxed outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/15 transition-all resize-none placeholder:text-muted-foreground/60"
              />
              <div className="mt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Auto-saved · Private to you
                </div>
                <button
                  onClick={submit}
                  disabled={state === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary text-primary-foreground font-medium px-6 py-3 text-sm shadow-glow hover:opacity-95 disabled:opacity-60 transition-opacity"
                >
                  {state === "loading" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
                  ) : (
                    <>Submit response <Send className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Loading shimmer */}
          <AnimatePresence>
            {state === "loading" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border/60 px-6 sm:px-8 py-6 bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 grid place-items-center">
                    <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    <Brain className="relative h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Kairos is reasoning through your answer…</div>
                    <div className="text-xs text-muted-foreground">Comparing concept structure · checking for misconceptions</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {[90, 70, 55].map((w, i) => (
                    <div key={i} className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full shimmer rounded-full" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback */}
          <AnimatePresence mode="wait">
            {state === "gap" && (
              <motion.div
                key="gap"
                initial={{ opacity: 0, y: -32, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -16, height: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.4, delay: 0.1 } }}
                className="border-t-2 border-warning/50 bg-warning/5 overflow-hidden"
              >
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 text-warning px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Learning gap identified
                    </span>
                    <span className="text-[11px] text-muted-foreground">Concept · <b className="text-foreground">{SAMPLE_QUESTION.gapConcept}</b></span>
                  </div>

                  <p className="text-[15px] leading-relaxed">{SAMPLE_QUESTION.supportive}</p>

                  <div className="rounded-3xl border border-warning/30 bg-card/50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-warning">
                      <Sparkles className="h-3.5 w-3.5" />
                      Supportive hint
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Think about <b className="text-foreground">where</b> photosynthesis happens inside the cell, and <b className="text-foreground">what raw materials</b> the plant uses. Try mentioning chloroplasts, carbon dioxide, water, sunlight, glucose, and oxygen.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary text-primary-foreground font-medium px-6 py-3 text-sm shadow-glow hover:opacity-95"
                    >
                      <RotateCcw className="h-4 w-4" /> Try again
                    </button>
                    <button
                      onClick={() => toast.success("Sent to your teacher", { description: "Mrs. Sharma will see this in tomorrow's recap." })}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 px-6 py-3 text-sm font-medium hover:bg-muted/50"
                    >
                      Ask for help <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {state === "correct" && (
              <motion.div
                key="correct"
                initial={{ opacity: 0, y: -32, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -16, height: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.4, delay: 0.1 } }}
                className="border-t-2 border-success/50 bg-success/5 overflow-hidden"
              >
                <div className="p-6 sm:p-8 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Concept understood
                  </span>
                  <p className="text-[15px] leading-relaxed">
                    Excellent — you captured the role of chloroplasts and the core chemistry. Ready for a tougher one?
                  </p>
                  <div className="flex gap-2">
                    <button onClick={reset} className="inline-flex items-center gap-2 rounded-full gradient-primary text-primary-foreground font-medium px-6 py-3 text-sm shadow-glow hover:opacity-95">
                      Next question <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Helper chips */}
      <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center pt-2">
        {["What happens inside a chloroplast?", "Inputs vs outputs of photosynthesis", "Role of chlorophyll"].map((t) => (
          <button key={t} onClick={() => setAnswer((a) => a ? a : "")} className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
            💡 {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────── Teacher Dashboard ───────────────── */
const RANGE_METRICS: Record<DateRange, { submissions: number; submissionsDelta: string; avgTime: string; avgDelta: string }> = {
  today: { submissions: 42,  submissionsDelta: "+42 today",      avgTime: "1m 28s", avgDelta: "−14s vs yesterday" },
  week:  { submissions: 184, submissionsDelta: "+24 today",      avgTime: "1m 42s", avgDelta: "−12s vs last week" },
  month: { submissions: 612, submissionsDelta: "+184 this week", avgTime: "1m 51s", avgDelta: "−6s vs last month" },
};

function TeacherDashboard() {
  const [subject, setSubject] = useState<Subject>("all");
  const [range, setRange] = useState<DateRange>("week");

  const filtered = useMemo<Gap[]>(() => {
    return ALL_GAPS
      .filter((g) => subject === "all" || g.subject === subject)
      .map((g) => {
        const factor = g.window[range];
        const struggling = Math.max(0, Math.round(g.struggling * factor));
        const ratio = struggling / g.total;
        const severity: Gap["severity"] =
          ratio >= 0.55 ? "high" : ratio >= 0.3 ? "med" : "low";
        return { ...g, struggling, severity };
      })
      .filter((g) => g.struggling > 0);
  }, [subject, range]);

  const sorted = [...filtered].sort((a, b) => b.struggling - a.struggling);
  const topGap = sorted[0];

  const rangeBase = RANGE_METRICS[range];
  const subjectScale = subject === "all" ? 1 : 0.32;
  const metrics = {
    submissions: Math.round(rangeBase.submissions * subjectScale),
    submissionsDelta: rangeBase.submissionsDelta,
    avgTime: rangeBase.avgTime,
    avgDelta: rangeBase.avgDelta,
    activeGaps: sorted.filter((g) => g.severity !== "low").length,
  };

  const heatmapCaption =
    `${sorted.reduce((s, g) => s + g.total, 0)} student responses · ${SUBJECT_LABEL[subject]} · ${RANGE_LABEL[range]}`;

  return (
    <div className="space-y-7">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary font-medium">
          <GraduationCap className="h-3 w-3" /> Teacher dashboard
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-tight">
          Tomorrow's class — <span className="text-gradient">already planned.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Live gaps surfaced from your students' actual reasoning. Focus on what matters most.
        </p>
      </div>

      <FilterBar
        subject={subject}
        range={range}
        onSubject={(s) => { setSubject(s); toast(`Filter · ${SUBJECT_LABEL[s]}`); }}
        onRange={(r) => { setRange(r); toast(`Range · ${RANGE_LABEL[r]}`); }}
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Submissions"    value={metrics.submissions} delta={metrics.submissionsDelta} icon={Users} tone="primary" />
        <MetricCard label="Avg. Response Time"   value={metrics.avgTime}     delta={metrics.avgDelta}         icon={Clock} tone="info" />
        <MetricCard label="Active Learning Gaps" value={metrics.activeGaps}  delta={topGap?.concept ?? "All clear"} icon={AlertCircle} tone="warning" />
      </div>

      {/* Top gap callout */}
      <AnimatePresence mode="wait">
        {topGap ? (
          <motion.div
            key={`${subject}-${range}-${topGap.concept}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="relative overflow-hidden rounded-[2rem] border-2 border-warning/40 bg-warning/5 p-5 sm:p-6 shadow-soft"
          >
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-warning/30 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-warning/20 text-warning grid place-items-center shrink-0">
                <Flame className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-warning font-semibold">
                  Biggest gap · {SUBJECT_LABEL[subject]} · {RANGE_LABEL[range]}
                </div>
                <div className="mt-1 font-display text-2xl">{topGap.concept}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <b className="text-foreground">{topGap.struggling} of {topGap.total}</b> students struggling · {topGap.note}
                </div>
              </div>
              <button
                onClick={() => toast.success("Recap added to tomorrow's plan", { description: topGap.concept })}
                className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary text-primary-foreground font-medium px-6 py-3 text-sm shadow-glow hover:opacity-95 whitespace-nowrap"
              >
                Plan recap <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-[2rem] glass-strong p-8 text-center text-sm text-muted-foreground"
          >
            No gaps surfaced for <b className="text-foreground">{SUBJECT_LABEL[subject]}</b> · {RANGE_LABEL[range]}.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gap distribution pie */}
      <GapPieChart data={sorted} subject={subject} range={range} />

      {/* Per-student struggle + gap trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StudentStruggleChart subject={subject} range={range} />
        <GapTrendChart subject={subject} range={range} totalGaps={sorted.length} />
      </div>


      {/* Gap list */}
      <div className="rounded-[2rem] glass-strong overflow-hidden shadow-soft">
        <div className="flex items-center gap-2 p-5 border-b border-border/60">
          <BarChart3 className="h-4 w-4 text-primary" />
          <div>
            <div className="font-medium text-sm">Concept gap heatmap</div>
            <div className="text-xs text-muted-foreground">{heatmapCaption}</div>
          </div>
          <span className="ml-auto text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Updated 2 min ago
          </span>
        </div>

        <div className="divide-y divide-border/60">
          <AnimatePresence initial={false}>
            {sorted.map((g, i) => {
              const pct = Math.round((g.struggling / g.total) * 100);
              const tone =
                g.severity === "high" ? "warning" :
                g.severity === "med"  ? "info"    : "success";
              return (
                <motion.div
                  key={`${subject}-${range}-${g.concept}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "p-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 hover:bg-primary/5 transition-colors",
                    i === 0 && "bg-warning/5"
                  )}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base font-semibold">{g.concept}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{SUBJECT_LABEL[g.subject]}</span>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        tone === "warning" && "bg-warning/15 text-warning",
                        tone === "info" && "bg-info/15 text-info",
                        tone === "success" && "bg-success/15 text-success",
                      )}>
                        {g.severity === "high" ? "Critical" : g.severity === "med" ? "Watch" : "Solid"}
                      </span>
                      {i === 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning text-warning-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          <Flame className="h-3 w-3" /> Focus tomorrow
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{g.note}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.1 + i * 0.04, duration: 0.7, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            tone === "warning" && "bg-warning",
                            tone === "info"    && "bg-info",
                            tone === "success" && "bg-success",
                          )}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-16 text-right">
                        {g.struggling}/{g.total} · {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-2 sm:justify-center">
                    <button
                      onClick={() => toast.success("Mini-lesson assigned", { description: g.concept })}
                      className="text-xs px-4 py-2 rounded-full border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors whitespace-nowrap"
                    >
                      Assign mini-lesson
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ───────── Filter bar ───────── */
function FilterBar({
  subject, range, onSubject, onRange,
}: {
  subject: Subject; range: DateRange;
  onSubject: (s: Subject) => void; onRange: (r: DateRange) => void;
}) {
  const subjects: Subject[] = ["all", "biology", "chemistry", "physics", "math"];
  const ranges: DateRange[] = ["today", "week", "month"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.75rem] glass-strong p-3 sm:p-4 shadow-soft flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5"
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground shrink-0">
        <Filter className="h-3.5 w-3.5 text-primary" /> Filters
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> Subject</span>
        <div className="inline-flex flex-wrap gap-1 rounded-full bg-muted/40 p-1">
          {subjects.map((s) => {
            const active = subject === s;
            return (
              <button
                key={s}
                onClick={() => onSubject(s)}
                className={cn(
                  "relative px-3 py-1.5 text-xs rounded-full transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span layoutId="subject-pill" className="absolute inset-0 rounded-full gradient-primary shadow-glow" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{SUBJECT_LABEL[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap lg:ml-auto">
        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> Range</span>
        <div className="inline-flex gap-1 rounded-full bg-muted/40 p-1">
          {ranges.map((r) => {
            const active = range === r;
            return (
              <button
                key={r}
                onClick={() => onRange(r)}
                className={cn(
                  "relative px-3 py-1.5 text-xs rounded-full transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span layoutId="range-pill" className="absolute inset-0 rounded-full gradient-primary shadow-glow" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{RANGE_LABEL[r]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({
  label, value, delta, icon: Icon, tone,
}: {
  label: string; value: string | number; delta: string;
  icon: any; tone: "primary" | "info" | "warning";
}) {
  const t = {
    primary: "bg-primary/15 text-primary",
    info: "bg-info/15 text-info",
    warning: "bg-warning/15 text-warning",
  }[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="relative rounded-[1.75rem] glass-strong p-5 overflow-hidden shadow-soft"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={cn("h-9 w-9 rounded-full grid place-items-center", t)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 font-display text-3xl tracking-tight">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{delta}</div>
    </motion.div>
  );
}

/* ───────── Gap distribution pie chart ───────── */
const PIE_COLORS = [
  "var(--warning)", "var(--risk)", "var(--info)", "var(--primary)", "var(--success)", "var(--dna-6)",
];

function GapPieChart({ data: gaps, subject, range }: { data: Gap[]; subject: Subject; range: DateRange }) {
  const data = gaps.map((g) => ({ name: g.concept, value: g.struggling, severity: g.severity }));
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <motion.div
      key={`${subject}-${range}-pie`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-[2rem] glass-strong p-5 sm:p-6 shadow-soft grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 items-center"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] uppercase tracking-[0.18em] font-semibold">
          <BarChart3 className="h-3 w-3" /> {SUBJECT_LABEL[subject]} · {RANGE_LABEL[range]}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-snug">Where the class is losing the most students</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Each slice represents the share of struggling responses across concepts in this filter.
          Larger slices = bigger teaching opportunities.
        </p>


        <div className="mt-5 space-y-1.5">
          {data.map((d, i) => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <div key={d.name} className="flex items-center gap-3 text-xs">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="flex-1 truncate text-foreground">{d.name}</span>
                <span className="font-mono text-muted-foreground">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="88%"
              paddingAngle={3}
              stroke="var(--card)"
              strokeWidth={3}
              animationBegin={150}
              animationDuration={900}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "color-mix(in oklab, var(--card) 92%, transparent)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(v: number, n: string) => [`${v} students (${Math.round((v / total) * 100)}%)`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

