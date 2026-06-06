"use client";

import checklistData from "@/data/checklist.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function CommissionTable() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="border-l-2 border-primary pl-2 font-sans text-xs font-bold uppercase tracking-widest text-primary">
        Commission Rates — Verify Before Every Payout
      </h2>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">Tech / Team</TableHead>
              <TableHead className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">Split</TableHead>
              <TableHead className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">Co Net %</TableHead>
              <TableHead className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklistData.commissionRates.map((rate, i) => (
              <TableRow key={i} className={cn(rate.tech === "Tamir" && "bg-amber-500/5")}>
                <TableCell className="font-semibold text-foreground">{rate.tech}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{rate.split}</TableCell>
                <TableCell className="font-mono text-xs font-medium text-green-600">{rate.coNet}</TableCell>
                <TableCell className={cn("text-xs", rate.note.includes("⚠") ? "text-amber-600 font-medium" : rate.note.includes("NOT") ? "text-destructive font-medium" : "text-muted-foreground")}>
                  {rate.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
