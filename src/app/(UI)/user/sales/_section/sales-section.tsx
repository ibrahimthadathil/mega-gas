// "use client";

// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Plus, Trash2, CheckCircle2, Search } from "lucide-react";
// import NumberInput from "@/components/ui/number-input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Match the exact backend structure
// interface IProduct {
//   id: string;
//   product_name: string;
//   sale_price: number;
//   price_edit_enabled: boolean;
//   is_composite: boolean;
//   components?: Array<{
//     qty: number;
//     sale_price: number;
//     child_product_id: string;
//   }> | null;
//   tags:string[]
// }

// interface Sale {
//   id: string;
//   productId: string;
//   productName: string;
//   rate: number;
//   quantity: number;
//   isComposite: boolean;
//   customerId?: string;
//   components?: Array<{
//     qty: number;
//     sale_price: number;
//     child_product_id: string;
//   }> | null;
//   tags?:string[]
// }
// interface Customer {
//   id: string;
//   customer_name: string;
//   customer_type: string;
// }

// interface SalesSectionProps {
//   sales: Sale[];
//   products: IProduct[];
//   onChange: (sales: Sale[]) => void;
//   customers: Customer[];
// }

// export default function SalesSection({
//   sales,
//   onChange,
//   products = [],
//   customers,
// }: SalesSectionProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

//   // Autocomplete states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const [isFocused, setIsFocused] = useState(false);
//   const autocompleteRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Get default customer (first one - cash customer)
//   const defaultCustomerId = useMemo(() => {
//     return customers && customers.length > 0 ? customers[0].id : "";
//   }, [customers]);

//   const [formData, setFormData] = useState({
//     productId: "",
//     rate: 0,
//     quantity: 0,
//     customerId: "",
//   });

//   // Reset form when dialog closes and set default customer when dialog opens
//   useEffect(() => {
//     if (!isOpen) {
//       setSelectedProduct(null);
//       setSearchQuery("");
//       setFilteredProducts([]);
//       setSelectedIndex(-1);
//       setIsFocused(false);
//       setFormData({ productId: "", rate: 0, quantity: 0, customerId: defaultCustomerId });
//     } else if (isOpen && defaultCustomerId) {
//       // Set default customer when dialog opens if not already set
//       setFormData((prev) => ({ 
//         ...prev, 
//         customerId: prev.customerId || defaultCustomerId 
//       }));
//     }
//   }, [isOpen, defaultCustomerId]);

//   // Update rate when product is selected
//   useEffect(() => {
//     if (selectedProduct) {
//       setFormData((prev) => ({
//         ...prev,
//         productId: selectedProduct.id,
//         rate: selectedProduct.sale_price,
//       }));
//       setSearchQuery(selectedProduct.product_name);
//     }
//   }, [selectedProduct]);

//   // Filter products based on search query
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredProducts([]);
//       return;
//     }

//     const filtered = products
//       .filter((product) => !product.tags?.includes("full")) // Exclude products with "clossing_stock" tag
//       .filter((product) =>
//         product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     setFilteredProducts(filtered);
//     setSelectedIndex(-1);
//   }, [searchQuery, products]);

//   // Handle product selection
//   const handleProductSelect = useCallback((product: IProduct) => {
//     setSelectedProduct(product);
//     setSearchQuery(product.product_name);
//     setFilteredProducts([]);
//     setSelectedIndex(-1);
//     setIsFocused(false);
//   }, []);

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     setSelectedIndex(-1);

//     // Clear selection if input is empty
//     if (!value.trim()) {
//       setSelectedProduct(null);
//       setFormData((prev) => ({
//         ...prev,
//         productId: "",
//         rate: 0,
//       }));
//     }
//   };

