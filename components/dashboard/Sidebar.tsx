"use client"

import { useChecklistStore } from "@/store/useChecklistStore"
import checklistData from "@/data/checklist.json"
import { cn } from "@/lib/utils"
import {
  Sun,
  Moon,
  ClipboardList,
  Calculator,
  Calendar,
  AlertTriangle,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ICON_MAP: Record<string, React.ElementType> = {
  Sun,
  Moon,
  ClipboardList,
  Calculator,
  Calendar,
  AlertTriangle,
}

export function Sidebar() {
  const pathname = usePathname()
  const { activeTab, setActiveTab, checkedItems } = useChecklistStore()

  const getTabProgress = (tabId: string) => {
    const tab = checklistData.tabs.find((t) => t.id === tabId)
    if (!tab) return { total: 0, completed: 0, pct: 0 }

    let total = 0
    let completed = 0

    tab.groups.forEach((group) => {
      group.tasks.forEach((task) => {
        total++
        if (checkedItems[task.id]) {
          completed++
        }
      })
    })

    return {
      total,
      completed,
      pct: total === 0 ? 0 : Math.round((completed / total) * 100),
    }
  }

  return (
    <aside className="no-scrollbar flex w-16 shrink-0 flex-col overflow-y-auto border-r bg-card transition-all md:w-56">
      <div className="flex-1 px-2 py-4">
        <div className="mb-2 hidden px-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase md:block">
          Company
        </div>
        <Link
          href="/info"
          className={cn(
            "group relative mb-1 flex items-center gap-3 rounded-md px-2 py-2 text-left transition-all hover:bg-accent/50",
            pathname === "/info" && "border border-border bg-accent/80"
          )}
        >
          {pathname === "/info" && (
            <div className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <div
            className={cn(
              "flex w-6 shrink-0 items-center justify-center transition-colors md:w-6",
              pathname === "/info" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex hidden flex-1 flex-col overflow-hidden md:flex">
            <div
              className={cn(
                "truncate text-sm font-bold tracking-wide uppercase transition-colors",
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
            "group relative mb-4 flex items-center gap-3 rounded-md px-2 py-2 text-left transition-all hover:bg-accent/50",
            pathname === "/daily-calls" && "border border-border bg-accent/80"
          )}
        >
          {pathname === "/daily-calls" && (
            <div className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <div
            className={cn(
              "flex w-6 shrink-0 items-center justify-center transition-colors md:w-6",
              pathname === "/daily-calls"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="flex hidden flex-1 flex-col overflow-hidden md:flex">
            <div
              className={cn(
                "truncate text-sm font-bold tracking-wide uppercase transition-colors",
                pathname === "/daily-calls" ? "text-primary" : "text-foreground"
              )}
            >
              Daily Sheet
            </div>
          </div>
        </Link>
        <div className="mb-2 hidden border-t px-2 pt-4 text-[10px] font-medium tracking-widest text-muted-foreground uppercase md:block">
          Checklists
        </div>
        <div className="flex flex-col gap-1">
          {checklistData.tabs.map((tab) => {
            const Icon = ICON_MAP[tab.icon]
            const isTabActive = pathname === "/" && activeTab === tab.id
            const progress = getTabProgress(tab.id)

            return (
              <Link
                key={tab.id}
                href="/"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-2 py-2 text-left transition-all hover:bg-accent/50",
                  isTabActive && "border border-border bg-accent/80"
                )}
              >
                {isTabActive && (
                  <div className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}

                <div
                  className={cn(
                    "flex w-6 shrink-0 items-center justify-center transition-colors md:w-6",
                    isTabActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                </div>

                <div className="flex hidden flex-1 flex-col overflow-hidden md:flex">
                  <div
                    className={cn(
                      "truncate text-sm font-bold tracking-wide uppercase transition-colors",
                      isTabActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {tab.title}
                  </div>
                  <div className="mt-0.5 flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        isTabActive ? "bg-primary" : "bg-muted-foreground"
                      )}
                      style={{ width: `${progress.pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-auto hidden border-t p-3 md:block">
        <div className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Commission Rates
        </div>
        <div className="flex flex-col gap-1.5">
          {Object.entries(
            checklistData.commissionRates.reduce((acc, rate) => {
              const prop = rate.proprietor.replace(" - Proprietor", "");
              if (!acc[prop]) acc[prop] = [];
              acc[prop].push(rate);
              return acc;
            }, {} as Record<string, typeof checklistData.commissionRates>)
          ).map(([proprietor, rates], groupIndex) => (
            <div key={proprietor} className="flex flex-col gap-1.5">
              {groupIndex > 0 && <div className="my-1.5 h-px w-full bg-border/50" />}
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">{proprietor}</div>
              {rates.map((rate, i) => (
                <div key={i} className="flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground truncate mr-2" title={`${rate.name} (${rate.proprietor})`}>
                    {rate.name}
                  </span>
                  <span className="font-mono font-medium text-foreground shrink-0">{rate.commission}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="my-3 h-px w-full bg-border" />

        <div className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Net Formula
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Step 1</span>
            <span className="font-mono font-medium text-primary">
              Gross − Parts
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Step 2</span>
            <span className="font-mono font-medium text-primary">× Co %</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
