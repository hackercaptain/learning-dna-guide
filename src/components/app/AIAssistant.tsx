import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, X, Mic } from "lucide-react";
import { useApp } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const SAMPLES = [
  { q: "Why is Rahul failing fractions?", a: "Rahul's Concept DNA shows weakness in denominator alignment. Think of fractions like pizza slices — you can only add slices of the same size. I recommend a 15-min Bridge Lesson on equivalent fractions." },
  { q: "Predict next month's risk", a: "Based on current trajectory, 14 students will enter high-risk zone within 4 weeks. Top driver: weak Fractions → Algebra readiness collapse. Conduct bridge lesson within 7 days to prevent." },
  { q: "Explain in Hinglish", a: "Dekho, fractions matlab pizza ke pieces. 3/4 + 1/2 karne ke liye dono ko same size mein convert karna padta hai — that's denominator alignment. Rahul yahi step skip kar raha hai." },
];

export function AIAssistant() {
  const { assistantOpen, toggleAssistant } = useApp();
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm DNA Tutor. I never give direct answers — I explain with analogies. Ask me about any student, concept, or prediction." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (q?: string) => {
    const text = (q ?? input).trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const match = SAMPLES.find((s) => text.toLowerCase().includes(s.q.toLowerCase().slice(0, 8))) ?? SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
      setMsgs((m) => [...m, { role: "ai", text: match.a }]);
      setTyping(false);
    }, 900);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleAssistant();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleAssistant]);

  return (
    <>
      <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl gradient-primary shadow-glow grid place-items-center text-primary-foreground hover:scale-105 transition-transform"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
        <span className="absolute -inset-1 rounded-3xl border border-primary/40 animate-pulse-ring" />
      </button>

      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] rounded-2xl glass shadow-glow flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-border/60 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">DNA Tutor</div>
                <div className="text-[10px] text-muted-foreground">English · Hindi · Hinglish</div>
              </div>
              <button onClick={toggleAssistant} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted/60">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm max-w-[85%] leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1.5 px-3">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
                </div>
              )}
            </div>

            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {SAMPLES.slice(0, 3).map((s) => (
                <button key={s.q} onClick={() => send(s.q)} className="text-[11px] px-2.5 py-1 rounded-full border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  {s.q}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-border/60 flex gap-2">
              <button className="h-10 w-10 grid place-items-center rounded-xl bg-muted hover:bg-muted/70">
                <Mic className="h-4 w-4 text-muted-foreground" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything — predict, explain, analyze…"
                className="flex-1 rounded-xl bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button onClick={() => send()} className="h-10 w-10 grid place-items-center rounded-xl gradient-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
