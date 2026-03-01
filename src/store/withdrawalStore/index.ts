import { create } from "zustand";
import { persist } from "zustand/middleware";

import { withdrawalService } from "@/services/withdrawalService";

import type { IWithdrawal } from "@/types/withdraw";
import type { IWithdrawalRequest, IWithdrawalState } from "./types";

export const useWithdrawalStore = create<IWithdrawalState>()(
  persist(
    (set, get) => ({
      currentWithdrawal: null,
      status: "idle",
      error: null,
      lastUpdated: null,

      createWithdrawal: async (data: IWithdrawalRequest) => {
        const state = get();

        // Prevent double submission
        if (state.status === "loading") return;

        set({ status: "loading", error: null });

        try {
          const response = await withdrawalService.createWithdrawal(data);

          const newWithdrawal: IWithdrawal = {
            id: response.id,
            amount: data.amount,
            destination: data.destination,
            status: "pending",
          };

          set({
            currentWithdrawal: newWithdrawal,
            status: "success",
            lastUpdated: Date.now(),
          });
        } catch (error) {
          set({
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Failed to create withdrawal",
          });

          throw error;
        }
      },

      fetchWithdrawal: async (id: string) => {
        set({ status: "loading", error: null });

        try {
          const withdrawal = await withdrawalService.getWithdrawal(id);

          set({
            status: "success",
            lastUpdated: Date.now(),
          });
        } catch (error) {
          set({
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch withdrawal",
          });
        }
      },

      resetState: () => {
        set({
          currentWithdrawal: null,
          status: "idle",
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "withdrawal-storage",
      partialize: (state) => ({
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
