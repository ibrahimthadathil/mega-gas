"use client";

import { Card } from "@/components/ui/card";

interface CurrencyDenominationsSectionProps {
  denominations: Record<string, number> | any;
  onChange: (denominations: Record<string, number> | any) => void;
  netSales: number;
}

export default function CurrencyDenominationsSection({
  denominations = {},
  onChange,
  netSales,
}: CurrencyDenominationsSectionProps | any) {
  const denomList = ["500", "200", "100", "50", "20", "10"];

  const denominationDetails = denomList.map((denom) => {
    const count = denominations?.[denom] || 0;
    const amount = Number.parseInt(denom) * count;
    return { denom, count, amount };
  });

  const totalCurrency = denominationDetails.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const mismatch = totalCurrency !== netSales;
  const mismatchAmount = totalCurrency - netSales;

  const handleDecrement = (denom: string) => {
    const current = denominations[denom] || 0;
    if (current > 0) {
      onChange({
        ...denominations,
        [denom]: current - 1,
      });
    }
  };

  const handleIncrement = (denom: string) => {
    const current = denominations[denom] || 0;
    onChange({
      ...denominations,
      [denom]: current + 1,
    });
  };

  const handleChange = (denom: string, value: number) => {
    onChange({
      ...denominations,
      [denom]: value,
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Cash Denominations
      </h2>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-3 py-2 text-left font-medium text-xs md:px-4 md:py-3">
                Currency
              </th>
              <th className="px-2 py-2 text-center font-medium text-xs md:px-4 md:py-3">
                Qty
              </th>
              <th className="px-3 py-2 text-right font-medium text-xs md:px-4 md:py-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {denominationDetails.map((item) => (
              <tr
                key={item?.denom}
                className="border-b border-border hover:bg-muted/50"
              >
                <td className="px-3 py-2 font-medium md:px-4 md:py-3">
                  ₹{item?.denom}
                </td>
                <td className="px-2 py-2 md:px-4 md:py-3">
                  <div className="flex items-center gap-1 md:gap-2 justify-center">
                    <button
                      onClick={() => handleDecrement(item?.denom)}
                      className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded border border-input hover:bg-muted text-sm font-medium"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item?.count}
                      onChange={(e) =>
                        handleChange(
                          item?.denom,
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 md:w-16 bg-transparent text-center outline-none text-sm font-medium border border-input rounded py-1"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <button
                      onClick={() => handleIncrement(item?.denom)}
                      className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded border border-input hover:bg-muted text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2 text-right font-semibold md:px-4 md:py-3">
                  {" "}
                  ₹{Number(item?.amount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card
        className={`p-4 ${
          mismatch ? "bg-red-50 border-red-200" : "bg-primary/10"
        }`}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Cash</span>
            <span
              className={`text-2xl font-bold ${
                mismatch ? "text-red-600" : "text-primary"
              }`}
            >
              ₹{Number(totalCurrency || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Expected (Net Sales)
            </span>
            <span className="text-sm font-medium">
              ₹{Number(netSales || 0).toLocaleString()}
            </span>
          </div>
          {mismatch && (
            <div className="flex justify-between items-center pt-2 border-t border-red-200">
              <span className="text-sm font-medium text-red-600">Mismatch</span>
              <span
                className={`text-lg font-bold ${
                  mismatchAmount > 0 ? "text-red-600" : "text-red-600"
                }`}
              >
                {mismatchAmount > 0 ? "+" : ""}₹
                {Number(mismatchAmount || 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
