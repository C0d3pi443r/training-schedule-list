import type { ReactNode } from "react";

export type FilterType = "text" | "select" | "date-range" | "number" | "autocomplete";

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;

  filter?: {
    type: FilterType;
    options?: string[];
  };

  format?: (value: T[keyof T], row: T) => ReactNode;
}

export type SortDirection = "asc" | "desc";

export interface SortState<T> {
  columnId: keyof T | null;
  direction: SortDirection;
}

export type FilterValue = string | { start: string; end: string };

export type FilterState<T> = Partial<Record<keyof T, FilterValue>>;

export interface FetchParams<T> {
  page: number;
  rowsPerPage: number;
  filters: FilterState<T>;
  sort: SortState<T>;
}

export interface FetchResult<T> {
  rows: T[];
  total: number;
}

export interface TableProps<T> {
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  rowKey: keyof T;
}