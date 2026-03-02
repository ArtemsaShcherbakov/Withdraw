"use client";

import { InputUI, CheckboxUI, Button } from "@/components/UI";
import { RequestForWithdraw, ErrorBanner } from "./components";

import { useWithdrawForm } from "./WithdrawForm.hooks";

const WithdrawForm = () => {
  const {
    amount,
    destination,
    confirmed,
    error,
    amountError,
    destinationError,
    isLoading,
    isSuccess,
    isDisabledButton,
    handleSubmit,
    handleBlur,
    handleAmountChange,
    handleDestinationChange,
    handleConfirmChange,
  } = useWithdrawForm();

  if (isSuccess) return <RequestForWithdraw />;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
      <ErrorBanner error={error} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputUI
          htmlFor="amount"
          labelText="Amount (USDT)"
          type="text"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          onBlur={() => handleBlur("amount")}
          disabled={isLoading}
          errorText={amountError}
          placeholder="0.00"
        />
        <InputUI
          htmlFor="destination"
          labelText="Destination"
          type="text"
          id="destination"
          value={destination}
          onChange={handleDestinationChange}
          onBlur={() => handleBlur("destination")}
          disabled={isLoading}
          errorText={destinationError}
          placeholder="Enter destination address"
        />
        <CheckboxUI
          id="confirm"
          htmlFor="confirm"
          checked={confirmed}
          onChange={handleConfirmChange}
          disabled={isLoading}
          labelText="I confirm that the destination address is correct"
        />
        <Button
          type="submit"
          loading={isLoading}
          disabled={isDisabledButton}
          text="Withdraw"
        />
      </form>
    </div>
  );
};

export { WithdrawForm };
