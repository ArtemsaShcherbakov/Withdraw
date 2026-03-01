import { memo } from "react";

import { useWithdrawalStore } from "@/store/withdrawalStore";

import { createStatusColor } from "./RequestForWithdraw.utils";

const RequestForWithdrawComponent = () => {
  const { currentWithdrawal } = useWithdrawalStore();

  if (!currentWithdrawal) return null;

  const { amount, destination, status: statusWithdrawal } = currentWithdrawal;

  const statusClassName = createStatusColor(statusWithdrawal);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Recent Withdrawals</h3>
      <div className="space-y-2">
        <div className="p-3 bg-gray-50 rounded-md text-sm">
          <div className="flex justify-between">
            <span className="font-medium">{amount} USDT</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${statusClassName}`}
            >
              {statusWithdrawal}
            </span>
          </div>
          <p className="text-gray-600 truncate mt-1">{destination}</p>
        </div>
      </div>
    </div>
  );
};

export const RequestForWithdraw = memo(RequestForWithdrawComponent);
RequestForWithdraw.displayName = "RequestForWithdraw";
