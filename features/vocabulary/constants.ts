import type { PosConfig } from "./types";

export const POS_CONFIG: Record<string, PosConfig> = {
  noun: {
    accent: "bg-amber-400",
    initial: "bg-amber-50 text-amber-700",
    label: "text-amber-700",
    meaning: "bg-amber-50/70 border-amber-100",
  },
  verb: {
    accent: "bg-violet-500",
    initial: "bg-violet-50 text-violet-700",
    label: "text-violet-700",
    meaning: "bg-violet-50/70 border-violet-100",
  },
  adjective: {
    accent: "bg-rose-400",
    initial: "bg-rose-50 text-rose-700",
    label: "text-rose-700",
    meaning: "bg-rose-50/70 border-rose-100",
  },
  adverb: {
    accent: "bg-cyan-500",
    initial: "bg-cyan-50 text-cyan-700",
    label: "text-cyan-700",
    meaning: "bg-cyan-50/70 border-cyan-100",
  },
  pronoun: {
    accent: "bg-lime-500",
    initial: "bg-lime-50 text-lime-700",
    label: "text-lime-700",
    meaning: "bg-lime-50/70 border-lime-100",
  },
  default: {
    accent: "bg-slate-400",
    initial: "bg-slate-100 text-slate-700",
    label: "text-slate-500",
    meaning: "bg-slate-50 border-slate-100",
  },
};
