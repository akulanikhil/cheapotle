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
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selected === p
              ? "bg-[#3d1500] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {PROTEIN_LABELS[p]}
        </button>
      ))}
    </div>
  );
}
