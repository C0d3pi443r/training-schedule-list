import { Box, Typography, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface TablePaginationProps {
  page: number; 
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

type PageEntry = number | "ellipsis";

function getPageNumbers(current: number, totalPages: number): PageEntry[] {
  const pages: PageEntry[] = [];
  const siblings = 1;

  const start = Math.max(1, current - siblings);
  const end = Math.min(totalPages, current + siblings);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("ellipsis");
  }

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return pages;
}

function TablePagination({ page, rowsPerPage, total, onPageChange }: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const currentPage = page + 1;

  const from = total === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(total, (page + 1) * rowsPerPage);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {from}-{to} of {total}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
        <Button
          size="small"
          startIcon={<ChevronLeftIcon />}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        {pageNumbers.map((p, idx) =>
          p === "ellipsis" ? (
            <Typography key={`ellipsis-${idx}`} sx={{ px: 1 }} color="text.secondary">
              ...
            </Typography>
          ) : (
            <Button
              key={p}
              size="small"
              variant={p === currentPage ? "contained" : "text"}
              onClick={() => onPageChange(p - 1)}
              sx={{ minWidth: 32 }}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          size="small"
          endIcon={<ChevronRightIcon />}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default TablePagination;