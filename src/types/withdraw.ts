export type TStatusResponse = "pending" | "processing" | "completed" | "failed";

export interface IWithdrawal {
  id: string;
  amount: number;
  destination: string;
  status: TStatusResponse;
}
