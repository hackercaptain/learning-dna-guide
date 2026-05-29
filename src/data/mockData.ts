// Comprehensive mock data for MistakeDNA AI
export type Role = "teacher" | "student" | "parent" | "admin";

export type MistakeType =
  | "Conceptual"
  | "Calculation"
  | "Language"
  | "Careless"
  | "Guessing"
  | "Confidence";

export interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  section: string;
  attendance: number;
  mastery: number;
  riskScore: number;
  silentRisk: number;
  language: "English" | "Hindi" | "Hinglish";
  topConcepts: string[];
  weakConcepts: string[];
  dna: {
    concept: number;
    confidence: number;
    curiosity: number;
    attention: number;
    language: number;
    consistency: number;
  };
  futureRisks: { weeks: number; topic: string; risk: number; severity: "low" | "med" | "high" }[];
  growth: { month: string; mastery: number; confidence: number }[];
  recentMistakes: {
    question: string;
    answer: string;
    correct: string;
    type: MistakeType;
    rootCause: string;
    concept: string;
  }[];
  peerMatches: { name: string; strength: string; communication: number }[];
  emotion: { week: string; confusion: number; anxiety: number; overconfidence: number }[];
}

const FIRST = [
  "Rahul","Priya","Amit","Sneha","Arjun","Kavya","Vikram","Anjali","Rohan","Diya",
  "Karan","Ishita","Aditya","Riya","Sahil","Pooja","Manav","Tara","Yash","Neha",
  "Dev","Aanya","Krish","Meera","Aryan","Sara","Veer","Nisha","Ayaan","Zara",
  "Ravi","Simran","Kabir","Anaya","Vivaan","Avni","Reyansh","Myra","Ishaan","Aadhya",
  "Aarav","Pari","Atharv","Kiara","Ansh","Aisha","Shaurya","Inaya","Vihaan","Saanvi"
];
const CONCEPTS = ["Fractions","Decimals","Algebra","Equations","Geometry","Probability","Photosynthesis","Newton's Laws","Acids & Bases","Grammar","Comprehension","Trigonometry"];
const MISTAKES: MistakeType[] = ["Conceptual","Calculation","Language","Careless","Guessing","Confidence"];

const rand = (seed: number) => {
  let x = Math.sin(seed) * 10000; return x - Math.floor(x);
};
const ri = (s: number, min: number, max: number) => Math.floor(rand(s) * (max - min + 1)) + min;

