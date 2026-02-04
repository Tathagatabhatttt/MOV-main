import { create } from "zustand";

export const useLocationStore = create(set => ({
  pickup: null,
  drop: null,

  setPickup: pickup => set({ pickup }),
  setDrop: drop => set({ drop })
}));
