export interface Trainee {
  id: number;
  name: string;
  lessonDate: string;
  lessonTime: string;
  instructor: string;
  vehicle: string;
  lessonStatus: string;
  attendanceStatus: string;
}

const FIRST_NAMES = [
  "John", "Jane", "Michael", "Emily", "Chris", "Sarah", "David", "Laura",
  "James", "Anna", "Robert", "Maria", "Daniel", "Sophia", "Mark", "Olivia",
  "Paul", "Grace", "Kevin", "Nina",
];
const LAST_NAMES = [
  "Doe", "Smith", "Johnson", "Williams", "Brown",
  "Davis", "Miller", "Wilson", "Moore", "Taylor",
];

export const INSTRUCTORS = ["Michael Smith", "Robert Johnson", "John Williams"];
export const VEHICLES = ["Bus 01", "Bus 02", "Bus 03", "Vehicle 04"];
export const LESSON_STATUSES = ["Scheduled", "Completed", "Cancelled"];
export const ATTENDANCE_STATUSES = ["Not Recorded", "Present", "Absent", "Late", "Excused"];

const TIMES = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function buildDate(offsetDays: number): string {
  const base = new Date(2026, 7, 18);
  base.setDate(base.getDate() + offsetDays);
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
}

const TOTAL = 87;
export const trainees: Trainee[] = Array.from({ length: TOTAL }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];

  return {
    id: i + 1,
    name: `${first} ${last}`,
    lessonDate: buildDate(i % 20),
    lessonTime: TIMES[i % TIMES.length],
    instructor: INSTRUCTORS[i % INSTRUCTORS.length],
    vehicle: VEHICLES[i % VEHICLES.length],
    lessonStatus: LESSON_STATUSES[i % LESSON_STATUSES.length],
    attendanceStatus: ATTENDANCE_STATUSES[i % ATTENDANCE_STATUSES.length],
  };
});