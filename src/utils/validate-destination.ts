export const validateDestination = (destination: string): boolean => {
  if (!destination || destination === "") return false;

  return destination.trim().length > 0;
};
