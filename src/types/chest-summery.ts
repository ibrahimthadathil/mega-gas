export type ChestName = "godown" | "office";
export type ChestStatus = "Settled" | "Submitted"; // UI casing
export type ApiChestStatus = "settled" | "submitted"; // API casing

export interface ChestSummary {
  idx: number;
  chest_name: ChestName;
  status: ChestStatus;
  total_count: number;
  total_amount_sum: string;
  note_2000_sum: number;
  note_500_sum: number;
  note_200_sum: number;
  note_100_sum: number;
  note_50_sum: number;
  note_20_sum: number;
  note_10_sum: number;
  coin_5_sum: number;
}

export interface ChestSummaryFilterForm {
  chest: "All" | ChestName;
  status: "All" | ChestStatus;
}
