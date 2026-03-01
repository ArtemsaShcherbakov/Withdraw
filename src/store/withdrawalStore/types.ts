import type { IWithdrawal } from "@/types/withdraw";

export type WithdrawalStatus = "idle" | "loading" | "success" | "error";

export interface IWithdrawalRequest {
  amount: number;
  destination: string;
}

export interface IWithdrawalState {
  // State
  currentWithdrawal: IWithdrawal | null;
  status: WithdrawalStatus;
  error: string | null;
  lastUpdated: number | null;

  // Actions
  createWithdrawal: (data: IWithdrawalRequest) => Promise<void>;
  fetchWithdrawal: (id: string) => Promise<void>;
  resetState: () => void;
  clearError: () => void;
}

export interface IValidationErrors {
  amount?: string;
  destination?: string;
  confirm?: string;
}
