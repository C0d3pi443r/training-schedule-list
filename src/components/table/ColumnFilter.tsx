import * as React from "react";
import {
  IconButton,
  Popover,
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Autocomplete from '@mui/material/Autocomplete';

import type { TableColumn, FilterValue } from "../../types/table";

interface ColumnFilterProps<T> {
  column: TableColumn<T>;
  value: FilterValue | undefined;
  onApply: (value: FilterValue | undefined) => void;
}

function ColumnFilter<T>({ column, value, onApply }: ColumnFilterProps<T>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [text, setText] = React.useState(typeof value === "string" ? value : "");
  const [start, setStart] = React.useState(value && typeof value === "object" ? value.start : "");
  const [end, setEnd] = React.useState(value && typeof value === "object" ? value.end : "");

  React.useEffect(() => {
    setText(typeof value === "string" ? value : "");
    setStart(value && typeof value === "object" ? value.start : "");
    setEnd(value && typeof value === "object" ? value.end : "");
  }, [value]);

  if (!column.filter) return null;

  const open = Boolean(anchorEl);
  const isActive = Boolean(value);
  const filterType = column.filter.type;

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    if (filterType === "date-range") {
      onApply(start || end ? { start, end } : undefined);
    } else {
      onApply(text.trim() === "" ? undefined : text.trim());
    }
    handleClose();
  };

  const handleClear = () => {
    setText("");
    setStart("");
    setEnd("");
    onApply(undefined);
    handleClose();
  };

  return (
    <>
      <IconButton
        size='small'
        onClick={handleOpen}
        color={isActive ? 'primary' : 'default'}
        aria-label={`Filter ${column.label}`}
      >
        <FilterListIcon fontSize='small' />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 240 }}>
          <Stack spacing={1.5}>
            {filterType === 'autocomplete' && (
              <Autocomplete
                size='small'
                options={column.filter.options ?? []}
                value={text || null}
                onChange={(_, newValue) => {
                  setText(newValue ?? '');
                }}
                onInputChange={(_, newInputValue) => {
                  setText(newInputValue);
                }}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={column.label}
                    placeholder={`Search ${column.label}`}
                    autoFocus
                  />
                )}
              />
            )}

            {filterType === 'number' && (
              <TextField
                size='small'
                type='number'
                label={`Filter ${column.label}`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />
            )}

            {filterType === 'select' && (
              <TextField
                select
                size='small'
                label={column.label}
                value={text}
                onChange={(e) => setText(e.target.value)}
              >
                <MenuItem value=''>All</MenuItem>
                {column.filter.options?.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {filterType === 'date-range' && (
              <>
                <TextField
                  size='small'
                  type='date'
                  label='From'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
                <TextField
                  size='small'
                  type='date'
                  label='To'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </>
            )}

            <Stack
              direction='row'
              spacing={1}
              sx={{ justifyContent: 'flex-end' }}
            >
              <Button size='small' onClick={handleClear}>
                Clear
              </Button>
              <Button size='small' variant='contained' onClick={handleApply}>
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

export default ColumnFilter;