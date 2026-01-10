export const adjustCashChest = (
  cashChest: Record<string, string|number>,
  isPaid: boolean
) => {
  if (!isPaid) return cashChest;

  const adjusted: Record<string, any> = {};

  for (const key in cashChest) {
    const value = cashChest[key];

    if (typeof value === "number" && value > 0) {
      adjusted[key] = -value;
    } else {
      adjusted[key] = value;
    }
  }

  return adjusted;
};
