// admin sales view report filter props type
export interface FilterParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  warehouse?: string;
  chest?: "office" | "godown";
  page?: number;
  limit?: number;
}