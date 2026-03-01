"use client";

import { useMemo, useState, useEffect, useCallback, memo } from "react";

import { RequestForWithdraw } from "@/components/RequestForWithdraw";
import { InputUI, CheckboxUI, Button } from "@/components/UI";

import { useWithdrawalStore } from "@/store/withdrawalStore";

import { validateAmount, validateDestination } from "@/utils";

const TOCHED_INIT_STATE = {
  amount: false,
  destination: false,
};

interface ITouched {
  amount: boolean;
  destination: boolean;
}

const WithdrawFormComponent = () => {
  const [amount, setAmount] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [touched, setTouched] = useState<ITouched>(TOCHED_INIT_STATE);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createWithdrawal, status, error } = useWithdrawalStore();

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const amountValidation = useMemo(() => validateAmount(amount), [amount]);
  const destinationValidation = useMemo(
    () => validateDestination(destination),
    [destination],
  );

  const amountError = useMemo(
    () =>
      touched.amount && !amountValidation
        ? "Amount must be greater than 0"
        : "",
    [touched.amount, amountValidation],
  );
  const destinationError = useMemo(
    () =>
      touched.destination && !destinationValidation
        ? "Destination is required"
        : "",
    [touched.destination, destinationValidation],
  );
  const isFormValid = useMemo(
    () => amountValidation && destinationValidation && confirmed,
    [amountValidation, destinationValidation, confirmed],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || isLoading || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createWithdrawal({
        amount: parseFloat(amount),
        destination,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setAmount("");
      setDestination("");
      setConfirmed(false);
      setTouched({ amount: false, destination: false });
    }
  }, [isSuccess]);

  const handleBlur = useCallback(
    (field: "amount" | "destination") =>
      setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setAmount(event.target.value.trim()),
    [],
  );

  const handleDestinationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setDestination(e.target.value.trim()),
    [],
  );

  const handleConfirmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setConfirmed(e.target.checked),
    [],
  );

  return !isSuccess ? (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
      {error && (
        <div
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
          role="alert"
          data-testid="error-message"
        >
          {error}
        </div>
      )}
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
          aria-describedby="amount"
        />
        <InputUI
          htmlFor="destination"
          labelText="Destination"
          type="text"
          id="destination"
          errorText={destinationError}
          value={destination}
          onChange={handleDestinationChange}
          onBlur={() => handleBlur("destination")}
          disabled={isLoading}
          placeholder="Enter destination address"
          ariaDescribedby="destination"
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
          disabled={!isFormValid || isLoading}
          text="Withdraw"
        />
      </form>
    </div>
  ) : (
    <RequestForWithdraw />
  );
};

export const WithdrawForm = memo(WithdrawFormComponent);
WithdrawForm.displayName = "WithdrawForm";
