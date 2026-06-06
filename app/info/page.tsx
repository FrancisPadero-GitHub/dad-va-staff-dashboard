import { HeroSection } from "@/components/info/HeroSection";
import { AlertBanner } from "@/components/info/AlertBanner";
import { PulseGrid } from "@/components/info/PulseGrid";
import { InfoTable } from "@/components/info/InfoTable";
import { DocsGrid } from "@/components/info/DocsGrid";
import { RenewalTracker } from "@/components/info/RenewalTracker";
import { LoginForm } from "@/components/info/LoginForm";
import data from "@/data/company-info.json";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cookies } from "next/headers";

export default async function InfoPage() {
  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get("info_auth")?.value === "unlocked";

  if (!isUnlocked) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-background">
          <HeroSection />
          
          <div className="mx-auto max-w-4xl p-4 md:p-8 animate-in fade-in duration-300">
            <AlertBanner />
            
            <div className="mt-6 mb-8">
              <PulseGrid />
            </div>

            <div className="flex flex-col gap-10">
              <InfoTable section={data.company} />
              
              <InfoTable section={data.license} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoTable section={data.insuranceGL} />
                <InfoTable section={data.insuranceWC} />
              </div>

              <InfoTable section={data.agent} />
              
              <InfoTable section={data.tax} />
              
              <DocsGrid />
              
              <RenewalTracker />
            </div>
            
            <div className="mt-12 border-t pt-6 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <span>Internal use only · Do not share externally</span>
              <span>Ducts All Done LLC · ductsalldone.com · 813-923-2906</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
