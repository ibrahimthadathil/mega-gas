"use client";

import { useForm } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Warehouse } from "../../warehouses/page";

interface Product {
  id: string;
  name: string;
  tripType: "one-way" | "two-way";
  quantity: number;
}

interface PlantLoadFormData {
  invoiceNumber: string;
  sapNumber: string;
  date: Date | undefined;
  warehouse: string;
}

interface DialogFormData {
  id?: string;
  product: string;
  tripType: "one-way" | "two-way";
  quantity: string;
}
const warehouseOptions = [
  "Warehouse A",
  "Warehouse B",
  "Warehouse C",
  "Warehouse D",
];

export default function PlantLoadSection() {
  
  const {
    register: registerMain,
    watch: watchMain,
    setValue: setValueMain,
  } = useForm<PlantLoadFormData>({
    defaultValues: {
      invoiceNumber: "",
      sapNumber: "",
      date: undefined,
    },
  });

  const {
    register: registerDialog,
    watch: watchDialog,
    handleSubmit: handleSubmitDialog,
    reset: resetDialog,
    setValue: setValueDialog,
  } = useForm<DialogFormData>({
    defaultValues: {
      product: "",
      tripType: "one-way",
      quantity: "",
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const productOptions = [
    "5kg Cylinder",
    "10kg Cylinder",
    "15kg Cylinder",
    "19kg Cylinder",
  ];

  const handleAddProduct = (data: DialogFormData) => {
    console.log("actual data", data);

    if (!data.product || !data.quantity) {
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.product,
      tripType: data.tripType,
      quantity: Number.parseInt(data.quantity),
    };

    setProducts([...products, newProduct]);
    resetDialog();
    setIsDialogOpen(false);
  };

  const handlePurchase = async (data: any) => {
    try {
      console.log(data);
    } catch (error) {}
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleDateChange = (date: Date | undefined) => {
    setValueMain("date", date, { shouldValidate: true });
  };

  const isProceedDisabled = products.length === 0;
  const mainFormData = watchMain();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Plant Load
        </h1>
      </div>

      {/* First Row: Invoice, SAP, Date */}
      <Card className="bg-card ">
        <CardContent className="pt-1">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice" className="text-sm font-medium">
                  TAX Invoice Number
                </Label>
                <Input
                  id="invoice"
                  placeholder="Enter invoice number"
                  {...registerMain("invoiceNumber")}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sap" className="text-sm font-medium">
                  SAP Number
                </Label>
                <Input
                  id="sap"
                  placeholder="Enter SAP number"
                  {...registerMain("sapNumber")}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <DatePicker
                  date={watchMain("date")}
                  onDateChange={handleDateChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse" className="text-sm font-medium">
                  Warehouse
                </Label>
                <Select
                  value={watchMain("warehouse")}
                  onValueChange={(value) => setValueMain("warehouse", value)}
                >
                  <SelectTrigger id="warehouse">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Add
        </Button>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product Load</DialogTitle>
            <DialogDescription>
              Select product details to add to plant load.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitDialog(handleAddProduct)}>
            <div className="space-y-4">
              {/* Product Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="product" className="text-sm font-medium">
                  Product Name
                </Label>
                <Select
                  value={watchDialog("product")}
                  onValueChange={(value) => setValueDialog("product", value)}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trip Type Radio Group */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Trip Type</Label>
                <RadioGroup
                  value={watchDialog("tripType")}
                  onValueChange={(value: "one-way" | "two-way") =>
                    setValueDialog("tripType", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-way" id="one-way" />
                    <Label
                      htmlFor="one-way"
                      className="font-normal cursor-pointer"
                    >
                      One Way
                    </Label>
                    <RadioGroupItem value="two-way" id="two-way" />
                    <Label
                      htmlFor="two-way"
                      className="font-normal cursor-pointer"
                    >
                      Two Way
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity Input */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  {...registerDialog("quantity")}
                  min="1"
                  className="w-full"
                />
              </div>

              {/* Dialog Add Button */}
              <Button
                type="submit"
                disabled={!watchDialog("product") || !watchDialog("quantity")}
                className="w-full"
                size="lg"
              >
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Cards */}
      {products.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Added Items ({products.length})
          </p>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              {products.map((product) => (
                <Card key={product.id} className="bg-card flex-shrink-0 w-64">
                  <CardContent className="pt-4 pb-4 px-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <p className="font-semibold text-foreground">
                            {product.name}
                          </p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              Trip Type:{" "}
                              <span className="capitalize font-medium">
                                {product.tripType === "one-way"
                                  ? "One Way"
                                  : "Two Way"}
                              </span>
                            </p>
                            <p>
                              Quantity:{" "}
                              <span className="font-medium">
                                {product.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="ml-2 p-1 hover:bg-muted rounded transition-colors"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <Button
        onClick={() =>
          handlePurchase({
            ...mainFormData,
            products,
          })
        }
        disabled={isProceedDisabled}
        size="lg"
        className="w-full md:w-full"
      >
        Proceed
      </Button>
    </div>
  );
}
