import Image from "next/image";
import data from "@/data/company-info.json";

export function HeroSection() {
  return (
    <div className="border-b bg-card px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden border">
            <Image src="/ducts_all_done.webp" alt="Logo" width={56} height={56} className="object-contain w-auto h-auto" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold uppercase leading-none tracking-wider text-primary" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              {data.hero.name}
            </h1>
            <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground">
              {data.hero.subtitle} &nbsp;·&nbsp; {data.hero.location}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end">
          <div className="mb-2 flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium tracking-wide text-green-600">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            {data.hero.status}
          </div>
          <div className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line text-left md:text-right">
            {data.hero.address}
          </div>
        </div>
      </div>
    </div>
  );
}
