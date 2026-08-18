import {
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TableCell,
  CircularProgress,
  Alert,
  Button,
  Box,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

import TableRow from "./TableRow";
import type { TableColumn } from "../../types/table";

interface TableBodyProps<T> {
  rows: readonly T[];
  columns: readonly TableColumn<T>[];
  rowKey: keyof T;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  renderActions?: (row: T) => ReactNode;
}

function TableBody<T>({
  rows,
  columns,
  rowKey,
  loading,
  error,
  onRetry,
  renderActions,
}: TableBodyProps<T>) {
  const colSpan = columns.length + (renderActions ? 1 : 0);

  if (loading) {
    return (
      <MuiTableBody>
        <MuiTableRow>
          <TableCell colSpan={colSpan} align="center" sx={{ py: 8, border: 0 }}>
            <CircularProgress size={32} />
          </TableCell>
        </MuiTableRow>
      </MuiTableBody>
    );
  }

  if (error) {
    return (
      <MuiTableBody>
        <MuiTableRow>
          <TableCell colSpan={colSpan} sx={{ py: 4, border: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={onRetry}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            </Box>
          </TableCell>
        </MuiTableRow>
      </MuiTableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <MuiTableBody>
        <MuiTableRow>
          <TableCell colSpan={colSpan} align="center" sx={{ py: 8, border: 0 }}>
            <Typography color="text.secondary">
              No lessons found. Try adjusting your filters.
            </Typography>
          </TableCell>
        </MuiTableRow>
      </MuiTableBody>
    );
  }

  return (
    <MuiTableBody>
      {rows.map((row) => (
        <TableRow
          key={String(row[rowKey])}
          row={row}
          columns={columns}
          renderActions={renderActions}
        />
      ))}
    </MuiTableBody>
  );
}

export default TableBody;