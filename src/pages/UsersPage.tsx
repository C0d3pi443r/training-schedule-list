import * as React from "react";
import { Box, Typography, IconButton, Stack, Tooltip, Button, Alert, Menu, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import DynamicTable from "../components/table/DynamicTable";
import LessonDetailsModal from "../components/modals/LessonDetailsModal";
import EditTraineeModal from "../components/modals/EditTraineeModal";
import RegisterLessonModal from "../components/modals/RegisterLessonModal";
import AttendanceModal from "../components/modals/AttendanceModal";

import {
  fetchTrainees,
  updateTrainee,
  deleteTrainee,
  createTrainee,
  updateAttendanceStatus,
} from "../services/traineeService";
import { INSTRUCTORS, LESSON_STATUSES, trainees } from "../data/trainees";
import type { Trainee } from "../data/trainees";
import type { TableColumn } from "../types/table";

const columns: TableColumn<Trainee>[] = [
  {
    id: "name",
    label: "Trainee Name",
    minWidth: 160,
    sortable: true,
    filter: { type: "autocomplete", options: trainees.map((trainee) => trainee.name) },
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
    filter: { type: "autocomplete", options: INSTRUCTORS },
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

interface RowActionsMenuProps {
  row: Trainee;
  onViewDetails: (row: Trainee) => void;
  onEdit: (row: Trainee) => void;
  onUpdateAttendance: (row: Trainee) => void;
  onDelete: (traineeId: number) => Promise<void>;
}

function RowActionsMenu({ row, onViewDetails, onEdit, onUpdateAttendance, onDelete }: RowActionsMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    onViewDetails(row);
    handleClose();
  };

  const handleEdit = () => {
    onEdit(row);
    handleClose();
  };

  const handleAttendanceClick = () => {
    onUpdateAttendance(row);
    handleClose();
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      await onDelete(row.id);
    }
    handleClose();
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? "action-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleAttendanceClick}>
          <HowToRegIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
          Update Attendance
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

export default function UsersPage() {
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [detailsTrainee, setDetailsTrainee] = React.useState<Trainee | null>(null);
  const [editTrainee, setEditTrainee] = React.useState<Trainee | null>(null);
  const [attendanceTrainee, setAttendanceTrainee] = React.useState<Trainee | null>(null);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const handleEditSave = async (traineeId: number, updates: Partial<Trainee>) => {
    try {
      setSaveError(null);
      await updateTrainee(traineeId, updates);
      setRefreshToken((v) => v + 1);
      setEditTrainee(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to update lesson");
    }
  };

  const handleAttendanceSave = async (traineeId: number, status: string) => {
    try {
      setSaveError(null);
      await updateAttendanceStatus(traineeId, status);
      setRefreshToken((v) => v + 1);
      setAttendanceTrainee(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to update attendance");
      throw error;
    }
  };

  const handleDelete = async (traineeId: number) => {
    try {
      setSaveError(null);
      await deleteTrainee(traineeId);
      setRefreshToken((v) => v + 1);
      setEditTrainee(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to delete lesson");
    }
  };

  const handleRegisterLesson = async (input: Omit<Trainee, "id">) => {
    try {
      setSaveError(null);
      await createTrainee(input);
      setRefreshToken((v) => v + 1);
      setRegisterOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to register lesson");
    }
  };

  const handleDeleteFromRow = async (traineeId: number) => {
    try {
      setSaveError(null);
      await deleteTrainee(traineeId);
      setRefreshToken((v) => v + 1);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to delete lesson");
    }
  };

  const renderActions = (row: Trainee) => (
    <RowActionsMenu
      row={row}
      onViewDetails={setDetailsTrainee}
      onEdit={setEditTrainee}
      onUpdateAttendance={setAttendanceTrainee}
      onDelete={handleDeleteFromRow}
    />
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack
        spacing={1.5}
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Training Schedule
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setRegisterOpen(true)}>
          Register Lesson
        </Button>
      </Stack>

      {saveError && (
        <Alert
          severity="error"
          onClose={() => setSaveError(null)}
          sx={{ mb: 2 }}
        >
          {saveError}
        </Alert>
      )}

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

      <EditTraineeModal
        trainee={editTrainee}
        open={Boolean(editTrainee)}
        onClose={() => setEditTrainee(null)}
        onSave={handleEditSave}
        onDelete={handleDelete}
      />

      <AttendanceModal
        trainee={attendanceTrainee}
        open={Boolean(attendanceTrainee)}
        onClose={() => setAttendanceTrainee(null)}
        onSave={handleAttendanceSave}
      />

      <RegisterLessonModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSave={handleRegisterLesson}
      />
    </Box>
  );
}