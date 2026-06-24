"use client";

import { useChecklistStore } from "@/store/useChecklistStore";
import checklistData from "@/data/checklist.json";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export function Topbar() {
  const checkedItems = useChecklistStore((state) => state.checkedItems);
  const [dateStr, setDateStr] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateStr(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    let totalTasks = 0;
    let completedTasks = 0;

    checklistData.tabs.forEach((tab) => {
      tab.groups.forEach((group) => {
        group.tasks.forEach((task) => {
          totalTasks++;
          if (checkedItems[task.id]) {
            completedTasks++;
          }
        });
      });
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100));
  }, [checkedItems]);

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm overflow-hidden bg-white">
          <Image src="/ducts_all_done.webp" alt="Ducts All Done" width={40} height={40} className="object-contain w-auto h-auto" />
        </div>
        <div className="flex flex-col">
          <div className="text-xl font-extrabold tracking-wider text-primary uppercase leading-none" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
            Ducts All Done
          </div>
          <div className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase mt-0.5">
            Clean Air Begins With Clear Ducts
          </div>
        </div>
        <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>
        <span className="text-xs text-muted-foreground font-mono hidden sm:block">
          Office Staff Dashboard
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 shadow-sm">
          <div className="w-20 md:w-24">
            <Progress value={progress} className="h-1.5" />
          </div>
          <span className="min-w-[28px] text-xs font-mono text-muted-foreground font-medium">
            {progress}%
          </span>
        </div>
        <div className="hidden sm:block rounded-md border bg-muted/50 px-2.5 py-1 text-xs font-mono text-muted-foreground shadow-sm">
          {dateStr}
        </div>
      </div>
    </div>
  );
}
