import data from "@/data/company-info.json";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  ok: "bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.15)]",
  warn: "bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]",
  bad: "bg-destructive shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
};

const TEXT_COLORS: Record<string, string> = {
  ok: "text-green-600",
  warn: "text-amber-600",
  bad: "text-destructive",
};

export function RenewalTracker() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border-l-2 border-primary pl-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
          Renewal Tracker
        </h2>
      </div>
      
      <div className="flex flex-col rounded-lg border bg-card overflow-hidden shadow-sm">
        {data.renewals.map((item, i) => (
          <div 
            key={i} 
            className={cn(
              "flex items-center justify-between p-4",
              i !== data.renewals.length - 1 && "border-b"
            )}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex w-6 justify-center shrink-0">
                <div className={cn("h-2.5 w-2.5 rounded-full", STATUS_COLORS[item.status])} />
              </div>
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {item.detail}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0">
              <span className={cn("font-mono text-xs font-semibold", TEXT_COLORS[item.status])}>
                {item.date}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {item.days}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
