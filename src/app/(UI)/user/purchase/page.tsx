"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import { getPlantLoadRegister } from "@/services/client_api-Service/user/purchase/purchase_api";
import { PlantLoadRecord } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlantLoadPage() {
  const { data, isLoading } = UseRQ("register", getPlantLoadRegister);
  const queryClient = useQueryClient()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const router = useRouter()
  console.log(data);
  
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const handleUnload = (Record: PlantLoadRecord) => {
    queryClient.setQueryData(["plant_load",Record.sap_number],Record)
    router.push(`/user/stock/load-slip/${Record.sap_number}`)
  };
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Plant Load Records
        </h1>
        <p className="text-muted-foreground">
          View and manage all plant load entries
        </p>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Total Records({data ? (data as PlantLoadRecord[]).length : 0})
        </p>
        <div className="space-y-3">
          {isLoading ? (
            <Skeleton />
          ) : (
            (data as PlantLoadRecord[]).map((record) => {
              const isExpanded = expandedIds.has(record.id);

              return (
                <Card key={record.id} className="bg-card w-full">
                  <CardContent className="pt-2">
                    <div className="space-y-4">
                      {/* Record Header */}

                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <h2 className="text-lg">
                                {record.warehouse_name}
                              </h2>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 ps-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                            <div>
                              SAP:{" "}
                              <span className="font-medium text-foreground">
                                {record.sap_number}
                              </span>
                            </div>
                            <div>
                              Date:{" "}
                              <span className="font-medium text-foreground">
                                {record.bill_date}
                              </span>
                            </div>
                            <div>
                              Total Qty:{" "}
                              <span className="font-medium text-foreground">
                                {record.total_full_qty}
                              </span>
                            </div>
                            <div>
                              Balance:{" "}
                              <span className="font-medium text-foreground">
                                {record.balance}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                <Button
                                  onClick={() =>
                                    handleUnload(record)
                                  }
                                >
                                  Unload
                                </Button>
                              </span>
                            </div>
                          </div>
                        </div>

                        <ChevronDown
                          onClick={() => toggleExpanded(record.id)}
                          className={`w-5 h-5 text-muted-foreground transition-transform hover:cursor-pointer ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* Expandable Line Items */}
                      {isExpanded && (
                        <div className="border-t border-border pt-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground mb-3">
                            Line Items ({record.line_items.length})
                          </p>
                          <div className="space-y-2">
                            {record.line_items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-foreground">
                                    {item.product_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    Trip:{" "}
                                    {item.trip_type === "oneway"
                                      ? "One Way"
                                      : "Two Way"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-foreground">
                                    {item.qty} units
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Additional Stats */}
                          <div className="border-t border-border mt-4 pt-3 grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <p className="text-muted-foreground">Unloaded</p>
                              <p className="font-semibold text-foreground">
                                {record.unloaded_qty}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">Return</p>
                              <p className="font-semibold text-foreground">
                                {record.total_return_qty}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">Balance</p>
                              <p className="font-semibold text-foreground">
                                {record.balance}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
