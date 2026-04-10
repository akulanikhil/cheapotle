"use client";

import { PROTEINS, PROTEIN_LABELS, type Protein } from "@/lib/proteins";

interface ProteinSelectorProps {
  selected: Protein;
  onChange: (p: Protein) => void;
}

export default function ProteinSelector({ selected, onChange }: ProteinSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
      {PROTEINS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all ${
            selected === p
              ? "bg-[#c41230] text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          }`}
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: "0.8rem" }}
        >
          {PROTEIN_LABELS[p]}
        </button>
      ))}
    </div>
  );
}
