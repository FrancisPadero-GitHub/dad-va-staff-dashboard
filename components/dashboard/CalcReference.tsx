"use client";

import checklistData from "@/data/checklist.json";

export function CalcReference() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="border-l-2 border-primary pl-2 font-sans text-xs font-bold uppercase tracking-widest text-primary">
        Step-By-Step Formula
      </h2>
      <div className="rounded-lg border border-primary/20 bg-card p-4 shadow-sm">
        <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-widest text-primary">
          How to calculate company net for any job
        </h3>
        <div className="flex flex-col gap-3">
          {checklistData.formulas.map((formula, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="min-w-[100px] font-mono text-[10px] text-muted-foreground">
                {formula.step}
              </span>
              <span className="flex-1 font-mono text-xs text-foreground font-medium">
                {formula.equation}
              </span>
              <span className="inline-block whitespace-nowrap rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary self-start sm:self-auto">
                {formula.example}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
