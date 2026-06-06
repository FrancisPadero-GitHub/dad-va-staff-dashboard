import data from "@/data/company-info.json";
import { FileText, Shield, Award, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = {
  FileText,
  Shield,
  Award,
};

export function DocsGrid() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border-l-2 border-primary pl-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
          Documents on File
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.docs.map((doc, i) => {
          const Icon = ICONS[doc.icon] || FileText;
          return (
            <a 
              key={i} 
              href={doc.link} 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {doc.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {doc.meta}
                </span>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-[10px] font-medium text-primary pt-2">
                Open in Drive
                <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