//   // Handle keyboard navigation
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setSelectedIndex((prev) =>
//         Math.min(prev + 1, filteredProducts.length - 1)
//       );
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setSelectedIndex((prev) => Math.max(prev - 1, -1));
//     } else if (e.key === "Enter" && selectedIndex >= 0) {
//       e.preventDefault();
//       handleProductSelect(filteredProducts[selectedIndex]);
//     } else if (e.key === "Escape") {
//       setFilteredProducts([]);
//       setSelectedIndex(-1);
//       setIsFocused(false);
//     }
//   };

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         autocompleteRef.current &&
//         !autocompleteRef.current.contains(event.target as Node)
//       ) {
//         setIsFocused(false);
//         setFilteredProducts([]);
//         setSelectedIndex(-1);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleAdd = () => {
//     if (!selectedProduct || formData.quantity <= 0) return;

//     const newSale: Sale = {
//       id: Date.now().toString(),
//       productId: selectedProduct.id,
//       productName: selectedProduct.product_name,
//       rate: formData.rate,
//       quantity: formData.quantity,
//       isComposite: selectedProduct.is_composite,
//       customerId: formData.customerId,
//       components: selectedProduct.components || null,
//       tags:selectedProduct.tags
//     };

//     onChange([...sales, newSale]);

//     // Reset form
//     setFormData({ productId: "", rate: 0, quantity: 1, customerId: defaultCustomerId });
//     setSelectedProduct(null);
//     setIsOpen(false);
//   };

//   const handleDelete = (id: string) => {
//     onChange(sales.filter((sale) => sale.id !== id));
//   };

//   const groupedSales = (products || [])
//     .map((product) => {
//       const items = sales.filter((s) => s.productId === product.id);
//       return {
//         product,
//         items,
//         totalQty: items.reduce((sum, s) => sum + s.quantity, 0),
//         totalPrice: items.reduce((sum, s) => sum + s.rate * s.quantity, 0),
//       };
//     })
//     .filter((group) => group.items.length > 0);

//   const previewTotal = formData.rate * formData.quantity;

//   // Function to format sales data for submission
//   const formatSalesForSubmission = () => {
//     return sales.map((sale) => {
//       const baseSale: any = {
//         "product id": sale.productId,
//         "is composite": sale.isComposite,
//         "sale qty": sale.quantity,
//         rate: sale.rate,
//         ...(sale.customerId && { "customer id": sale.customerId }),
//         ...(sale.tags && sale.tags.length > 0 && { tags: sale.tags })
//       };

//       if (sale.isComposite && sale.components && sale.components.length > 0) {
//         baseSale["json components"] = sale.components.map((comp) => ({
//           "composite product id": comp.child_product_id,
//           "component qty": comp.qty,
//           "component sale price": comp.sale_price,
//         }));
//       }

//       return baseSale;
//     });
//   };

//   // Log formatted data (you can call this on form submission)
//   // const handleSubmit = () => {
//   //   const formattedSales = formatSalesForSubmission();
//   //   console.log("Sales:", JSON.stringify(formattedSales, null, 2));
//   //   return formattedSales;
//   // };

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold text-foreground">Sale</h2>
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//           <DialogTrigger asChild>
//             <Button
//               size="sm"
//               variant="outline"
//               className="gap-1 bg-transparent"
//             >
//               <Plus className="h-4 w-4" />
//               Add
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Add Sale</DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4">
//               {/* Product Selection */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Product</label>
//                 <div ref={autocompleteRef} className="relative">
//                   <div className="relative">
//                     <Input
//                       ref={inputRef}
//                       value={searchQuery}
//                       onChange={handleInputChange}
//                       onKeyDown={handleKeyDown}
//                       onFocus={() => setIsFocused(true)}
//                       placeholder="Search product..."
//                       className="pr-10"
//                     />
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       className="absolute right-0 top-0 h-full"
//                       tabIndex={-1}
//                       type="button"
//                     >
//                       <Search className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   {/* Dropdown Suggestions */}
//                   {filteredProducts.length > 0 && isFocused && (
//                     <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-md border bg-background shadow-lg">
//                       {filteredProducts.map((product, index) => (
//                         <li
//                           key={product.id}
//                           onClick={() => handleProductSelect(product)}
//                           className={`cursor-pointer px-4 py-3 hover:bg-muted transition-colors ${
//                             index === selectedIndex ? "bg-muted" : ""
//                           }`}
//                         >
//                           <div className="flex justify-between items-center w-full">
//                             <div className="flex-1">
//                               <div className="font-medium">
//                                 {product.product_name}
//                               </div>
//                               {product.is_composite && (
//                                 <div className="text-xs text-muted-foreground mt-0.5">
//                                   Composite Product
//                                 </div>
//                               )}
//                             </div>
//                             <div className="text-right ml-4">
//                               <div className="font-semibold">
//                                 ₹{product.sale_price.toLocaleString()}
//                               </div>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 {/* Display Selected Product Info */}
//                 {selectedProduct && (
//                   <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
//                           <span className="font-semibold text-sm">
//                             {selectedProduct.product_name}
//                           </span>
//                         </div>
//                         {selectedProduct.is_composite && (
//                           <div className="mt-1 text-xs text-muted-foreground">
//                             Composite Product
//                             {selectedProduct.components && (
//                               <span className="ml-1">
//                                 ({selectedProduct.components.length} components)
//                               </span>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <div className="text-right flex-shrink-0">
//                         <div className="text-xs text-muted-foreground">
//                           Sale Price
//                         </div>
//                         <div className="text-lg font-bold text-primary">
//                           ₹{selectedProduct.sale_price.toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Rate */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Rate (₹)</label>
//                 <NumberInput
//                   value={formData.rate}
//                   onChange={(value) => {
//                     // Only allow changes if price editing is enabled
//                     if (
//                       selectedProduct &&
//                       !selectedProduct.price_edit_enabled
//                     ) {
//                       return;
//                     }
//                     setFormData({ ...formData, rate: value });
//                   }}
//                   min={0}
//                 />
//                 {selectedProduct && !selectedProduct.price_edit_enabled && (
//                   <p className="text-xs text-muted-foreground">
//                     Price is fixed and cannot be edited
//                   </p>
//                 )}
//               </div>

//               {/* Quantity */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Quantity</label>
//                 <NumberInput
//                   value={formData.quantity}
//                   onChange={(value) =>
//                     setFormData({ ...formData, quantity: value })
//                   }
//                   min={1}
//                   placeholder="1"
//                 />
//               </div>

//               {/* Customer Selection */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Customer</label>
//                 <Select
//                   value={formData.customerId}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, customerId: value })
//                   }
//                   disabled={
//                     selectedProduct
//                       ? !selectedProduct.price_edit_enabled
//                       : false
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select customer" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {customers && customers.length > 0 ? (
//                       customers.map((customer) => (
//                         <SelectItem key={customer.id} value={customer.id}>
//                           <div className="flex items-center gap-2">
//                             <span>{customer.customer_name}</span>
//                             {customer.customer_type && (
//                               <span className="text-xs text-muted-foreground">
//                                 ({customer.customer_type})
//                               </span>
//                             )}
//                           </div>
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value="" disabled>
//                         No customers available
//                       </SelectItem>
//                     )}
//                   </SelectContent>
//                 </Select>
//                 {selectedProduct && !selectedProduct.price_edit_enabled && (
//                   <p className="text-xs text-muted-foreground">
//                     Customer selection is disabled for fixed price products
//                   </p>
//                 )}
//               </div>

//               {/* Total Preview */}
//               <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-xs text-muted-foreground">
//                       Total Amount
//                     </p>
//                     <p className="text-2xl font-bold text-primary mt-1">
//                       ₹{previewTotal.toLocaleString()}
//                     </p>
//                   </div>
//                   {selectedProduct && (
//                     <div className="text-right text-xs text-muted-foreground">
//                       <div>
//                         {formData.quantity} × ₹{formData.rate.toLocaleString()}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <Button
//                 onClick={handleAdd}
//                 className="w-full"
//                 disabled={!selectedProduct || formData.quantity <= 0}
//               >
//                 Add Sale
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {groupedSales.length === 0 ? (
//         <Card className="p-6 text-center">
//           <p className="text-muted-foreground text-sm">No sales added yet</p>
//         </Card>
//       ) : (
//         <div className="space-y-2">
//           {groupedSales.map((group) => (
//             <Card key={group.product.id} className="p-4">
//               <div className="flex items-start justify-between mb-3">
//                 <div>
//                   <p className="text-sm font-medium text-foreground">
//                     {group.product.product_name}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Qty: {group.totalQty}
//                     {group.product.is_composite && " (Composite)"}
//                   </p>
//                 </div>
//                 <p className="text-xl font-bold text-primary">
//                   ₹{group.totalPrice.toLocaleString()}
//                 </p>
//               </div>

//               <div className="space-y-1 border-t pt-3">
//                 {group.items.map((sale) => (
//                   <div
//                     key={sale.id}
//                     className="flex items-center justify-between text-xs"
//                   >
//                     <span className="text-muted-foreground">
//                       {sale.quantity}x ₹{sale.rate.toLocaleString()}
//                     </span>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       className="h-6 w-6 p-0"
//                       onClick={() => handleDelete(sale.id)}
//                     >
//                       <Trash2 className="h-3 w-3 text-destructive" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Debug button - remove in production */}
//       {/* {sales.length > 0 && (
//         <Button type="button" onClick={handleSubmit} variant="secondary" className="w-full">
//           Log Formatted Sales (Dev Only)
//         </Button>
//       )} */}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, CheckCircle2, Search } from "lucide-react";
import NumberInput from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IProduct {
  id: string;
  product_name: string;
  sale_price: number;
  price_edit_enabled: boolean;
  is_composite: boolean;
  components?: Array<{
    qty: number;
    sale_price: number;
    child_product_id: string;
  }> | null;
  tags: string[];
}

interface Sale {
  id: string;
  productId: string;
  productName: string;
  rate: number;
  quantity: number;
  isComposite: boolean;
  customerId?: string;
  components?: Array<{
    qty: number;
    sale_price: number;
    child_product_id: string;
  }> | null;
  tags?: string[];
}

interface Customer {
  id: string;
  customer_name: string;
  customer_type: string;
}

interface SalesSectionProps {
  sales: Sale[];
  products: IProduct[];
  onChange: (sales: Sale[]) => void;
  customers: Customer[];
}

interface SaleFormData {
  productId: string;
  rate: number;
  quantity: number;
  customerId: string;
}

export default function SalesSection({
  sales,
  onChange,
  products = [],
  customers,
}: SalesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultCustomerId = useMemo(
    () => (customers?.length > 0 ? customers[0].id : ""),
    [customers]
  );

  const { control, handleSubmit, reset, setValue, watch } = useForm<SaleFormData>({
    defaultValues: {
      productId: "",
      rate: 0,
      quantity: 1,
      customerId: defaultCustomerId,
    },
  });

  const formValues = watch();
  const previewTotal = formValues.rate * formValues.quantity;

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      setSearchQuery("");
      setFilteredProducts([]);
      setSelectedIndex(-1);
      setIsFocused(false);
      reset({
        productId: "",
        rate: 0,
        quantity: 1,
        customerId: defaultCustomerId,
      });
    } else if (isOpen && defaultCustomerId) {
      setValue("customerId", defaultCustomerId);
    }
  }, [isOpen, defaultCustomerId, reset, setValue]);

  // Update rate when product is selected
  useEffect(() => {
    if (selectedProduct) {
      setValue("productId", selectedProduct.id);
      setValue("rate", selectedProduct.sale_price);
      setSearchQuery(selectedProduct.product_name);
    }
  }, [selectedProduct, setValue]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const filtered = products
      .filter((product) => !product.tags?.includes("full"))
      .filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredProducts(filtered);
    setSelectedIndex(-1);
  }, [searchQuery, products]);

  const handleProductSelect = useCallback((product: IProduct) => {
    setSelectedProduct(product);
    setSearchQuery(product.product_name);
    setFilteredProducts([]);
    setSelectedIndex(-1);
    setIsFocused(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    if (!value.trim()) {
      setSelectedProduct(null);
      setValue("productId", "");
      setValue("rate", 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        Math.min(prev + 1, filteredProducts.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleProductSelect(filteredProducts[selectedIndex]);
    } else if (e.key === "Escape") {
      setFilteredProducts([]);
      setSelectedIndex(-1);
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setFilteredProducts([]);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = (data: SaleFormData) => {
    if (!selectedProduct || data.quantity <= 0) return;

    const newSale: Sale = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.product_name,
      rate: data.rate,
      quantity: data.quantity,
      isComposite: selectedProduct.is_composite,
      customerId: data.customerId,
      components: selectedProduct.components || null,
      tags: selectedProduct.tags,
    };

    onChange([...sales, newSale]);
    setIsOpen(false);
  };

  const handleDelete = useCallback(
    (id: string) => {
      onChange(sales.filter((sale) => sale.id !== id));
    },
    [sales, onChange]
  );

  const groupedSales = useMemo(
    () =>
      products
        .map((product) => {
          const items = sales.filter((s) => s.productId === product.id);
          return {
            product,
            items,
            totalQty: items.reduce((sum, s) => sum + s.quantity, 0),
            totalPrice: items.reduce((sum, s) => sum + s.rate * s.quantity, 0),
          };
        })
        .filter((group) => group.items.length > 0),
    [products, sales]
  );

  const handleFormSubmit = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Sale</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Sale</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Product Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <div ref={autocompleteRef} className="relative">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      placeholder="Search product..."
                      className="pr-10"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full"
                      tabIndex={-1}
                      type="button"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {filteredProducts.length > 0 && isFocused && (
                    <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-md border bg-background shadow-lg">
                      {filteredProducts.map((product, index) => (
                        <li
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className={`cursor-pointer px-4 py-3 hover:bg-muted transition-colors ${
                            index === selectedIndex ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex-1">
                              <div className="font-medium">
                                {product.product_name}
                              </div>
                              {product.is_composite && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  Composite Product
                                </div>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-semibold">
                                ₹{product.sale_price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {selectedProduct && (
                  <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-semibold text-sm">
                            {selectedProduct.product_name}
                          </span>
                        </div>
                        {selectedProduct.is_composite && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Composite Product
                            {selectedProduct.components && (
                              <span className="ml-1">
                                ({selectedProduct.components.length} components)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-muted-foreground">
                          Sale Price
                        </div>
                        <div className="text-lg font-bold text-primary">
                          ₹{selectedProduct.sale_price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rate */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rate (₹)</label>
                <Controller
                  name="rate"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      value={field.value}
                      onChange={(value) => {
                        if (
                          selectedProduct &&
                          !selectedProduct.price_edit_enabled
                        ) {
                          return;
                        }
                        field.onChange(value);
                      }}
                      min={0}
                    />
                  )}
                />
                {selectedProduct && !selectedProduct.price_edit_enabled && (
                  <p className="text-xs text-muted-foreground">
                    Price is fixed and cannot be edited
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                      placeholder="1"
                    />
                  )}
                />
              </div>

              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer</label>
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        selectedProduct
                          ? !selectedProduct.price_edit_enabled
                          : false
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers?.length > 0 ? (
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div className="flex items-center gap-2">
                                <span>{customer.customer_name}</span>
                                {customer.customer_type && (
                                  <span className="text-xs text-muted-foreground">
                                    ({customer.customer_type})
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No customers available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {selectedProduct && !selectedProduct.price_edit_enabled && (
                  <p className="text-xs text-muted-foreground">
                    Customer selection is disabled for fixed price products
                  </p>
                )}
              </div>

              {/* Total Preview */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      ₹{previewTotal.toLocaleString()}
                    </p>
                  </div>
                  {selectedProduct && (
                    <div className="text-right text-xs text-muted-foreground">
                      <div>
                        {formValues.quantity} × ₹
                        {formValues.rate.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleFormSubmit}
                className="w-full"
                disabled={!selectedProduct || formValues.quantity <= 0}
              >
                Add Sale
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {groupedSales.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground text-sm">No sales added yet</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {groupedSales.map((group) => (
            <Card key={group.product.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {group.product.product_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Qty: {group.totalQty}
                    {group.product.is_composite && " (Composite)"}
                  </p>
                </div>
                <p className="text-xl font-bold text-primary">
                  ₹{group.totalPrice.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1 border-t pt-3">
                {group.items.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {sale.quantity}x ₹{sale.rate.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDelete(sale.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}