import * as React from "react";
import { Paper, Table, TableContainer } from "@mui/material";

import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import ActiveFilter from "./ActiveFilter";

import type {
  TableColumn,
  FilterState,
  FilterValue,
  SortState,
  FetchParams,
  FetchResult,
} from "../../types/table";

const ROWS_PER_PAGE = 10;

interface DynamicTableProps<T> {
  columns: readonly TableColumn<T>[];
  rowKey: keyof T;
  fetchData: (params: FetchParams<T>) => Promise<FetchResult<T>>;
  renderActions?: (row: T) => React.ReactNode;
  actionsLabel?: string;
  refreshToken?: number | string;
}

function DynamicTable<T>({
  columns,
  rowKey,
  fetchData,
  renderActions,
  actionsLabel = "Actions",
  refreshToken,
}: DynamicTableProps<T>) {
  const [page, setPage] = React.useState(0);
  const [filters, setFilters] = React.useState<FilterState<T>>({});
  const [sort, setSort] = React.useState<SortState<T>>({ columnId: null, direction: "asc" });

  const [rows, setRows] = React.useState<T[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchData({ page, rowsPerPage: ROWS_PER_PAGE, filters, sort })
      .then((result) => {
        if (cancelled) return;
        setRows(result.rows);
        setTotal(result.total);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchData, page, filters, sort, refreshToken]);

  React.useEffect(() => {
    const cancel = loadData();
    return cancel;
  }, [loadData]);

  const handleFilterChange = (columnId: keyof T, value: FilterValue | undefined) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === undefined) {
        delete next[columnId];
      } else {
        next[columnId] = value;
      }
      return next;
    });
    setPage(0);
  };

  const handleSortChange = (columnId: keyof T) => {
    setSort((prev) => ({
      columnId,
      direction: prev.columnId === columnId && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <ActiveFilter
        columns={columns}
        filters={filters}
        onRemove={(columnId: keyof T) => handleFilterChange(columnId, undefined)}
      />
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader sx={{ minWidth: 900 }}>
          <TableHeader
            columns={columns}
            filters={filters}
            sort={sort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            hasActions={Boolean(renderActions)}
            actionsLabel={actionsLabel}
          />

          <TableBody
            rows={rows}
            columns={columns}
            rowKey={rowKey}
            loading={loading}
            error={error}
            onRetry={loadData}
            renderActions={renderActions}
          />
        </Table>
      </TableContainer>

      <TablePagination page={page} rowsPerPage={ROWS_PER_PAGE} total={total} onPageChange={setPage} />
    </Paper>
  );
}

export default DynamicTable;