import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack, CircularProgress } from "@mui/material";

import type { Trainee } from "../../data/trainees";
import { INSTRUCTORS, VEHICLES } from "../../data/trainees";

export type LessonFormValues = Omit<Trainee, "id">;

interface RegisterLessonModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: LessonFormValues) => Promise<void>;
}

const EMPTY_FORM: LessonFormValues = {
  name: "",
  lessonDate: "",
  lessonTime: "",
  instructor: "",
  vehicle: "",
  lessonStatus: "Scheduled",
  attendanceStatus: "Not Recorded",
};

// Stored/displayed lesson times use "hh:mm AM/PM" (matches the rest of the data),
// but the native time input gives back 24-hour "HH:MM" — convert on submit.
function to12Hour(time24: string): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${mStr} ${period}`;
}

function RegisterLessonModal({ open, onClose, onSave }: RegisterLessonModalProps) {
  const [form, setForm] = React.useState<LessonFormValues>(EMPTY_FORM);
  const [rawTime, setRawTime] = React.useState("");
  const [errors, setErrors] = React.useState<Partial<Record<keyof LessonFormValues, string>>>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setRawTime("");
      setErrors({});
      setLoading(false);
    }
  }, [open]);

  const handleChange = (field: keyof LessonFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (value) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTimeChange = (value: string) => {
    setRawTime(value);
    handleChange("lessonTime", to12Hour(value));
  };

  const handleSubmit = async () => {
    const nextErrors: Partial<Record<keyof LessonFormValues, string>> = {};
    (Object.keys(form) as Array<keyof LessonFormValues>).forEach((field) => {
      if (!form[field]) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      await onSave(form);
    } catch (error) {
      setErrors({ name: error instanceof Error ? error.message : "Failed to register lesson" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Register Lesson</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Trainee Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name || " "}
          />

          <TextField
            type="date"
            label="Lesson Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={form.lessonDate}
            onChange={(e) => handleChange("lessonDate", e.target.value)}
            error={Boolean(errors.lessonDate)}
            helperText={errors.lessonDate || " "}
          />

          <TextField
            type="time"
            label="Lesson Time"
            slotProps={{ inputLabel: { shrink: true } }}
            value={rawTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            error={Boolean(errors.lessonTime)}
            helperText={errors.lessonTime || " "}
          />

          <TextField
            select
            label="Instructor"
            value={form.instructor}
            onChange={(e) => handleChange("instructor", e.target.value)}
            error={Boolean(errors.instructor)}
            helperText={errors.instructor || " "}
          >
            {INSTRUCTORS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Vehicle / Bus"
            value={form.vehicle}
            onChange={(e) => handleChange("vehicle", e.target.value)}
            error={Boolean(errors.vehicle)}
            helperText={errors.vehicle || " "}
          >
            {VEHICLES.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>


        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {loading ? "Registering..." : "Register"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegisterLessonModal;