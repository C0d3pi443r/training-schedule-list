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
} from "@mui/material";

import type { Trainee } from "../../data/trainees";
import { ATTENDANCE_STATUSES } from "../../data/trainees";

interface AttendanceModalProps {
  trainee: Trainee | null;
  open: boolean;
  onClose: () => void;
  onSave: (traineeId: number, status: string) => void;
}

function AttendanceModal({ trainee, open, onClose, onSave }: AttendanceModalProps) {
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open && trainee) {
      setStatus(trainee.attendanceStatus);
      setError("");
    }
  }, [open, trainee]);

  const handleSave = () => {
    if (!status) {
      setError("Please select an attendance status.");
      return;
    }
    if (trainee) {
      onSave(trainee.id, status);
    }
    onClose();
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AttendanceModal;