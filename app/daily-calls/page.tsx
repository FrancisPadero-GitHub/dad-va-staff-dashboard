"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DailyCallsTable } from "@/components/daily-calls/DailyCallsTable";
import { DailyCallForm } from "@/components/daily-calls/DailyCallForm";
import { EditDailyCallForm } from "@/components/daily-calls/EditDailyCallForm";

export default function DailyCallsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full bg-muted/20">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Daily Sheet</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Log and monitor unique daily calls. Submit by 7:30 PM.
                </p>
              </div>
              <DailyCallForm onSuccess={handleSuccess} />
            </div>

            <DailyCallsTable refreshTrigger={refreshTrigger} />
            <EditDailyCallForm onSuccess={handleSuccess} />
          </div>
        </main>
      </div>
    </div>
  );
}
