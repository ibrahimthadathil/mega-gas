"use client";

import React from "react";

import type { ReactElement } from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Edit2, ImageIcon, Trash2 } from "lucide-react";

import Image from "next/image";
import {
  add_expense,
  get_expenses,
} from "@/services/client_api-Service/user/user_api";
import { Expense } from "@/types/types";
import { toast } from "sonner";
import { UseRQ } from "@/hooks/useReactQuery";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

type ExpenseFormData = {
  type: Expense["expenses_type"];
  amount: string;
  image?: string;
};

const ExpenseSection = (): ReactElement => {
  const { data, isLoading } = UseRQ("expenses", get_expenses);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageSourceDialog, setIsImageSourceDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const cameraInputRef = React.createRef<HTMLInputElement>();
  const galleryInputRef = React.createRef<HTMLInputElement>();

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<ExpenseFormData>({
      defaultValues: {
        type: "Recharge",
        amount: "",
        image: undefined,
      },
    });

  const handleAddClick = () => {
    setEditingId(null);
    setImagePreview(null);
    reset();
    setIsDialogOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingId(expense.id);
    setValue("type", expense.expenses_type);
    setValue("amount", expense.amount.toString());
    setImagePreview(expense.image || null);
    setIsDialogOpen(true);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    setIsImageSourceDialog(false);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    setIsImageSourceDialog(false);
  };

  const onSubmit = async (form_data: ExpenseFormData) => {
    const expenseType = form_data.type;
    const price = Number.parseFloat(String(form_data.amount));

    if (!expenseType || !price) {
      return;
    }
    const newExpense = {
      id: Date.now().toString(),
      expenses_type: expenseType,
      amount: price,
      image: imagePreview || undefined,
      date: new Date().toISOString(),
    };
    try {
      const data = await add_expense(newExpense);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        toast.success(data.message);
        setIsDialogOpen(false);
        setImagePreview(null);
        reset();
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = (id: string) => {};

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="xl:text-3xl sm:text-lg font-bold">Expenses</h1>
        <Button onClick={handleAddClick}>Add Expense</Button>
      </div>
      {/* {Dialog section for add esxpense} */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Expense" : "Add Expense"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Expense Type</Label>
              <Select
                defaultValue={watch("type")}
                onValueChange={(value) =>
                  setValue("type", value as Expense["expenses_type"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expense type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recharge">Recharge</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Photo (Optional)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setIsImageSourceDialog(true)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
              </div>
              {imagePreview && (
                <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden border">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { required: true })}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Update Expense" : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageSourceDialog} onOpenChange={setIsImageSourceDialog}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Choose Photo Source</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-24 flex flex-col items-center justify-center bg-transparent"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-8 h-8 mb-2" />
              <span>Take Photo</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-24 flex flex-col items-center justify-center bg-transparent"
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImageIcon className="w-8 h-8 mb-2" />
              <span>Choose from Gallery</span>
            </Button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleGallerySelect}
            className="hidden"
          />
        </DialogContent>
      </Dialog>

      {/* {optional rendering if there is cards} */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="flex flex-col space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Skeleton className="h-[125px] w-full rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 sm:w-1/2 md:w-3/4" />
            </div>
          </div>
        ) : data ? (
          (data as Expense[]).map((expense: Expense) => (
            <Card
              key={expense.id}
              className={cn(
                "p-4 flex flex-col",
                "opacity-60 pointer-events-none"
              )}
            >
              {expense?.image && (
                <div className="mb-3 relative w-full h-32 rounded-md overflow-hidden border">
                  <Image
                    src={expense.image}
                    alt="Expense receipt"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mb-3 flex-1">
                <h3 className="font-bold text-lg mb-1">
                  {expense.expenses_type}
                </h3>
                <p className="text-lg font-semibold text-primary mb-1">
                  ₹{expense.amount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(expense?.created_time as string))}
                </p>
              </div>

              <div className="mb-3">
                <Badge
                  variant={"default"}
                  className={
                    !expense.settled
                      ? "bg-amber-300 text-black"
                      : "bg-green-400"
                  }
                >
                  {expense.settled ? " Settled " : " Pending "}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditClick("sds" as any)}
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete("")}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No expenses yet. Click Add Expense to get started.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExpenseSection;
