import {
  TableCell,
  TableRow as MuiTableRow,
} from "@mui/material";
import type { ReactNode } from "react";

import type { TableColumn } from "../../types/table";

interface TableRowProps<T> {
  row: T;
  columns: readonly TableColumn<T>[];
  renderActions?: (row: T) => ReactNode;
}

function TableRow<T>({
  row,
  columns,
  renderActions,
}: TableRowProps<T>) {
  return (
    <MuiTableRow hover>
      {columns.map((column) => {
        const value = row[column.id];

        return (
          <TableCell
            key={String(column.id)}
            align={column.align}
          >
            {column.format
              ? column.format(value, row)
              : String(value ?? "")}
          </TableCell>
        );
      })}

      {renderActions && (
        <TableCell align="center">
          {renderActions(row)}
        </TableCell>
      )}
    </MuiTableRow>
  );
}

export default TableRow;