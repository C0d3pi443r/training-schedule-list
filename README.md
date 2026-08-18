# Training Schedule List

A dynamic, backend-ready data table built with React, TypeScript, and MUI. Built for a training-schedule assessment, but the table itself (`DynamicTable`) is generic and reusable for any tabular data.

## Features

- **Table** — trainee name, lesson date, lesson time, instructor, vehicle/bus, lesson status, attendance status
- **Dynamic per-column filters** — the filter UI adapts to the column's type:
  - `autocomplete` → type-ahead search box (Trainee Name, Instructor)
  - `date-range` → From/To date pickers (Lesson Date)
  - `select` → dropdown of options (Lesson Status)
  - `text` / `number` → supported by `ColumnFilter`, not used by any column by default
- **Sorting** — click the arrow next to a sortable column header to toggle ascending/descending
- **Pagination** — `Showing 1-10 of 87` with `< previous  1 2 3 4 5 … 10  next >`, 10 rows per page
- **Actions**
  - Register a new lesson (page-level button)
  - Per row, via the kebab (⋮) menu:
    - View lesson details (read-only modal)
    - Edit lesson (name, date, time, lesson status, attendance)
    - Update attendance (dedicated modal with required-field validation)
    - Delete lesson (with a confirm prompt)
- **UI states** — loading spinner, error message with Retry, empty state, all rendered as proper table rows (not layout-breaking overlays)
- **Responsive** — table scrolls horizontally on small screens; pagination controls stack on mobile
- Built entirely from MUI components (`Table`, `Dialog`, `TextField`, `Alert`, `Chip`, `Menu`, etc.)

## Project Structure

```
src/
├── components/
│   ├── table/
│   │   ├── DynamicTable.tsx      # Orchestrates filters, sort, pagination, fetch state
│   │   ├── TableHeader.tsx       # Column headers, sort toggle, filter trigger
│   │   ├── ColumnFilter.tsx      # Popover UI — changes per column filter type
│   │   ├── ActiveFilter.tsx      # Chips summarizing currently-applied filters
│   │   ├── TableBody.tsx         # Rows OR loading / error / empty state
│   │   ├── TableRow.tsx          # Single row + optional actions cell
│   │   └── TablePagination.tsx   # "Showing X-Y of Z" + page number controls
│   └── modals/
│       ├── LessonDetailsModal.tsx  # View lesson details (read-only)
│       ├── EditTraineeModal.tsx    # Edit name/date/time/lesson status/attendance + delete
│       ├── RegisterLessonModal.tsx # Register a new lesson
│       └── AttendanceModal.tsx     # Update attendance (validated)
├── data/
│   └── trainees.ts               # Mock data (87 generated rows)
├── services/
│   └── traineeService.ts         # Mock "API" — fetchTrainees, createTrainee, updateTrainee, deleteTrainee, updateAttendanceStatus
├── types/
│   └── table.ts                  # TableColumn, FilterState, SortState, FetchParams/Result
└── pages/
    └── UsersPage.tsx             # Column config, RowActionsMenu, wires table + all four modals together
```

## Setup

1. Copy the `src/` folder into your existing Vite/React project (it matches the paths from your uploaded files — nothing else needs to move).
2. Install dependencies if you don't already have them:
   ```bash
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```
3. Make sure your `App.tsx` renders `UsersPage`:
   ```tsx
   import UsersPage from "./pages/UsersPage";

   function App() {
     return <UsersPage />;
   }
   ```
4. Run the app as usual (`npm run dev`).

To see the error state without touching code, add `?simulateError=true` to the page URL.

## Connecting to a Real Backend

Everything currently goes through `src/services/traineeService.ts`. These functions are the only place that need to change:

```ts
// Before (mock)
export async function fetchTrainees(params: FetchParams<Trainee>): Promise<FetchResult<Trainee>> {
  // filters mock array in memory
}

// After (real API)
export async function fetchTrainees(params: FetchParams<Trainee>): Promise<FetchResult<Trainee>> {
  const res = await fetch(`/api/trainees?${new URLSearchParams({ ...params })}`);
  return res.json(); // shape: { rows: Trainee[], total: number }
}
```

`DynamicTable` doesn't know or care whether `fetchData` is mock or real — it just calls the function you pass in and reacts to loading / success / error. Same pattern applies to `createTrainee`, `updateTrainee`, `deleteTrainee`, and `updateAttendanceStatus` — each would become a `POST` / `PATCH` / `DELETE` call with the same signature.

## Notes / Simplifications

- Filters are wired for the four columns the assessment asked for (Trainee Name, Lesson Date, Instructor, Lesson Status). Adding a filter to any other column is just adding a `filter: { type: ... }` entry to that column's config in `UsersPage.tsx`.
- Filtering, sorting, and pagination all happen inside the mock service to mimic how a real paginated endpoint would behave (query in, `{ rows, total }` out) — swapping in a real API keeps this contract.
- Attendance, edit, and delete actions mutate the in-memory mock array directly (since there's no real backend yet); the table refetches via a `refreshToken` prop after each save.
- The per-row action menu (`RowActionsMenu`, defined in `UsersPage.tsx`) is its own component rather than an inline function so that each row's open/close menu state is properly scoped — a function invoked per row can't hold its own hook state.