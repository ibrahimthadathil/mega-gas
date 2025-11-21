"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import { IProduct } from "@/types/types";
import { UseRQ } from "@/hooks/useReactQuery";
import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductListPage() {
  const { data, isLoading } = UseRQ("products", getAllProducts);  
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory
            </p>
          </div>
          {(data as IProduct[])?.length > 0 && (
            <Link href="/admin/product/add">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex flex-col space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 sm:w-1/2 md:w-3/4" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data as IProduct[])?.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {product.product_name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {product.product_code}
                      </CardDescription>
                    </div>
                    {product.is_composite && (
                      <Badge variant="outline" className="whitespace-nowrap">
                        Composite
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">
                        {product.product_type}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sale Price:</span>
                      <span className="font-medium">${product.sale_price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cost Price:</span>
                      <span className="font-medium">${product.cost_price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-medium">
                        {product.available_qty} units
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Visibility:
                        </span>
                        <Badge
                          variant={product.visibility ? "default" : "secondary"}
                        >
                          {product.visibility ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/product/edit/${product.id}`}
                    className="mt-4 w-full"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {(data as IProduct[])?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No products found</p>
              <Link href="/admin/product/add">
                <Button>Create First Product</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
