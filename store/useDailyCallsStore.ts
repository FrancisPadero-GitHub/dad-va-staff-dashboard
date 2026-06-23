import { create } from "zustand";
import { DailyCall } from "@/components/daily-calls/DailyCallsTable";

interface DailyCallsState {
  selectedCall: DailyCall | null;
  isEditModalOpen: boolean;
  setSelectedCall: (call: DailyCall | null) => void;
  setEditModalOpen: (isOpen: boolean) => void;
}

export const useDailyCallsStore = create<DailyCallsState>((set) => ({
  selectedCall: null,
  isEditModalOpen: false,
  setSelectedCall: (call) => set({ selectedCall: call }),
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
}));
