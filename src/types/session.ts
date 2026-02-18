export interface GetSessionsFilters {
  search?: string;
  dateFilter?: DateFilterOptionType;
}

export type DateFilterOptionType =
  | "today"
  | "week-ahead"
  | "month-ahead"
  | "future"
  | "past"
  | "all";
