import { trainees } from "../data/trainees";
import type { Trainee } from "../data/trainees";
import type { FetchParams, FetchResult } from "../types/table";

const SIMULATED_DELAY = 500;

export async function fetchTrainees(
  params: FetchParams<Trainee>,
): Promise<FetchResult<Trainee>> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

  if (typeof window !== "undefined" && window.location.search.includes("simulateError=true")) {
    throw new Error("Failed to load the training schedule. Please try again.");
  }

  let result = [...trainees];
  const { filters } = params;

  (Object.keys(filters) as Array<keyof Trainee>).forEach((key) => {
    const value = filters[key];
    if (value === undefined) return;

    if (typeof value === "object") {
      const { start, end } = value;
      result = result.filter((row) => {
        const date = String(row[key]);
        return (!start || date >= start) && (!end || date <= end);
      });
    } else if (value.trim() !== "") {
      result = result.filter((row) =>
        String(row[key]).toLowerCase().includes(value.toLowerCase()),
      );
    }
  });

  if (params.sort.columnId) {
    const { columnId, direction } = params.sort;
    result = [...result].sort((a, b) => {
      const cmp = String(a[columnId]).localeCompare(String(b[columnId]));
      return direction === "asc" ? cmp : -cmp;
    });
  }

  const total = result.length;
  const start = params.page * params.rowsPerPage;
  const rows = result.slice(start, start + params.rowsPerPage);

  return { rows, total };
}

export async function updateAttendanceStatus(traineeId: number, status: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const trainee = trainees.find((t) => t.id === traineeId);
  if (trainee) {
    trainee.attendanceStatus = status;
  }
}