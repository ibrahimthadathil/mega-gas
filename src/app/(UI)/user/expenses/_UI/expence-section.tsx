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
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Camera, ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { add_expense } from "@/services/client_api-Service/user/user_api";
import { Expense } from "@/types/types";
import { toast } from "sonner";

type ExpenseFormData = {
  type: Expense["type"];
  amount: string;
  image?: string;
};

const ExpenseSection = (): ReactElement => {
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
    setValue("type", expense.type);
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
      type: expenseType,
      amount: price,
      image: imagePreview || undefined,
      date: new Date().toISOString(),
    };
    try {
      const data = await add_expense(newExpense);
      if (data.success) {
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
                  setValue("type", value as Expense["type"])
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

      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No expenses yet. Click Add Expense to get started.
        </p>
      </Card>
      {/* {optional rendering if there is cards} */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map((expense) => (
            <Card
              key={expense.id}
              className={cn("p-4 flex flex-col", expense.settled && "opacity-60 pointer-events-none")}
            >
              {expense.image && (
                <div className="mb-3 relative w-full h-32 rounded-md overflow-hidden border">
                  <Image
                    src={expense.image || "/placeholder.svg"}
                    alt="Expense receipt"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mb-3 flex-1">
                <h3 className="font-bold text-lg mb-1">{expense.type}</h3>
                <p className="text-lg font-semibold text-primary mb-1">₹{expense.amount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(new Date(expense.date))}</p>
              </div>

              <div className="mb-3">
                <Badge
                  variant={expense.settled ? "secondary" : "default"}
                  className={expense.settled ? "bg-muted text-muted-foreground" : ""}
                >
                  {expense.settled ? "Settled" : "Pending"}
                </Badge>
              </div>

              {!expense.settled && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditClick(expense)} className="flex-1">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(expense.id)} className="flex-1">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div> */}
    </div>
  );
};

export default ExpenseSection;
