import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Chip } from "@mui/material";

import type { Trainee } from "../../data/trainees";

interface LessonDetailsModalProps {
  trainee: Trainee | null;
  open: boolean;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
    </Stack>
  );
}

function LessonDetailsModal({ trainee, open, onClose }: LessonDetailsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Lesson Details</DialogTitle>
      <DialogContent>
        {trainee && (
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <DetailRow label="Trainee" value={trainee.name} />
            <DetailRow label="Date" value={trainee.lessonDate} />
            <DetailRow label="Time" value={trainee.lessonTime} />
            <DetailRow label="Instructor" value={trainee.instructor} />
            <DetailRow label="Vehicle / Bus" value={trainee.vehicle} />

            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography color="text.secondary">Lesson Status</Typography>
              <Chip label={trainee.lessonStatus} size="small" />
            </Stack>

            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography color="text.secondary">Attendance</Typography>
              <Chip label={trainee.attendanceStatus} size="small" />
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LessonDetailsModal;