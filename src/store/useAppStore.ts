import { create } from "zustand";
import type { Role } from "@/data/mockData";

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  activeView: string;
  setActiveView: (v: string) => void;
  selectedStudentId: string | null;
  setSelectedStudent: (id: string | null) => void;
  assistantOpen: boolean;
  toggleAssistant: () => void;
}

const applyTheme = (t: "light" | "dark") => {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.classList.toggle("dark", t === "dark");
  el.classList.toggle("light", t === "light");
};

export const useApp = create<AppState>((set) => ({
  role: "teacher",
  setRole: (r) => set({ role: r, activeView: "overview" }),
  theme: "dark",
  toggleTheme: () => set((s) => {
    const next = s.theme === "light" ? "dark" : "light";
    applyTheme(next);
    return { theme: next };
  }),
  activeView: "overview",
  setActiveView: (v) => set({ activeView: v }),
  selectedStudentId: "S001",
  setSelectedStudent: (id) => set({ selectedStudentId: id }),
  assistantOpen: false,
  toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
}));
