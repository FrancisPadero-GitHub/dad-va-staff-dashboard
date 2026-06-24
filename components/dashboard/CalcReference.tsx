"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Data: derived directly from remote_schema_backup_6_24_2026.sql    */
/* ------------------------------------------------------------------ */



const CORE_FORMULAS: {
  label: string;
  formula: string;
  sqlExpr: string;
  example: string;
  note?: string;
}[] = [
  {
    label: "Gross Revenue (per job)",
    formula: "IF payment_status = 'full' → subtotal\nIF payment_status = 'partial' → deposits",
    sqlExpr: "CASE WHEN j.payment_status = 'full' THEN j.subtotal WHEN j.payment_status = 'partial' THEN j.deposits ELSE 0 END",
    example: "Full: $1,799 | Partial w/ $500 deposit: $500",
  },
  {
    label: "Parts Cost (per job)",
    formula: "IF payment_status = 'full' → parts_total_cost\nIF payment_status = 'partial' → 0",
    sqlExpr: "CASE WHEN j.payment_status = 'full' THEN j.parts_total_cost ELSE 0 END",
    example: "Full w/ $50 parts: $50 | Partial: $0",
    note: "Parts only counted on fully-paid jobs.",
  },
  {
    label: "Net After Parts",
    formula: "Gross − Parts Cost",
    sqlExpr: "subtotal − parts_total_cost  (only when full)",
    example: "$1,799 − $50 = $1,749",
  },
  {
    label: "Tech Commission",
    formula: "Net After Parts × (commission% / 100)",
    sqlExpr: "(j.subtotal − j.parts_total_cost) × (t.commission / 100.0)",
    example: "$1,749 × 50% = $874.50",
    note: "commission column stores the tech's percentage (e.g. 50 = tech keeps 50%).",
  },
  {
    label: "Company Net",
    formula: "Net After Parts × (1 − commission% / 100)",
    sqlExpr: "(j.subtotal − j.parts_total_cost) × (1.0 − t.commission / 100.0)",
    example: "$1,749 × 50% = $874.50 (company keeps the other half)",
  },
  {
    label: "Company Net Margin %",
    formula: "Σ Company Net / Σ Net After Parts × 100",
    sqlExpr: "SUM(company_net) / NULLIF(SUM(net_after_parts), 0)",
    example: "If all techs are 50%, margin = 50%",
  },
  {
    label: "Gross Tech Payout",
    formula: "Tech Commission + Tips + Reviews",
    sqlExpr: "SUM(calc_tech_pay) + SUM(tip_amount) + SUM(review_amount)",
    example: "$874.50 + $20 tip + $10 review = $904.50",
  },
  {
    label: "Net Tech Payout",
    formula: "Gross Tech Payout − Cash On Hand",
    sqlExpr: "gross_payout − cash_on_hand",
    example: "$904.50 − $300 cash = $604.50 owed",
    note: "Cash On Hand = physical cash the tech already collected and kept.",
  },
  {
    label: "Estimate Pipeline",
    formula: "Σ estimated_amount WHERE status = 'follow_up'",
    sqlExpr: "SUM(e.estimated_amount) WHERE e.status = 'follow_up'",
    example: "3 follow-up estimates of $2k, $3k, $1.5k → Pipeline $6,500",
  },
];

/* ------------------------------------------------------------------ */
/*  Collapsible section                                                */
/* ------------------------------------------------------------------ */
function Section({
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-primary/20 bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-primary">
            {title}
          </span>
          {badge && <Badge variant="secondary" className="text-[10px]">{badge}</Badge>}
        </span>
        <span className="text-muted-foreground text-xs select-none">{open ? "▼" : "▶"}</span>
      </button>
      {open && <div className="border-t border-primary/10 px-4 py-3">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CalcReference() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h2 className="border-l-2 border-primary pl-2 font-sans text-xs font-bold uppercase tracking-widest text-primary">
        Calculation Reference
      </h2>
      <p className="text-xs text-muted-foreground">
        Financial calculation formulas and critical rules derived from the live database schema.
      </p>

      {/* ── 1. Core Financial Formulas ── */}
      <Section title="Core Financial Formulas" badge={`${CORE_FORMULAS.length} formulas`} defaultOpen>
        <div className="flex flex-col gap-3">
          {CORE_FORMULAS.map((f, i) => (
            <div key={i} className="rounded-md border border-border/60 bg-muted/30 p-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">{f.label}</span>
                  <Badge variant="outline" className="text-[9px] shrink-0">{f.example}</Badge>
                </div>
                <p className="font-mono text-[11px] text-primary whitespace-pre-line">{f.formula}</p>
                <p className="font-mono text-[10px] text-muted-foreground break-all">
                  <span className="text-muted-foreground/70">SQL → </span>{f.sqlExpr}
                </p>
                {f.note && (
                  <p className="text-[10px] text-amber-500 dark:text-amber-400">⚠ {f.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 2. Important Rules ── */}
      <Section title="Critical Calculation Rules" badge="Must Know">
        <ul className="flex flex-col gap-2 text-[11px] text-foreground">
          <li className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5">
            <strong className="text-destructive">PARTIAL jobs:</strong> Only <code className="text-[10px] bg-muted px-1 rounded">deposits</code> count toward gross revenue. Parts, tips, tech commission, and company net are <strong>all zero</strong> until the job is marked <code className="text-[10px] bg-muted px-1 rounded">full</code>.
          </li>
          <li className="rounded-md bg-amber-500/10 border border-amber-500/20 p-2.5">
            <strong className="text-amber-500">Commission split:</strong> The <code className="text-[10px] bg-muted px-1 rounded">technicians.commission</code> column is the <strong>tech&apos;s</strong> percentage. Company % = 100 − commission. A value of <code className="text-[10px] bg-muted px-1 rounded">50</code> means 50/50 split.
          </li>
          <li className="rounded-md bg-primary/10 border border-primary/20 p-2.5">
            <strong className="text-primary">Soft deletes everywhere:</strong> All queries filter <code className="text-[10px] bg-muted px-1 rounded">deleted_at IS NULL</code> on work_orders, jobs, estimates, review_records, proprietors.
          </li>
          <li className="rounded-md bg-primary/10 border border-primary/20 p-2.5">
            <strong className="text-primary">Only &apos;done&apos; jobs:</strong> All financial RPCs filter <code className="text-[10px] bg-muted px-1 rounded">j.status = &apos;done&apos;</code>. Pending and cancelled jobs are excluded from revenue calculations.
          </li>
          <li className="rounded-md bg-primary/10 border border-primary/20 p-2.5">
            <strong className="text-primary">Tech display name:</strong> RPCs append the proprietor name in parentheses: <code className="text-[10px] bg-muted px-1 rounded">t.name || &apos; (&apos; || p.name || &apos;)&apos;</code> to differentiate techs with the same name under different proprietors.
          </li>
          <li className="rounded-md bg-primary/10 border border-primary/20 p-2.5">
            <strong className="text-primary">Payout formula:</strong> <code className="text-[10px] bg-muted px-1 rounded">net_pay = (tech_commission + tips + reviews) − cash_on_hand</code>. Cash on hand is subtracted because the tech already holds that money.
          </li>
        </ul>
      </Section>
    </div>
  );
}
