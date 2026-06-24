"use client";

import { Fragment } from "react";
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
import { ChevronsUpDown } from "lucide-react";

export function CommissionTable() {
  const getProprietorColor = (proprietor: string) => {
    switch (proprietor) {
      case "Ducts All Done":
        return { border: "border-l-[#7b42f6]", badge: "bg-[#7b42f6]/10 text-[#7b42f6]" };
      case "3 BROS - Proprietor":
        return { border: "border-l-[#10b981]", badge: "bg-[#10b981]/10 text-[#10b981]" };
      case "Sub - Proprietor":
        return { border: "border-l-[#3b82f6]", badge: "bg-[#3b82f6]/10 text-[#3b82f6]" };
      default:
        return { border: "border-l-gray-500", badge: "bg-gray-500/10 text-gray-400" };
    }
  };

  const getInitials = (name: string) => {
    if (name === "3 Bros") return "3B";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border bg-[#1a1c23] overflow-hidden">
        <Table>
          <TableHeader className="border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-sans text-[11px] font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 cursor-pointer">
                  NAME <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="font-sans text-[11px] font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 cursor-pointer">
                  COMMISSION <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="font-sans text-[11px] font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 cursor-pointer">
                  PROPRIETOR <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(
              checklistData.commissionRates.reduce((acc, rate) => {
                const prop = rate.proprietor.replace(" - Proprietor", "");
                if (!acc[prop]) acc[prop] = [];
                acc[prop].push(rate);
                return acc;
              }, {} as Record<string, typeof checklistData.commissionRates>)
            ).map(([proprietor, rates], groupIndex) => (
              <Fragment key={proprietor}>
                <TableRow className="hover:bg-transparent border-y border-white/10 bg-white/[0.02]">
                  <TableCell colSpan={3} className="py-2 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {proprietor}
                  </TableCell>
                </TableRow>
                {rates.map((rate, i) => {
                  const { border, badge } = getProprietorColor(rate.proprietor);
                  return (
                    <TableRow 
                      key={`${proprietor}-${i}`} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <TableCell className="p-0">
                        <div className={cn("flex items-center gap-3 py-3 px-4 border-l-4", border)}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-foreground border border-white/10">
                            {getInitials(rate.name)}
                          </div>
                          <span className="font-medium text-sm text-foreground">{rate.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {rate.commission}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", badge)}>
                          {rate.proprietor}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
