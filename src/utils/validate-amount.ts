export const validateAmount = (amount: string | number): boolean => {
  if (typeof amount === "string") {
    if (amount === "" || amount === ".") return false;

    const num = parseFloat(amount);

    return !isNaN(num) && num > 0 && /^\d*\.?\d*$/.test(amount);
  }

  return amount > 0;
};
