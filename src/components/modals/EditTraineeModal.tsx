import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Trainee } from "../../data/trainees";
import { LESSON_STATUSES, ATTENDANCE_STATUSES } from "../../data/trainees";

interface EditTraineeModalProps {
  trainee: Trainee | null;
  open: boolean;
  onClose: () => void;
  onSave: (traineeId: number, updates: Partial<Trainee>) => Promise<void>;
  onDelete: (traineeId: number) => Promise<void>;
}

function to12Hour(time24: string): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${mStr} ${period}`;
}

function to24Hour(time12: string): string {
  if (!time12) return "";
  const [time, period] = time12.split(" ");
  let [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${mStr}`;
}

function EditTraineeModal({
  trainee,
  open,
  onClose,
  onSave,
  onDelete,
}: EditTraineeModalProps) {
  const [name, setName] = React.useState("");
  const [lessonDate, setLessonDate] = React.useState("");
  const [rawTime, setRawTime] = React.useState("");
  const [attendanceStatus, setAttendanceStatus] = React.useState("");
  const [lessonStatus, setLessonStatus] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && trainee) {
      setName(trainee.name);
      setLessonDate(trainee.lessonDate);
      setRawTime(to24Hour(trainee.lessonTime));
      setAttendanceStatus(trainee.attendanceStatus);
      setLessonStatus(trainee.lessonStatus);
      setErrors({});
      setLoading(false);
    }
  }, [open, trainee]);

  const handleSave = async () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "Trainee name is required.";
    if (!lessonDate) nextErrors.lessonDate = "Lesson date is required.";
    if (!rawTime) nextErrors.lessonTime = "Lesson time is required.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (trainee) {
      try {
        setLoading(true);
        await onSave(trainee.id, {
          name: name.trim(),
          lessonDate,
          lessonTime: to12Hour(rawTime),
          attendanceStatus,
          lessonStatus,
        });
        onClose();
      } catch (error) {
        setErrors({ submit: error instanceof Error ? error.message : "Failed to save" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!trainee || !window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      setLoading(true);
      await onDelete(trainee.id);
      onClose();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Failed to delete" });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Lesson</DialogTitle>
      <DialogContent>
        {trainee && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Trainee Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              error={Boolean(errors.name)}
              helperText={errors.name || " "}
              disabled={loading}
            />

            <TextField
              type="date"
              label="Lesson Date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={lessonDate}
              onChange={(e) => {
                setLessonDate(e.target.value);
                if (e.target.value) {
                  setErrors((prev) => ({ ...prev, lessonDate: "" }));
                }
              }}
              error={Boolean(errors.lessonDate)}
              helperText={errors.lessonDate || " "}
              disabled={loading}
            />

            <TextField
              type="time"
              label="Lesson Time"
              slotProps={{ inputLabel: { shrink: true } }}
              value={rawTime}
              onChange={(e) => {
                setRawTime(e.target.value);
                if (e.target.value) {
                  setErrors((prev) => ({ ...prev, lessonTime: "" }));
                }
              }}
              error={Boolean(errors.lessonTime)}
              helperText={errors.lessonTime || " "}
              disabled={loading}
            />

            <TextField
              select
              label="Attendance"
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
              disabled={loading}
            >
              {ATTENDANCE_STATUSES.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Lesson Status"
              value={lessonStatus}
              onChange={(e) => setLessonStatus(e.target.value)}
              disabled={loading}
            >
              {LESSON_STATUSES.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            {errors.submit && (
              <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>
                {errors.submit}
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditTraineeModal;
