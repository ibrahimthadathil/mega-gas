"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Plus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// Denominations configuration
const denominations = [
  { label: "₹500", value: 500, key: "note_500" },
  { label: "₹200", value: 200, key: "note_200" },
  { label: "₹100", value: 100, key: "note_100" },
  { label: "₹50", value: 50, key: "note_50" },
  { label: "₹10", value: 10, key: "note_10" },
] as const;

// Zod Schema
const cashAdjustmentSchema = z
  .object({
    note_500: z.number().int("Must be a whole number"),
    note_200: z.number().int("Must be a whole number"),
    note_100: z.number().int("Must be a whole number"),
    note_50: z.number().int("Must be a whole number"),
    note_10: z.number().int("Must be a whole number"),
    // remarks: z.string().min(3, "Remarks must be at least 3 characters"),
  })
  .refine(
    (data) => {
      const total =
        data.note_500 * 500 +
        data.note_200 * 200 +
        data.note_100 * 100 +
        data.note_50 * 50 +
        data.note_10 * 10;
      return total === 0;
    },
    {
      message: "Total amount must be zero. Use negative values to balance.",
      path: ["totalAmount"],
    },
  );

export type CashAdjustmentForm = z.infer<typeof cashAdjustmentSchema>;

interface CashAdjustmentDialogProps {
  onSubmit?: (data: CashAdjustmentForm) => void;
}

const CashAdjustmentDialog = ({ onSubmit }: CashAdjustmentDialogProps) => {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CashAdjustmentForm>({
    resolver: zodResolver(cashAdjustmentSchema),
    defaultValues: {
      note_500: 0,
      note_200: 0,
      note_100: 0,
      note_50: 0,
      note_10: 0,
      //   remarks: "",
    },
  });

  // Watch all denomination values
  const watchedValues = watch();

  // Calculate totals
  const calculateTotal = () => {
    return (
      (watchedValues.note_500 || 0) * 500 +
      (watchedValues.note_200 || 0) * 200 +
      (watchedValues.note_100 || 0) * 100 +
      (watchedValues.note_50 || 0) * 50 +
      (watchedValues.note_10 || 0) * 10
    );
  };

  const totalAmount = calculateTotal();
  const isBalanced = totalAmount === 0;

  const handleFormSubmit = (data: CashAdjustmentForm) => {
    if (onSubmit) {
      onSubmit(data);
    }
    setOpen(false);
    reset();
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-100 border hover:bg-gray-50 text-slate-700">
          <Plus className="w-4 h-4 mr-2" />
          Adjust Cash
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Cash Adjustment Entry
          </DialogTitle>
          <DialogDescription>
            Enter the count for each denomination. Use negative values to
            balance (e.g., -1 for ₹500 and +5 for ₹100).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Denominations Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Denomination
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    Count
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {denominations.map((denom) => {
                  const count = watchedValues[denom.key] || 0;
                  const amount = count * denom.value;

                  return (
                    <tr key={denom.key} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {denom.label}
                      </td>
                      <td className="px-4 py-3">
                        <Controller
                          name={denom.key}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              className={`w-32 mx-auto text-center ${
                                errors[denom.key] ? "border-red-500" : ""
                              }`}
                              placeholder="0"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? 0 : parseInt(value),
                                );
                              }}
                            />
                          )}
                        />
                        {errors[denom.key] && (
                          <p className="text-xs text-red-500 text-center mt-1">
                            {errors[denom.key]?.message}
                          </p>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          amount > 0
                            ? "text-green-600"
                            : amount < 0
                              ? "text-red-600"
                              : "text-slate-500"
                        }`}
                      >
                        {formatCurrency(amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Total Footer */}
              <tfoot className="bg-slate-900 text-white">
                <tr>
                  <td className="px-4 py-3 font-bold">Total</td>
                  <td className="px-4 py-3 text-center font-bold">
                    {Object.values(watchedValues)
                      .filter((v) => typeof v === "number")
                      .reduce((acc: number, curr) => acc + (curr as number), 0)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-bold text-lg ${
                      isBalanced
                        ? "text-green-400"
                        : "text-yellow-400 animate-pulse"
                    }`}
                  >
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Balance Status Alert */}
          {!isBalanced && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800">
                  Total must equal ₹0
                </p>
                <p className="text-yellow-700">
                  Current total: {formatCurrency(totalAmount)}. Use negative
                  values to balance the adjustment.
                </p>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {(errors as any).totalAmount && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">
                {(errors as any).totalAmount.message}
              </p>
            </div>
          )}

          {/* Remarks */}
          {/* <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Remarks <span className="text-red-500">*</span>
            </label>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter reason for adjustment (e.g., Cash count discrepancy, Denomination exchange)"
                  className={`min-h-[80px] ${
                    errors.remarks ? "border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.remarks && (
              <p className="text-xs text-red-500">{errors.remarks.message}</p>
            )}
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isBalanced}
              className="px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Submit Adjustment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CashAdjustmentDialog;
