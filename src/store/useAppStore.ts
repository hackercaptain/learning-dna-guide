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

export const useApp = create<AppState>((set) => ({
  role: "teacher",
  setRole: (r) => set({ role: r, activeView: "overview" }),
  theme: "light",
  toggleTheme: () => set((s) => {
    const next = s.theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    return { theme: next };
  }),
  activeView: "overview",
  setActiveView: (v) => set({ activeView: v }),
  selectedStudentId: "S001",
  setSelectedStudent: (id) => set({ selectedStudentId: id }),
  assistantOpen: false,
  toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
}));
