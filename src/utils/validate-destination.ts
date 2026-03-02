// destination: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
export const validateDestination = (destination: string): boolean => {
  if (!destination) return false;

  return /^0x[a-fA-F0-9]{40}$/.test(destination);
};
