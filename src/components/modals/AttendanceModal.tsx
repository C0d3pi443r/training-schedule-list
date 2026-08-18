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
  Typography,
  CircularProgress,
} from "@mui/material";

import type { Trainee } from "../../data/trainees";
import { ATTENDANCE_STATUSES } from "../../data/trainees";

interface AttendanceModalProps {
  trainee: Trainee | null;
  open: boolean;
  onClose: () => void;
  onSave: (traineeId: number, status: string) => Promise<void>;
}

function AttendanceModal({ trainee, open, onClose, onSave }: AttendanceModalProps) {
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && trainee) {
      setStatus(trainee.attendanceStatus);
      setError("");
      setLoading(false);
    }
  }, [open, trainee]);

  const handleSave = async () => {
    if (!status) {
      setError("Please select an attendance status.");
      return;
    }
    if (trainee) {
      try {
        setLoading(true);
        await onSave(trainee.id, status);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save attendance");
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Update Attendance</DialogTitle>
      <DialogContent>
        {trainee && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography color="text.secondary">
              {trainee.name} — {trainee.lessonDate} at {trainee.lessonTime}
            </Typography>

            <TextField
              select
              label="Attendance Status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                if (e.target.value) setError("");
              }}
              error={Boolean(error)}
              helperText={error || " "}
            >
              {ATTENDANCE_STATUSES.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
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

export default AttendanceModal;