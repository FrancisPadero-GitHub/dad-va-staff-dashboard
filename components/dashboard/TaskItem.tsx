"use client";

import { useChecklistStore } from "@/store/useChecklistStore";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    subtext: string;
    urgency: string;
    badge: string;
  };
}

const URGENCY_STYLES: Record<string, string> = {
  urgent: "border-l-destructive",
  warn: "border-l-amber-500",
  info: "border-l-primary",
  ok: "border-l-green-500",
};

const BADGE_STYLES: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
  warn: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
  info: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  ok: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
};

export function TaskItem({ task }: TaskItemProps) {
  const { checkedItems, toggleItem } = useChecklistStore();
  const isChecked = !!checkedItems[task.id];

  return (
    <div
      onClick={() => toggleItem(task.id)}
      className={cn(
        "group flex items-start gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all cursor-pointer hover:border-primary/50 hover:bg-accent/20",
        !isChecked && `border-l-4 ${URGENCY_STYLES[task.urgency] || "border-l-transparent"}`,
        isChecked && "opacity-50"
      )}
    >
      <div className="mt-0.5 flex shrink-0 items-center justify-center">
        <Checkbox 
          checked={isChecked} 
          className={cn("h-5 w-5 rounded-md pointer-events-none", isChecked && "bg-green-500 border-green-500 text-white")}
        />
      </div>
      
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className={cn(
          "text-sm font-semibold leading-tight text-foreground transition-colors",
          isChecked && "line-through text-muted-foreground"
        )}>
          {task.title}
        </div>
        <div className="text-xs text-muted-foreground leading-snug">
          {task.subtext}
        </div>
      </div>
      
      <Badge 
        variant="outline" 
        className={cn(
          "shrink-0 font-mono text-[10px] uppercase tracking-wider",
          BADGE_STYLES[task.urgency] || "bg-muted text-muted-foreground"
        )}
      >
        {task.badge}
      </Badge>
    </div>
  );
}
