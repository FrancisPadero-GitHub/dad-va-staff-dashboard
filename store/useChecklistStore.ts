import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChecklistState {
  checkedItems: Record<string, boolean>;
  activeTab: string;
  lastAccessedDate: string;
  toggleItem: (id: string) => void;
  setActiveTab: (tabId: string) => void;
  resetTab: (tabId: string, itemIds: string[]) => void;
  checkAndResetDaily: () => void;
}

const getTodayDateString = () => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      checkedItems: {},
      activeTab: "morning",
      lastAccessedDate: getTodayDateString(),

      toggleItem: (id) =>
        set((state) => ({
          checkedItems: {
            ...state.checkedItems,
            [id]: !state.checkedItems[id],
          },
        })),

      setActiveTab: (tabId) => set({ activeTab: tabId }),

      resetTab: (tabId, itemIds) =>
        set((state) => {
          const newCheckedItems = { ...state.checkedItems };
          itemIds.forEach((id) => {
            delete newCheckedItems[id];
          });
          return { checkedItems: newCheckedItems };
        }),

      checkAndResetDaily: () => {
        const today = getTodayDateString();
        const lastDate = get().lastAccessedDate;
        
        if (today !== lastDate) {
          set({
            checkedItems: {},
            lastAccessedDate: today,
          });
        }
      },
    }),
    {
      name: "dad-checklist-storage",
    }
  )
);
