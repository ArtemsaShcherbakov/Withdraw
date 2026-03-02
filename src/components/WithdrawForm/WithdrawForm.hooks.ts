"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";

import { useWithdrawalStore } from "@/store/withdrawalStore";

import { validateAmount, validateDestination } from "@/utils";

type TField = "amount" | "destination";

interface TouchedState {
  amount: boolean;
  destination: boolean;
}

const INITIAL_TOUCHED: TouchedState = {
  amount: false,
  destination: false,
};

export const useWithdrawForm = () => {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState<TouchedState>(INITIAL_TOUCHED);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createWithdrawal, status, error } = useWithdrawalStore();

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const amountValid = validateAmount(amount);
  const destinationValid = validateDestination(destination);

  const amountError =
    touched.amount && !amountValid ? "Amount must be greater than 0" : "";

  const destinationError =
    touched.destination && !destinationValid ? "Destination is required" : "";

  const isFormValid = amountValid && destinationValid && confirmed;
  const isDisabledButton = !isFormValid || isLoading || isSubmitting;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (isDisabledButton) return;

    setIsSubmitting(true);

    try {
      await createWithdrawal({
        amount: parseFloat(amount),
        destination,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = useCallback((field: TField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAmount(e.target.value.trim()),
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

  useEffect(() => {
    if (isSuccess) {
      setAmount("");
      setDestination("");
      setConfirmed(false);
      setTouched(INITIAL_TOUCHED);
    }
  }, [isSuccess]);

  return {
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
  };
};
