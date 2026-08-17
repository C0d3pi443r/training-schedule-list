import { TableHead, TableRow, TableCell, Box, IconButton, Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import ColumnFilter from "./ColumnFilter";
import type { TableColumn, FilterState, FilterValue, SortState } from "../../types/table";

interface TableHeaderProps<T> {
  columns: readonly TableColumn<T>[];
  filters: FilterState<T>;
  sort: SortState<T>;
  onFilterChange: (columnId: keyof T, value: FilterValue | undefined) => void;
  onSortChange: (columnId: keyof T) => void;
  hasActions?: boolean;
  actionsLabel?: string;
}

function TableHeader<T>({
  columns,
  filters,
  sort,
  onFilterChange,
  onSortChange,
  hasActions,
  actionsLabel,
}: TableHeaderProps<T>) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={String(column.id)} align={column.align} sx={{ minWidth: column.minWidth }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
              <Box sx={{ fontWeight: 600 }}>{column.label}</Box>

              {column.sortable && (
                <Tooltip title={`Sort by ${column.label}`}>
                  <IconButton size="small" onClick={() => onSortChange(column.id)}>
                    {sort.columnId === column.id && sort.direction === "desc" ? (
                      <ArrowDownwardIcon fontSize="inherit" />
                    ) : (
                      <ArrowUpwardIcon
                        fontSize="inherit"
                        sx={{ opacity: sort.columnId === column.id ? 1 : 0.35 }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              )}

              {column.filter && (
                <ColumnFilter
                  column={column}
                  value={filters[column.id]}
                  onApply={(value) => onFilterChange(column.id, value)}
                />
              )}
            </Box>
          </TableCell>
        ))}

        {hasActions && (
          <TableCell align="center" sx={{ fontWeight: 600 }}>
            {actionsLabel}
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;