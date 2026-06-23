"use client";

import { useChecklistStore } from "@/store/useChecklistStore";
import checklistData from "@/data/checklist.json";
import { cn } from "@/lib/utils";
import { Sun, Moon, ClipboardList, Calculator, Calendar, AlertTriangle, Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ICON_MAP: Record<string, React.ElementType> = {
  Sun,
  Moon,
  ClipboardList,
  Calculator,
  Calendar,
  AlertTriangle,
};

export function Sidebar() {
  const pathname = usePathname();
  const { activeTab, setActiveTab, checkedItems } = useChecklistStore();

  const getTabProgress = (tabId: string) => {
    const tab = checklistData.tabs.find((t) => t.id === tabId);
    if (!tab) return { total: 0, completed: 0, pct: 0 };

    let total = 0;
    let completed = 0;

    tab.groups.forEach((group) => {
      group.tasks.forEach((task) => {
        total++;
        if (checkedItems[task.id]) {
          completed++;
        }
      });
    });

    return {
      total,
      completed,
      pct: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  };

  return (
    <aside className="flex w-16 flex-col overflow-y-auto border-r bg-card md:w-56 shrink-0 transition-all">
      <div className="flex-1 px-2 py-4">
        <div className="mb-2 px-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase hidden md:block">
          Company
        </div>
        <Link
          href="/info"
          className={cn(
            "group relative flex items-center gap-3 rounded-md px-2 py-2 text-left transition-all hover:bg-accent/50 mb-1",
            pathname === "/info" && "bg-accent/80 border-border border"
          )}
        >
          {pathname === "/info" && (
            <div className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-primary" />
          )}
          <div className={cn("flex w-6 shrink-0 items-center justify-center transition-colors md:w-6", pathname === "/info" ? "text-primary" : "text-muted-foreground")}>
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden hidden md:flex">
            <div
              className={cn(
                "truncate text-sm font-bold uppercase tracking-wide transition-colors",
                pathname === "/info" ? "text-primary" : "text-foreground"
              )}
            >
              Overview Info
            </div>
          </div>
        </Link>
        <Link
          href="/daily-calls"
          className={cn(
            "group relative flex items-center gap-3 rounded-md px-2 py-2 text-left transition-all hover:bg-accent/50 mb-4",
            pathname === "/daily-calls" && "bg-accent/80 border-border border"
          )}
        >
          {pathname === "/daily-calls" && (
            <div className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-primary" />
          )}
          <div className={cn("flex w-6 shrink-0 items-center justify-center transition-colors md:w-6", pathname === "/daily-calls" ? "text-primary" : "text-muted-foreground")}>
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden hidden md:flex">
            <div
              className={cn(
                "truncate text-sm font-bold uppercase tracking-wide transition-colors",
                pathname === "/daily-calls" ? "text-primary" : "text-foreground"
              )}
            >
              Daily Sheet
            </div>
          </div>
        </Link>
        <div className="mb-2 px-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase hidden md:block border-t pt-4">
          Checklists
        </div>
        <div className="flex flex-col gap-1">
          {checklistData.tabs.map((tab) => {
            const Icon = ICON_MAP[tab.icon];
            const isTabActive = pathname === "/" && activeTab === tab.id;
            const progress = getTabProgress(tab.id);

              return (
                <Link
                  key={tab.id}
                  href="/"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-2 py-2 text-left transition-all hover:bg-accent/50",
                    isTabActive && "bg-accent/80 border-border border"
                  )}
                >
                  {isTabActive && (
                  <div className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-primary" />
                  )}
                
                <div className={cn("flex w-6 shrink-0 items-center justify-center transition-colors md:w-6", isTabActive ? "text-primary" : "text-muted-foreground")}>
                  {Icon && <Icon className="h-4 w-4" />}
                </div>
                
                <div className="flex flex-1 flex-col overflow-hidden hidden md:flex">
                  <div
                    className={cn(
                      "truncate text-sm font-bold uppercase tracking-wide transition-colors",
                      isTabActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {tab.title}
                  </div>
                  <div className="mt-0.5 text-[10px] font-mono text-muted-foreground flex justify-between">
                    <span>{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={cn("h-full transition-all duration-300", isTabActive ? "bg-primary" : "bg-muted-foreground")}
                      style={{ width: `${progress.pct}%` }}
                    />
                  </div>
                </div>
                </Link>
              );
          })}
        </div>
      </div>

      <div className="mt-auto border-t p-3 hidden md:block">
        <div className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Commission Rates
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-muted-foreground">Sub/3Bros</span>
            <span className="font-mono text-foreground font-medium">50/50</span>
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-muted-foreground">Aviran</span>
            <span className="font-mono text-foreground font-medium">60% co</span>
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-muted-foreground">Tamir</span>
            <span className="font-mono text-amber-500 font-medium">75% co ⚠</span>
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-muted-foreground">Shalom</span>
            <span className="font-mono text-foreground font-medium">75% co</span>
          </div>
        </div>
        
        <div className="my-3 h-px w-full bg-border" />
        
        <div className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Net Formula
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-muted-foreground">Step 1</span>
            <span className="font-mono text-primary font-medium">Gross − Parts</span>
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-muted-foreground">Step 2</span>
            <span className="font-mono text-primary font-medium">× Co %</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
