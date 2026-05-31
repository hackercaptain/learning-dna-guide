import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbit — Early Intervention OS for Schools" },
      { name: "description", content: "AI-powered platform that predicts learning failure before it happens and guides teachers, students, parents, and schools to the fastest intervention." },
      { property: "og:title", content: "Orbit" },
      { property: "og:description", content: "Predict learning failure before it happens." },
    ],
  }),
  component: () => <AppShell />,
});
