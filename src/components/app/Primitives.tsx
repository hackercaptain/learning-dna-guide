import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({ children, className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card shadow-soft", className)} {...p}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon, right }: { title: string; subtitle?: string; icon?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between p-5 pb-3">
      <div className="flex items-start gap-3">
        {icon && <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">{icon}</div>}
        <div>
          <h3 className="font-semibold leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function Stat({ label, value, delta, tone = "primary", icon }: {
  label: string; value: string | number; delta?: string;
  tone?: "primary" | "success" | "warning" | "risk" | "info"; icon?: ReactNode;
}) {
  const toneClass = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    risk: "text-risk bg-risk/10",
    info: "text-info bg-info/10",
  }[tone];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {icon && <span className={cn("h-8 w-8 grid place-items-center rounded-lg", toneClass)}>{icon}</span>}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {delta && <div className="text-xs text-success mb-1">{delta}</div>}
      </div>
    </motion.div>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "risk" | "primary" | "info" }) {
  const t = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    risk: "bg-risk/10 text-risk",
    info: "bg-info/10 text-info",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide", t)}>{children}</span>;
}
