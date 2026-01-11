import { create } from "zustand";

interface FilterState {
  mode: "day" | "week" | "month" | "year";
  selectedDate: Date;
  setMode: (mode: FilterState["mode"]) => void;
  setSelectedDate: (date: Date) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  mode: "day",
  selectedDate: new Date(),
  setMode: (mode) => set({ mode }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
