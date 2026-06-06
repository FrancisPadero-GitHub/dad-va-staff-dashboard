import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InfoTableProps {
  section: {
    title: string;
    subtitle?: string;
    badge?: {
      text: string;
      status: string;
    };
    data: {
      label: string;
      value: string;
      mono?: boolean;
      italic?: boolean;
      link?: string;
      status?: string;
    }[];
  };
}

const BADGE_STYLES: Record<string, string> = {
  ok: "bg-green-500/10 text-green-600 border-green-500/20",
  warn: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  bad: "bg-destructive/10 text-destructive border-destructive/20",
};

const TEXT_STYLES: Record<string, string> = {
  ok: "text-green-600 font-medium",
  warn: "text-amber-600 font-medium",
  bad: "text-destructive font-medium",
};

export function InfoTable({ section }: InfoTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border-l-2 border-primary pl-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
          {section.title}
        </h2>
      </div>
      
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        {(section.subtitle || section.badge) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/20 px-4 py-3">
            {section.subtitle && (
              <span className="text-xs font-medium text-foreground">{section.subtitle}</span>
            )}
            {section.badge && (
              <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", BADGE_STYLES[section.badge.status])}>
                {section.badge.text}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex flex-col">
          {section.data.map((row, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col md:flex-row md:items-start gap-1 md:gap-4 px-4 py-2.5",
                i !== section.data.length - 1 && "border-b"
              )}
            >
              <div className="w-full md:w-[40%] shrink-0 text-xs text-muted-foreground">
                {row.label}
              </div>
              <div className={cn(
                "flex-1 text-sm md:text-right break-words",
                row.mono ? "font-mono text-xs text-primary font-medium" : "text-foreground",
                row.italic && "italic text-muted-foreground text-xs",
                row.status && TEXT_STYLES[row.status]
              )}>
                {row.link ? (
                  <a href={row.link} target={row.link.startsWith("http") ? "_blank" : undefined} className="text-primary hover:underline font-medium">
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
