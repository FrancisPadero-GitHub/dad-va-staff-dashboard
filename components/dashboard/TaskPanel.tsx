"use client";

import { useChecklistStore } from "@/store/useChecklistStore";
import checklistData from "@/data/checklist.json";
import { TaskItem } from "./TaskItem";
import { CommissionTable } from "./CommissionTable";
import { CalcReference } from "./CalcReference";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RotateCcw } from "lucide-react";

export function TaskPanel() {
  const { activeTab, checkedItems, resetTab } = useChecklistStore();
  
  const tabData = checklistData.tabs.find((t) => t.id === activeTab);
  
  if (!tabData) return null;

  let totalTasks = 0;
  let completedTasks = 0;
  const tabTaskIds: string[] = [];

  tabData.groups.forEach((group) => {
    group.tasks.forEach((task) => {
      totalTasks++;
      tabTaskIds.push(task.id);
      if (checkedItems[task.id]) {
        completedTasks++;
      }
    });
  });

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 animate-in fade-in duration-300">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-primary/10 text-primary shadow-sm">
              <span className="text-2xl">{tabData.icon === "Sun" ? "☀️" : tabData.icon === "Moon" ? "🌙" : tabData.icon === "ClipboardList" ? "📋" : tabData.icon === "Calculator" ? "🧮" : tabData.icon === "Calendar" ? "📅" : "🚨"}</span>
            </div>
            <div>
              <h1 className="font-sans text-2xl font-extrabold uppercase tracking-tight text-foreground">
                {tabData.title}
              </h1>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                {completedTasks} of {totalTasks} complete
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="font-mono text-xs uppercase tracking-wider"
            onClick={() => resetTab(activeTab, tabTaskIds)}
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            Reset
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8 overflow-hidden rounded-full bg-secondary">
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Content depending on tab */}
        {activeTab === "klicktiv" && (
          <div className="mb-8">
            <CommissionTable />
          </div>
        )}

        {activeTab === "calc" && (
          <div className="mb-8">
            <CalcReference />
          </div>
        )}

        {/* Groups */}
        <div className="flex flex-col gap-8">
          {tabData.groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-3">
              <h2 className="border-l-2 border-primary pl-2 font-sans text-xs font-bold uppercase tracking-widest text-primary">
                {group.title}
              </h2>
              <div className="flex flex-col gap-2">
                {group.tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="h-12" /> {/* Bottom padding */}
      </div>
    </div>
  );
}
