"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TaskPanel } from "@/components/dashboard/TaskPanel";
import { useChecklistStore } from "@/store/useChecklistStore";

export default function Dashboard() {
  const checkAndResetDaily = useChecklistStore((state) => state.checkAndResetDaily);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <TaskPanel />
      </div>
    </div>
  );
}
