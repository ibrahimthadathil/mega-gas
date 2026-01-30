import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema for Sale item
const saleSchema = z.object({
  id: z.string(),
  productId: z.string().min(1, "Product must be selected"),
  productName: z.string(),
  rate: z.number().positive("Rate must be positive"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  isComposite: z.boolean(),
  customerId: z.string().optional(),
  components: z
    .array(
      z.object({
        qty: z.number(),
        sale_price: z.number().optional(),
        child_product_id: z.string(),
      }),
    )
    .nullable()
    .optional(),
});

// Schema for Transaction
const transactionSchema = z.object({
  "account id": z.string(),
  "account name": z.string().optional(),
  "amount paid": z.number().min(0),
  "amount received": z.number().min(0),
  remark: z.string(),
});

// Schema for UPI Payment
const upiPaymentSchema = z.object({
  "UPI Id": z.string().min(1, "UPI ID is required when UPI payment is added"),
  amount: z.number().positive("Amount must be greater than 0"),
});

// Schema for Online Payment
const onlinePaymentSchema = z.object({
  "consumer no": z
    .string()
    .min(1, "Consumer number is required when online payment is added"),
  amount: z.number().positive("Amount must be greater than 0"),
});

// Main form schema - FIXED: Remove z.coerce to avoid type mismatch
export const deliveryReportSchema = z
  .object({
    date: z.date({
      error: "Please select a valid date",
    }),
    vehicleId: z.string().min(1, "Vehicle selection is required"),
    deliveryBoys: z
      .array(z.string())
      .min(1, "At least one delivery boy must be selected"),
    sales: z
      .array(saleSchema)
      .min(1, "At least one sale must be added")
      .refine((sales) => sales.every((sale) => sale.quantity > 0), {
        message: "All sales must have quantity greater than 0",
      }),
    expenses: z
      .array(
        z.object({
          id: z.string(),
          expenses_type: z.string(),
          amount: z.number(),
          description: z.string().optional(),
        }),
      )
      .optional(),
    salesTransactions: z.array(transactionSchema),
    upiPayments: z.array(upiPaymentSchema),
    onlinePayments: z.array(onlinePaymentSchema),
    chestName: z.enum(["office", "godown"], {
      message: "Chest name is required",
    }),
    currencyDenominations: z.record(z.string(), z.number().min(0)),
    reportRemark: z.string(),
    status: z.enum(["Submitted", "Settled"]).optional(),
  })
  .superRefine((data, ctx) => {
    // Validate UPI payments - if QR code is selected, UPI ID must be entered
    data.upiPayments.forEach((payment, index) => {
      if (payment.amount > 0 && !payment["UPI Id"]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "UPI ID is required when amount is entered",
          path: ["upiPayments", index, "UPI Id"],
        });
      }
    });

    // Validate Online payments - if selected, consumer number must be entered
    data.onlinePayments.forEach((payment, index) => {
      if (payment.amount > 0 && !payment["consumer no"]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Consumer number is required when amount is entered",
          path: ["onlinePayments", index, "consumer no"],
        });
      }
    });
  });

// Validation function with calculated values
export const validateDeliveryReportWithCalculations = (
  data: z.infer<typeof deliveryReportSchema>,
  calculations: {
    expectedCashInHand: number;
    actualCashCounted: number;
    cashMismatch: number;
  },
) => {
  const errors: string[] = [];

  // Check cash mismatch (requirement 7)
  if (calculations.cashMismatch !== 0) {
    errors.push(
      `Cash mismatch is ₹${calculations.cashMismatch.toFixed(2)}. Cash must tally exactly.`,
    );
  }

  // Check difference between total cash and net sales (requirement 8)
  const difference = Math.abs(
    calculations.actualCashCounted - calculations.expectedCashInHand,
  );
  if (difference !== 0) {
    errors.push(
      `Difference between counted cash (₹${calculations.actualCashCounted.toFixed(
        2,
      )}) and expected cash (₹${calculations.expectedCashInHand.toFixed(
        2,
      )}) must be 0.`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Type exports
export type DeliveryReportFormData = z.infer<typeof deliveryReportSchema>;

export const onError = (errors: FieldErrors<DeliveryReportFormData | any>) => {
  Object.values(errors).forEach((error) => {
    if (error?.message) {
      toast.error(error.message as string);
    }
  });
};
