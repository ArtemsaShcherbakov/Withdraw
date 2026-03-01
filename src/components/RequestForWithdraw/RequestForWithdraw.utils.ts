import { TStatusResponse } from "@/types/withdraw";

export const createStatusColor = (statusWithdrawal: TStatusResponse) => {
  if (statusWithdrawal === "completed") return "bg-green-100 text-green-700";

  if (statusWithdrawal === "failed") return "bg-red-100 text-red-700";

  return "bg-yellow-100 text-yellow-700";
};
