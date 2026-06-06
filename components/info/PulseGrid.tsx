import data from "@/data/company-info.json";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  ok: "bg-green-500",
  warn: "bg-amber-500",
  bad: "bg-destructive",
};

export function PulseGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] overflow-hidden rounded-lg border bg-border shadow-sm">
      {data.pulseGrid.map((item, i) => (
        <div key={i} className="flex flex-col bg-card p-4 md:p-5 transition-colors hover:bg-accent/10">
          <div className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            {item.label}
          </div>
          <div className="font-sans text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-foreground" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
            {item.value}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COLORS[item.status] || "bg-muted-foreground")} />
            {item.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
