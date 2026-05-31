import { createFileRoute } from "@tanstack/react-router";
import { KairosApp } from "@/components/kairos/KairosApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kairos — Right-moment learning" },
      { name: "description", content: "Kairos analyzes student reasoning in real time, surfaces learning gaps the moment they form, and tells teachers exactly what to focus on tomorrow." },
      { property: "og:title", content: "Kairos" },
      { property: "og:description", content: "Find the learning gap the moment it forms." },
    ],
  }),
  component: () => <KairosApp />,
});
