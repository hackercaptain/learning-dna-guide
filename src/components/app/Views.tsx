import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend, Treemap
} from "recharts";
import {
  Brain, AlertTriangle, TrendingUp, Users, Sparkles, Mic, Upload, FileScan,
  Activity, Waypoints, Microscope, ShieldAlert, ChevronRight, Play, CheckCircle2,
  GraduationCap, Heart, MessagesSquare, Loader2, ArrowUpRight, Flame, Zap
} from "lucide-react";
import { Card, CardHeader, Stat, Pill } from "./Primitives";
import { DNAHelix } from "./DNAHelix";
import {
  students, classConceptHeatmap, schoolMetrics, mistakeDistribution,
  teacherImpact, forecastTimeline, interventions
} from "@/data/mockData";
import { useApp } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const C = {
  primary: "oklch(0.52 0.21 273)",
  success: "oklch(0.68 0.16 158)",
  warning: "oklch(0.78 0.16 75)",
  risk: "oklch(0.62 0.22 16)",
  info: "oklch(0.65 0.14 230)",
};

const PIE_COLORS = ["var(--dna-1)", "var(--dna-2)", "var(--dna-3)", "var(--dna-4)", "var(--dna-5)", "var(--dna-6)"];

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/70 bg-card/95 backdrop-blur px-3 py-2 shadow-soft text-xs">
      {label && <div className="font-medium mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ========================= TEACHER ========================= */

export function TeacherOverview() {
  const atRisk = students.filter((s) => s.riskScore > 60).slice(0, 6);
  return (
    <div className="space-y-6">
      <Hero
        eyebrow="Teacher Console"
        title={<>Predict failure <span className="text-gradient">before it happens</span>.</>}
        subtitle="14 students are entering the high-risk zone within 2 weeks. Take action now."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Avg. Class Mastery" value={`${schoolMetrics.avgMastery}%`} delta="+4.2%" tone="primary" icon={<Brain className="h-4 w-4" />} />
        <Stat label="Students at Risk" value={schoolMetrics.studentsAtRisk} tone="risk" icon={<AlertTriangle className="h-4 w-4" />} />
        <Stat label="Growth Rate" value={`${schoolMetrics.growthRate}%`} delta="vs last month" tone="success" icon={<TrendingUp className="h-4 w-4" />} />
        <Stat label="Active Interventions" value={interventions.length} tone="info" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Class Performance Forecast" subtitle="Next 3 months · projected mastery vs risk" icon={<Waypoints className="h-4 w-4" />} />
          <div className="px-2 pb-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={forecastTimeline}>
                <defs>
                  <linearGradient id="perfG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.primary} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="riskG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.risk} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={C.risk} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<TooltipBox />} />
                <Area type="monotone" dataKey="performance" stroke={C.primary} fill="url(#perfG)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="risk" stroke={C.risk} fill="url(#riskG)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Mistake Type Distribution" subtitle="Across last 30 days" icon={<Activity className="h-4 w-4" />} />
          <div className="px-2 pb-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mistakeDistribution} dataKey="value" nameKey="type" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {mistakeDistribution.map((_, i) => <Cell key={i} fill={`var(--dna-${(i % 6) + 1})`} />)}
                </Pie>
                <Tooltip content={<TooltipBox />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Predictive Intervention Engine"
          subtitle="AI-recommended next actions, ranked by urgency"
          icon={<Sparkles className="h-4 w-4" />}
          right={<Pill tone="primary">Live</Pill>}
        />
        <div className="px-5 pb-5 space-y-2">
          {interventions.map((i) => (
            <motion.div key={i.id} whileHover={{ x: 4 }} className="flex items-center gap-3 rounded-xl border border-border/60 p-3 hover:border-primary/40 transition-colors">
              <div className={cn("h-10 w-10 rounded-xl grid place-items-center",
                i.urgency === "high" ? "bg-risk/10 text-risk" :
                i.urgency === "med" ? "bg-warning/10 text-warning" : "bg-success/10 text-success")}>
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{i.student} · {i.concept}</div>
                <div className="text-xs text-muted-foreground">{i.action}</div>
              </div>
              <Pill tone={i.urgency === "high" ? "risk" : i.urgency === "med" ? "warning" : "success"}>{i.urgency}</Pill>
              <button onClick={() => toast.success(`Intervention applied`, { description: `${i.action} → ${i.student}` })} className="text-xs px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">Apply</button>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Top At-Risk Students" subtitle="Immediate attention needed" icon={<AlertTriangle className="h-4 w-4" />} />
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {atRisk.map((s) => <StudentMiniCard key={s.id} s={s} />)}
        </div>
      </Card>
    </div>
  );
}

function StudentMiniCard({ s }: { s: typeof students[number] }) {
  const { setSelectedStudent, setRole, setActiveView } = useApp();
  return (
    <motion.button
      onClick={() => { setSelectedStudent(s.id); setRole("student"); setActiveView("overview"); }}
      whileHover={{ y: -2 }}
      className="text-left rounded-xl border border-border/60 p-4 hover:border-primary/40 hover:shadow-soft transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground grid place-items-center font-semibold">{s.avatar}</div>
        <div className="flex-1">
          <div className="font-medium text-sm">{s.name}</div>
          <div className="text-[11px] text-muted-foreground">Grade {s.grade}-{s.section} · {s.language}</div>
        </div>
        <Pill tone={s.riskScore > 75 ? "risk" : s.riskScore > 50 ? "warning" : "success"}>{s.riskScore}%</Pill>
      </div>
      <div className="mt-3 flex gap-1 h-1.5">
        <div className="flex-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-primary" style={{ width: `${s.mastery}%` }} />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Weak: {s.weakConcepts[0]}</span>
        <ChevronRight className="h-3 w-3" />
      </div>
    </motion.button>
  );
}

/* ========================= CLASSROOM DIGITAL TWIN ========================= */

export function ClassroomTwin() {
  const [topic, setTopic] = useState("Linear Equations");
  const [difficulty, setDifficulty] = useState(60);
  const [duration, setDuration] = useState(45);

  const zones = useMemo(() => {
    const ready = students.filter((s) => s.mastery > 75 - (difficulty - 50) * 0.3).length;
    const partial = students.filter((s) => s.mastery >= 50 && s.mastery <= 75).length;
    const high = students.length - ready - partial;
    return { ready, partial, high: Math.max(0, high) };
  }, [difficulty]);

  return (
    <div className="space-y-6">
      <Hero eyebrow="Classroom Digital Twin" title={<>A virtual simulation of <span className="text-gradient">your entire class</span>.</>} subtitle="Adjust the next lesson and see who will struggle — before you teach it." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader title="Lesson Parameters" subtitle="Tune and observe in real-time" icon={<Sparkles className="h-4 w-4" />} />
          <div className="p-5 pt-0 space-y-5">
            <div>
              <label className="text-xs text-muted-foreground">Next Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                {["Linear Equations", "Quadratic Equations", "Trigonometry", "Probability", "Photosynthesis"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Slider label="Difficulty" value={difficulty} onChange={setDifficulty} suffix="%" />
            <Slider label="Teaching Duration" value={duration} onChange={setDuration} min={15} max={90} suffix="min" />

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                {zones.high > 12
                  ? <><b>{Math.round((zones.high / students.length) * 100)}%</b> of class will struggle. Conduct a 15-min <b>bridge lesson on Fractions</b> first.</>
                  : <>Class is mostly ready. Proceed and pair red-zone students with peers.</>}
              </p>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Predicted Class Readiness" subtitle={`If you teach ${topic} today`} icon={<Activity className="h-4 w-4" />} />
          <div className="p-5 pt-0">
            <div className="grid grid-cols-3 gap-3 mb-5">
              <ZoneCard label="Ready" count={zones.ready} tone="success" />
              <ZoneCard label="Partially Ready" count={zones.partial} tone="warning" />
              <ZoneCard label="High Risk" count={zones.high} tone="risk" />
            </div>

            <div className="rounded-xl bg-muted/40 p-4 grid grid-cols-10 gap-1.5">
              {students.map((s, i) => {
                const z = s.mastery > 75 ? "success" : s.mastery >= 50 ? "warning" : "risk";
                const color = z === "success" ? C.success : z === "warning" ? C.warning : C.risk;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    title={`${s.name} · ${s.mastery}%`}
                    className="aspect-square rounded-md cursor-pointer hover:scale-110 transition-transform"
                    style={{ background: color, opacity: 0.45 + (s.mastery / 100) * 0.55 }}
                  />
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ZoneCard({ label, count, tone }: { label: string; count: number; tone: "success" | "warning" | "risk" }) {
  const cl = {
    success: "from-success/20 to-success/5 border-success/30 text-success",
    warning: "from-warning/20 to-warning/5 border-warning/30 text-warning",
    risk: "from-risk/20 to-risk/5 border-risk/30 text-risk",
  }[tone];
  return (
    <div className={cn("rounded-xl border bg-gradient-to-br p-4", cl)}>
      <div className="text-xs uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 text-3xl font-semibold">{count}</div>
      <div className="mt-1 text-[10px] opacity-60">students</div>
    </div>
  );
}

function Slider({ label, value, onChange, min = 0, max = 100, suffix = "" }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; suffix?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-primary" />
    </div>
  );
}

/* ========================= RISK TABLE ========================= */

export function RiskTable() {
  const sorted = [...students].sort((a, b) => b.riskScore - a.riskScore);
  return (
    <div className="space-y-6">
      <Hero eyebrow="Student Risk Table" title={<>Every student. <span className="text-gradient">Ranked by future failure risk.</span></>} subtitle="Built from concept gaps, behavior signals, and predicted failure cascades." />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="text-left px-5 py-3">Student</th>
                <th className="text-left px-3 py-3">Grade</th>
                <th className="text-left px-3 py-3">Mastery</th>
                <th className="text-left px-3 py-3">Future Risk</th>
                <th className="text-left px-3 py-3">Weak Concept</th>
                <th className="text-left px-3 py-3">Suggested Intervention</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.015 }}
                  className="border-b border-border/40 hover:bg-muted/30"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg gradient-primary text-primary-foreground grid place-items-center text-xs font-semibold">{s.avatar}</div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{s.grade}-{s.section}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full gradient-primary" style={{ width: `${s.mastery}%` }} />
                      </div>
                      <span className="text-xs font-medium">{s.mastery}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Pill tone={s.riskScore > 75 ? "risk" : s.riskScore > 50 ? "warning" : "success"}>{s.riskScore}%</Pill>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{s.weakConcepts[0]}</td>
                  <td className="px-3 py-3 text-xs">{s.riskScore > 70 ? "15-min Bridge Lesson" : s.riskScore > 50 ? "Peer pairing" : "Maintain"}</td>
                  <td className="px-3 py-3">
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-border/60 hover:border-primary/40 inline-flex items-center gap-1">
                      View <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ========================= BRIDGE LESSON ========================= */

export function BridgeLesson() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const generate = () => {
    setGenerating(true); setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1600);
  };

  return (
    <div className="space-y-6">
      <Hero eyebrow="Bridge Lesson Generator" title={<>Generate a recovery lesson in <span className="text-gradient">one click</span>.</>} subtitle="AI builds a recap, foundation lesson, practice set, and bilingual explanation." />

      <Card>
        <div className="p-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Target Concept</label>
              <select className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none">
                <option>Fractions — denominator alignment</option>
                <option>Algebra — variable isolation</option>
                <option>Equations — sign rules</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Language</label>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {["English","Hindi","Hinglish"].map(l => (
                  <button key={l} className="text-xs px-2 py-2 rounded-lg border border-border/60 hover:border-primary/40">{l}</button>
                ))}
              </div>
            </div>
            <button onClick={generate} disabled={generating}
              className="w-full mt-2 rounded-xl gradient-primary text-primary-foreground py-3 text-sm font-medium inline-flex items-center justify-center gap-2 shadow-glow disabled:opacity-70">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Composing lesson…" : "Generate Bridge Lesson"}
            </button>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!generated ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full min-h-[300px] grid place-items-center rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
                  {generating ? "AI is generating personalized content…" : "Click Generate to create the bridge lesson."}
                </motion.div>
              ) : (
                <motion.div key="out" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {[
                    { t: "5-Min Recap", body: "Quick review of fraction basics with pizza-slice analogy.", icon: Play, tone: "info" },
                    { t: "10-Min Foundation Lesson", body: "Equivalent fractions, LCM, and denominator alignment with step-by-step visuals.", icon: GraduationCap, tone: "primary" },
                    { t: "Practice Set (6 questions)", body: "Mixed difficulty including 3/4 + 1/2 and 2/3 + 1/6 with auto-grading.", icon: CheckCircle2, tone: "success" },
                    { t: "Bilingual Explanation (Hinglish)", body: "Dekho, pizza ke 4 slices mein se 3 lo, fir aadha pizza add karo — pehle dono ko same size mein convert karo.", icon: MessagesSquare, tone: "warning" },
                  ].map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="rounded-xl border border-border/60 p-4 flex gap-3 hover:border-primary/40 transition-colors">
                      <div className={cn("h-10 w-10 rounded-xl grid place-items-center",
                        b.tone === "primary" ? "bg-primary/10 text-primary" :
                        b.tone === "success" ? "bg-success/10 text-success" :
                        b.tone === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
                      )}>
                        <b.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{b.t}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{b.body}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ========================= SILENT STUDENT ========================= */

export function SilentStudents() {
  const silent = [...students].sort((a, b) => b.silentRisk - a.silentRisk).slice(0, 8);
  return (
    <div className="space-y-6">
      <Hero eyebrow="Silent Student Detector" title={<>The students who <span className="text-gradient">never raise their hand</span>.</>} subtitle="High attendance, low engagement — they're invisible until they fail." />
      <Card>
        <CardHeader title="Hidden Risk Students" subtitle="Detected via low participation & response gaps" icon={<Microscope className="h-4 w-4" />} />
        <div className="px-5 pb-5 space-y-2">
          {silent.map((s) => (
            <div key={s.id} className="rounded-xl border border-border/60 p-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-center hover:border-warning/40 transition-colors">
              <div className="flex items-center gap-3 md:col-span-1">
                <div className="h-10 w-10 rounded-xl bg-warning/10 text-warning grid place-items-center font-semibold">{s.avatar}</div>
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">Attendance {s.attendance}%</div>
                </div>
              </div>
              <SignalBar label="Participation" value={100 - s.silentRisk} tone="risk" />
              <SignalBar label="Quiz Activity" value={Math.min(100, s.mastery + 5)} tone="warning" />
              <SignalBar label="Voice Responses" value={Math.max(5, 100 - s.silentRisk - 10)} tone="risk" />
              <div className="text-xs">
                <Pill tone="risk">Hidden Risk</Pill>
                <div className="mt-1 text-muted-foreground">{s.language === "Hindi" ? "Language barrier risk" : "Low participation"}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SignalBar({ label, value, tone }: { label: string; value: number; tone: "risk" | "warning" | "success" }) {
  const color = tone === "risk" ? C.risk : tone === "warning" ? C.warning : C.success;
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

/* ========================= UPLOAD ZONE ========================= */

export function UploadZone() {
  const [phase, setPhase] = useState<"idle" | "scan" | "ocr" | "dna" | "done">("idle");
  const start = () => {
    setPhase("scan");
    setTimeout(() => setPhase("ocr"), 900);
    setTimeout(() => setPhase("dna"), 1800);
    setTimeout(() => setPhase("done"), 2700);
  };
  return (
    <div className="space-y-6">
      <Hero eyebrow="Scan & Ingest" title={<>Drop OMR sheets. <span className="text-gradient">We do the rest.</span></>} subtitle="OCR → Mistake DNA extraction → dashboards update instantly." />
      <Card>
        <div className="p-6">
          <button onClick={start} className="w-full rounded-2xl border-2 border-dashed border-border hover:border-primary/50 p-10 grid place-items-center text-center transition-colors">
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <div className="font-medium">Click or drag answer sheets here</div>
            <div className="text-xs text-muted-foreground mt-1">PDF · JPG · PNG · OMR templates supported</div>
          </button>

          {phase !== "idle" && (
            <div className="mt-6 space-y-2">
              {[
                { key: "scan", label: "Scanning sheets…", icon: FileScan },
                { key: "ocr", label: "OCR processing…", icon: Loader2 },
                { key: "dna", label: "Extracting Mistake DNA…", icon: Brain },
                { key: "done", label: "Dashboards updated", icon: CheckCircle2 },
              ].map(({ key, label, icon: Icon }, i) => {
                const order = ["scan","ocr","dna","done"];
                const active = order.indexOf(phase) >= i;
                const done = order.indexOf(phase) > i || phase === "done";
                return (
                  <div key={key} className={cn("flex items-center gap-3 rounded-xl border p-3 transition-all",
                    active ? "border-primary/40 bg-primary/5" : "border-border/40 opacity-50")}>
                    <Icon className={cn("h-4 w-4", done ? "text-success" : active ? "text-primary animate-spin" : "text-muted-foreground")} />
                    <span className="text-sm">{label}</span>
                    {done && <CheckCircle2 className="h-4 w-4 text-success ml-auto" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ========================= STUDENT VIEWS ========================= */

export function StudentOverview() {
  const { selectedStudentId } = useApp();
  const s = students.find((x) => x.id === selectedStudentId) ?? students[0];
  const radar = Object.entries(s.dna).map(([k, v]) => ({ axis: k, value: v }));

  return (
    <div className="space-y-6">
      <Hero
        eyebrow={`${s.name} · Grade ${s.grade}-${s.section}`}
        title={<>Your <span className="text-gradient">Learning DNA</span>.</>}
        subtitle="Six dimensions that shape how you learn — animated, evolving, and uniquely yours."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Mastery" value={`${s.mastery}%`} tone="primary" icon={<Brain className="h-4 w-4" />} />
        <Stat label="Confidence" value={`${s.dna.confidence}%`} tone="info" icon={<Activity className="h-4 w-4" />} />
        <Stat label="Curiosity" value={`${s.dna.curiosity}%`} tone="success" icon={<Sparkles className="h-4 w-4" />} />
        <Stat label="Risk" value={`${s.riskScore}%`} tone={s.riskScore > 60 ? "risk" : "warning"} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="DNA Helix" subtitle="Live visualization" icon={<Brain className="h-4 w-4" />} />
          <DNAHelix dna={s.dna} />
        </Card>

        <Card>
          <CardHeader title="DNA Radar" subtitle="Profile across 6 axes" icon={<Activity className="h-4 w-4" />} />
          <div className="h-[360px] px-2 pb-2">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke={C.primary} fill={C.primary} fillOpacity={0.35} strokeWidth={2} />
                <Tooltip content={<TooltipBox />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Growth Over Time" subtitle="Mastery & confidence" icon={<TrendingUp className="h-4 w-4" />} />
          <div className="h-[360px] px-2 pb-2">
            <ResponsiveContainer>
              <LineChart data={s.growth}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<TooltipBox />} />
                <Line type="monotone" dataKey="mastery" stroke={C.primary} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="confidence" stroke={C.success} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Emotional Learning Signals" subtitle="Tracking confusion, anxiety, overconfidence weekly" icon={<Flame className="h-4 w-4" />} />
        <div className="h-72 px-2 pb-4">
          <ResponsiveContainer>
            <AreaChart data={s.emotion}>
              <defs>
                <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.risk} stopOpacity={0.5} /><stop offset="100%" stopColor={C.risk} stopOpacity={0} /></linearGradient>
                <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.warning} stopOpacity={0.5} /><stop offset="100%" stopColor={C.warning} stopOpacity={0} /></linearGradient>
                <linearGradient id="oG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.info} stopOpacity={0.5} /><stop offset="100%" stopColor={C.info} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<TooltipBox />} />
              <Area type="monotone" dataKey="confusion" stroke={C.risk} fill="url(#cG)" />
              <Area type="monotone" dataKey="anxiety" stroke={C.warning} fill="url(#aG)" />
              <Area type="monotone" dataKey="overconfidence" stroke={C.info} fill="url(#oG)" />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export function MistakeDNAReport() {
  const { selectedStudentId } = useApp();
  const s = students.find((x) => x.id === selectedStudentId) ?? students[0];
  return (
    <div className="space-y-6">
      <Hero eyebrow="Mistake DNA Report" title={<>Not just <span className="text-gradient">what</span> went wrong — <span className="text-gradient">why</span>.</>} subtitle="Every mistake decoded into root cause, concept gap, and intervention." />

      <div className="grid gap-4 md:grid-cols-2">
        {s.recentMistakes.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl gradient-risk text-risk-foreground grid place-items-center">
                  <FileScan className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{m.concept}</div>
                  <div className="font-medium mt-0.5">{m.question}</div>
                </div>
                <Pill tone="risk">{m.type}</Pill>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-risk/5 border border-risk/20 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-risk">Your Answer</div>
                  <div className="font-mono mt-1">{m.answer}</div>
                </div>
                <div className="rounded-xl bg-success/5 border border-success/20 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-success">Correct</div>
                  <div className="font-mono mt-1">{m.correct}</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-3">
                <div className="text-[10px] uppercase tracking-wider text-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Root Cause
                </div>
                <div className="text-sm mt-1">{m.rootCause}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone="warning">Concept: Weak</Pill>
                <Pill tone="success">Calculation: Strong</Pill>
                <Pill tone="info">Recommendation: 5-min recap</Pill>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FutureFailureTimeline() {
  const { selectedStudentId } = useApp();
  const s = students.find((x) => x.id === selectedStudentId) ?? students[0];
  return (
    <div className="space-y-6">
      <Hero eyebrow="Future Failure Timeline" title={<>What will go wrong — <span className="text-gradient">and when</span>.</>} subtitle="Academic forecasting based on current concept dependencies." />

      <Card className="p-6">
        <div className="relative">
          <div className="absolute left-4 right-4 top-9 h-1 rounded-full bg-gradient-to-r from-success via-warning to-risk" />
          <div className="grid grid-cols-4 gap-4 relative">
            {s.futureRisks.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                <div className={cn("mx-auto h-6 w-6 rounded-full ring-4 ring-background",
                  r.severity === "high" ? "bg-risk" : r.severity === "med" ? "bg-warning" : "bg-success")} />
                <div className="mt-4 rounded-xl border border-border/60 p-4 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.weeks === 0 ? "Today" : `+${r.weeks} weeks`}
                  </div>
                  <div className="font-medium text-sm mt-1">{r.topic}</div>
                  <div className="mt-2"><Pill tone={r.severity === "high" ? "risk" : r.severity === "med" ? "warning" : "success"}>Risk {r.risk}%</Pill></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Trajectory if no intervention" subtitle="Performance vs risk projection" icon={<Waypoints className="h-4 w-4" />} />
        <div className="h-64 px-2 pb-4">
          <ResponsiveContainer>
            <LineChart data={forecastTimeline}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<TooltipBox />} />
              <Line type="monotone" dataKey="performance" stroke={C.primary} strokeWidth={2.5} />
              <Line type="monotone" dataKey="risk" stroke={C.risk} strokeWidth={2.5} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export function PeerCircle() {
  const { selectedStudentId } = useApp();
  const s = students.find((x) => x.id === selectedStudentId) ?? students[0];
  return (
    <div className="space-y-6">
      <Hero eyebrow="AI Peer Circle" title={<>Who learns <span className="text-gradient">best with you</span>.</>} subtitle="Match based on complementary strengths and communication styles." />
      <div className="grid md:grid-cols-3 gap-4">
        {s.peerMatches.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-5 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl gradient-primary text-primary-foreground grid place-items-center text-2xl font-semibold">{p.name[0]}</div>
              <div className="mt-3 font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">Best for {p.strength}</div>
              <div className="mt-4 rounded-xl bg-muted/40 p-3 text-xs">
                <div className="flex justify-between"><span>Communication</span><span className="font-semibold">{p.communication}%</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: `${p.communication}%` }} />
                </div>
              </div>
              <button className="mt-4 w-full text-xs px-3 py-2 rounded-lg border border-border/60 hover:border-primary/40">Invite to study group</button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function VoiceReasoning() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const start = () => {
    setRecording(true); setTranscript(null);
    setTimeout(() => {
      setRecording(false);
      setTranscript("Sir, mujhe lagta hai 3/4 plus 1/2 equal to 4/6 hota hai kyunki upar 3+1 aur neeche 4+2. (Translation: I added numerators and denominators directly.)");
    }, 2400);
  };
  return (
    <div className="space-y-6">
      <Hero eyebrow="Voice Reasoning Mode" title={<>Speak your <span className="text-gradient">thinking</span> — we'll decode it.</>} subtitle="English · Hindi · Hinglish. Reveals reasoning errors invisible in written answers." />
      <Card className="p-8 text-center">
        <button onClick={start} disabled={recording}
          className={cn("mx-auto h-28 w-28 rounded-full grid place-items-center transition-all",
            recording ? "bg-risk text-risk-foreground animate-pulse-ring" : "gradient-primary text-primary-foreground shadow-glow")}>
          <Mic className="h-12 w-12" />
        </button>
        <div className="mt-4 text-sm font-medium">{recording ? "Listening…" : "Tap to start"}</div>
        <div className="text-xs text-muted-foreground mt-1">Explain why you chose your answer.</div>

        {transcript && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 mx-auto max-w-xl text-left rounded-xl border border-border/60 p-4">
            <div className="text-[10px] uppercase tracking-wider text-primary mb-1">Transcript · Hinglish detected</div>
            <p className="text-sm">{transcript}</p>
            <div className="mt-3 rounded-lg bg-risk/5 border border-risk/20 p-3 text-sm">
              <div className="text-[10px] uppercase tracking-wider text-risk">Reasoning Error</div>
              Student added numerators and denominators independently — classic <b>denominator alignment</b> misconception.
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}

/* ========================= PARENT ========================= */

export function ParentOverview() {
  const s = students[0];
  return (
    <div className="space-y-6">
      <Hero eyebrow={`Parent of ${s.name}`} title={<>It's a <span className="text-gradient">concept gap</span>, not an effort problem.</>} subtitle="Here's what's really happening and how you can help at home." />
      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Mastery" value={`${s.mastery}%`} tone="primary" icon={<Brain className="h-4 w-4" />} />
        <Stat label="Attendance" value={`${s.attendance}%`} tone="success" icon={<CheckCircle2 className="h-4 w-4" />} />
        <Stat label="Risk" value={`${s.riskScore}%`} tone={s.riskScore > 60 ? "risk" : "warning"} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader title="What you can do at home this week" subtitle="Curated activities matched to concept gaps" icon={<Heart className="h-4 w-4" />} />
        <div className="p-5 pt-0 grid md:grid-cols-2 gap-3">
          {[
            { t: "Pizza-slice fractions game", d: "15 min, kitchen activity. Builds denominator intuition." },
            { t: "Watch: bilingual fractions video", d: "8-min Hinglish explainer with practice." },
            { t: "Talk: 'What's the trickiest part?'", d: "Open-ended discussion reduces math anxiety." },
            { t: "Daily 5-min drill (printable)", d: "Repetition without pressure. Track in app." },
          ].map((a, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-4">
              <div className="font-medium text-sm">{a.t}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ========================= ADMIN ========================= */

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <Hero eyebrow="School Intelligence" title={<>Run the school like a <span className="text-gradient">data product</span>.</>} subtitle="Risk heatmaps, teacher impact, and failure forecasts across every grade." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Avg. School Mastery" value="71%" delta="+3.1%" tone="primary" icon={<Brain className="h-4 w-4" />} />
        <Stat label="Total Students" value={students.length * 6} tone="info" icon={<Users className="h-4 w-4" />} />
        <Stat label="At-Risk" value={42} tone="risk" icon={<ShieldAlert className="h-4 w-4" />} />
        <Stat label="Teacher Impact Index" value="78" tone="success" icon={<GraduationCap className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader title="Concept Risk Heatmap" subtitle="Concept mastery across grades" icon={<Activity className="h-4 w-4" />} />
        <div className="p-5 pt-0 overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[160px_repeat(5,1fr)] gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              <div></div>
              {["Grade 6","Grade 7","Grade 8","Grade 9","Grade 10"].map(g => <div key={g} className="text-center">{g}</div>)}
            </div>
            {classConceptHeatmap.map((row) => (
              <div key={row.concept} className="grid grid-cols-[160px_repeat(5,1fr)] gap-1 mb-1">
                <div className="text-xs flex items-center">{row.concept}</div>
                {[row.grade6, row.grade7, row.grade8, row.grade9, row.grade10].map((v, i) => {
                  const color = v > 75 ? C.success : v > 55 ? C.warning : C.risk;
                  return (
                    <div key={i} className="aspect-[3/1] rounded-md grid place-items-center text-[11px] font-semibold text-white"
                         style={{ background: color, opacity: 0.4 + (v / 100) * 0.6 }}>
                      {v}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Teacher Impact Analysis" icon={<GraduationCap className="h-4 w-4" />} />
          <div className="h-72 px-2 pb-4">
            <ResponsiveContainer>
              <BarChart data={teacherImpact} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="teacher" tick={{ fontSize: 11 }} width={100} />
                <Tooltip content={<TooltipBox />} />
                <Bar dataKey="impact" fill={C.primary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Future Failure Forecast" subtitle="School-wide trajectory" icon={<Waypoints className="h-4 w-4" />} />
          <div className="h-72 px-2 pb-4">
            <ResponsiveContainer>
              <AreaChart data={forecastTimeline}>
                <defs>
                  <linearGradient id="adminR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.risk} stopOpacity={0.5} /><stop offset="100%" stopColor={C.risk} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<TooltipBox />} />
                <Area type="monotone" dataKey="risk" stroke={C.risk} fill="url(#adminR)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ========================= HERO ========================= */

function Hero({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 lg:p-8">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full gradient-primary opacity-20 blur-3xl" />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium">{eyebrow}</div>
        <h1 className="mt-2 text-2xl lg:text-3xl font-semibold tracking-tight leading-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>
      </div>
    </motion.div>
  );
}
