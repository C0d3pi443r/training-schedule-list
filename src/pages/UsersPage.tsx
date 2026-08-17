import * as React from "react";
import { Box, Typography, IconButton, Stack, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import DynamicTable from "../components/table/DynamicTable";
import LessonDetailsModal from "../components/modals/LessonDetailsModal";
import AttendanceModal from "../components/modals/AttendanceModal";

import { fetchTrainees, updateAttendanceStatus } from "../services/traineeService";
import { INSTRUCTORS, LESSON_STATUSES, trainees } from "../data/trainees";
import type { Trainee } from "../data/trainees";
import type { TableColumn } from "../types/table";

const columns: TableColumn<Trainee>[] = [
  {
    id: "name",
    label: "Trainee Name",
    minWidth: 160,
    sortable: true,
    filter: { type: "autocomplete", options: trainees.map((trainee) => trainee.name), },
  },
  {
    id: "lessonDate",
    label: "Lesson Date",
    minWidth: 140,
    sortable: true,
    filter: { type: "date-range" },
  },
  {
    id: "lessonTime",
    label: "Lesson Time",
    minWidth: 120,
  },
  {
    id: "instructor",
    label: "Instructor",
    minWidth: 160,
    filter: { type: "select", options: INSTRUCTORS },
  },
  {
    id: "vehicle",
    label: "Vehicle / Bus",
    minWidth: 130,
  },
  {
    id: "lessonStatus",
    label: "Lesson Status",
    minWidth: 140,
    filter: { type: "select", options: LESSON_STATUSES },
  },
  {
    id: "attendanceStatus",
    label: "Attendance",
    minWidth: 130,
  },
];

export default function UsersPage() {
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [detailsTrainee, setDetailsTrainee] = React.useState<Trainee | null>(null);
  const [attendanceTrainee, setAttendanceTrainee] = React.useState<Trainee | null>(null);

  const handleSaveAttendance = async (traineeId: number, status: string) => {
    await updateAttendanceStatus(traineeId, status);
    setRefreshToken((v) => v + 1);
  };

  const renderActions = (row: Trainee) => (
    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
      <Tooltip title="View lesson details">
        <IconButton size="small" onClick={() => setDetailsTrainee(row)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Update attendance">
        <IconButton size="small" onClick={() => setAttendanceTrainee(row)}>
          <EventAvailableIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Training Schedule
      </Typography>

      <DynamicTable
        columns={columns}
        rowKey="id"
        fetchData={fetchTrainees}
        renderActions={renderActions}
        refreshToken={refreshToken}
      />

      <LessonDetailsModal
        trainee={detailsTrainee}
        open={Boolean(detailsTrainee)}
        onClose={() => setDetailsTrainee(null)}
      />

      <AttendanceModal
        trainee={attendanceTrainee}
        open={Boolean(attendanceTrainee)}
        onClose={() => setAttendanceTrainee(null)}
        onSave={handleSaveAttendance}
      />
    </Box>
  );
}