import { Box, Chip } from "@mui/material";

import type { TableColumn, FilterState, FilterValue } from "../../types/table";

interface ActiveFiltersProps<T> {
  columns: readonly TableColumn<T>[];
  filters: FilterState<T>;
  onRemove: (columnId: keyof T) => void;
}

function formatValue(value: FilterValue): string {
  if (typeof value === "object") {
    const { start, end } = value;
    if (start && end) return `${start} – ${end}`;
    if (start) return `From ${start}`;
    if (end) return `Until ${end}`;
    return "";
  }
  return value;
}

function ActiveFilters<T>({ columns, filters, onRemove }: ActiveFiltersProps<T>) {
  const activeIds = (Object.keys(filters) as Array<keyof T>).filter(
    (id) => filters[id] !== undefined,
  );

  if (activeIds.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {activeIds.map((columnId) => {
        const column = columns.find((c) => c.id === columnId);
        const value = filters[columnId];
        if (!column || value === undefined) return null;

        return (
          <Chip
            key={String(columnId)}
            label={`${column.label}: ${formatValue(value)}`}
            onDelete={() => onRemove(columnId)}
            size="small"
            variant="outlined"
            color="primary"
          />
        );
      })}
    </Box>
  );
}

export default ActiveFilters;