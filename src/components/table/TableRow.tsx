import {
  TableCell,
  TableRow as MuiTableRow,
} from "@mui/material";

import type { TableColumn } from "../../types/table";

interface TableRowProps<T> {
  row: T;
  columns: readonly TableColumn<T>[];
}

function TableRow<T>({
  row,
  columns,
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
    </MuiTableRow>
  );
}

export default TableRow;