function makeStudent(i: number): Student {
  const name = FIRST[i % FIRST.length];
  const mastery = ri(i + 1, 28, 96);
  const risk = 100 - mastery + ri(i + 2, -10, 12);
  return {
    id: `S${String(i + 1).padStart(3, "0")}`,
    name,
    avatar: name[0],
    grade: ["6","7","8","9","10"][i % 5],
    section: ["A","B","C"][i % 3],
    attendance: ri(i + 3, 60, 99),
    mastery,
    riskScore: Math.max(5, Math.min(95, risk)),
    silentRisk: ri(i + 4, 5, 90),
    language: (["English","Hindi","Hinglish"] as const)[i % 3],
    topConcepts: [CONCEPTS[i % CONCEPTS.length], CONCEPTS[(i + 3) % CONCEPTS.length]],
    weakConcepts: [CONCEPTS[(i + 5) % CONCEPTS.length], CONCEPTS[(i + 7) % CONCEPTS.length]],
    dna: {
      concept: ri(i + 10, 30, 95),
      confidence: ri(i + 11, 25, 95),
      curiosity: ri(i + 12, 40, 98),
      attention: ri(i + 13, 35, 95),
      language: ri(i + 14, 40, 98),
      consistency: ri(i + 15, 30, 95),
    },
    futureRisks: [
      { weeks: 0, topic: "Fractions weak", risk: 70 + (i % 20), severity: "med" },
      { weeks: 2, topic: "Algebra readiness risk", risk: 75, severity: "high" },
      { weeks: 4, topic: "Equation solving difficulty", risk: 82, severity: "high" },
      { weeks: 8, topic: "Exam performance drop", risk: 88, severity: "high" },
    ],
    growth: ["Jan","Feb","Mar","Apr","May","Jun"].map((m, k) => ({
      month: m,
      mastery: Math.min(98, mastery - 10 + k * ri(i + k, 2, 6)),
      confidence: Math.min(98, 40 + k * ri(i + k + 1, 3, 8)),
    })),
    recentMistakes: [
      { question: "3/4 + 1/2", answer: "4/6", correct: "5/4", type: "Conceptual", rootCause: "Does not understand denominator alignment", concept: "Fractions" },
      { question: "2x + 6 = 14", answer: "x = 10", correct: "x = 4", type: "Calculation", rootCause: "Sign error during transposition", concept: "Equations" },
      { question: "Photosynthesis produces?", answer: "Carbon dioxide", correct: "Oxygen", type: "Conceptual", rootCause: "Confuses reactants and products", concept: "Photosynthesis" },
    ],
    peerMatches: [
      { name: FIRST[(i + 4) % FIRST.length], strength: "Fractions", communication: 92 },
      { name: FIRST[(i + 9) % FIRST.length], strength: "Algebra", communication: 85 },
      { name: FIRST[(i + 13) % FIRST.length], strength: "Geometry", communication: 78 },
    ],
    emotion: ["W1","W2","W3","W4","W5","W6","W7","W8"].map((w, k) => ({
      week: w,
      confusion: ri(i + k + 20, 10, 85),
      anxiety: ri(i + k + 30, 5, 70),
      overconfidence: ri(i + k + 40, 5, 55),
    })),
  };
}

export const students: Student[] = Array.from({ length: 52 }, (_, i) => makeStudent(i));

export const classConceptHeatmap = CONCEPTS.map((c, i) => ({
  concept: c,
  grade6: ri(i + 100, 30, 95),
  grade7: ri(i + 200, 30, 95),
  grade8: ri(i + 300, 30, 95),
  grade9: ri(i + 400, 30, 95),
  grade10: ri(i + 500, 30, 95),
}));

export const schoolMetrics = {
  avgMastery: 71,
  studentsAtRisk: 14,
  growthRate: 8.4,
  mostFailed: ["Fractions", "Algebra", "Equations", "Trigonometry"],
};

export const mistakeDistribution = MISTAKES.map((m, i) => ({
  type: m,
  value: ri(i + 999, 8, 32),
}));

export const learningPath = [
  { from: "Fractions", to: "Decimals", weight: 12 },
  { from: "Fractions", to: "Algebra", weight: 18 },
  { from: "Decimals", to: "Percentage", weight: 9 },
  { from: "Algebra", to: "Equations", weight: 22 },
  { from: "Equations", to: "Trigonometry", weight: 14 },
  { from: "Geometry", to: "Trigonometry", weight: 11 },
];

export const teacherImpact = [
  { teacher: "Mrs. Sharma", impact: 88, subject: "Math" },
  { teacher: "Mr. Iyer", impact: 76, subject: "Science" },
  { teacher: "Ms. Khan", impact: 82, subject: "English" },
  { teacher: "Mr. Patel", impact: 69, subject: "Social" },
];

export const forecastTimeline = [
  { month: "Now", performance: 72, risk: 28 },
  { month: "+2w", performance: 70, risk: 34 },
  { month: "+1m", performance: 66, risk: 42 },
  { month: "+2m", performance: 60, risk: 55 },
  { month: "+3m", performance: 56, risk: 64 },
];

export const interventions = [
  { id: "I1", student: "Rahul", concept: "Fractions", action: "15-min Bridge Lesson", urgency: "high" as const },
  { id: "I2", student: "Sneha", concept: "Algebra", action: "Peer Study with Amit", urgency: "med" as const },
  { id: "I3", student: "Karan", concept: "Trigonometry", action: "Bilingual Recap Video", urgency: "high" as const },
  { id: "I4", student: "Diya", concept: "Equations", action: "Daily 5-min Drill", urgency: "low" as const },
];
