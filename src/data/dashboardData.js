// Mock data for the patient dashboard.
// This file centralizes all demo data so it can be swapped with API calls later.
// DO NOT treat this as a real data source in production.

export const mockUpcomingAppointment = {
  id: "APT-1001",
  doctorName: "Dr. Sarah Anderson",
  specialty: "General Medicine",
  date: "2026-10-02",
  time: "14:00",
  type: "In-Person Consultation",
  status: "confirmed",
  location: "Aido Care Clinic — Room 204",
};

export const mockRecentActivity = [
  {
    id: "ACT-001",
    type: "consultation",
    title: "Consultation completed",
    description: "General checkup with Dr. Sarah Anderson",
    date: "2026-09-25",
    icon: "consultation",
  },
  {
    id: "ACT-002",
    type: "prescription",
    title: "Prescription issued",
    description: "Amoxicillin 500mg — 7 days",
    date: "2026-09-25",
    icon: "prescription",
  },
  {
    id: "ACT-003",
    type: "lab",
    title: "Lab results available",
    description: "Complete Blood Count (CBC)",
    date: "2026-09-20",
    icon: "lab",
  },
  {
    id: "ACT-004",
    type: "record",
    title: "Medical record updated",
    description: "Allergy information added to your profile",
    date: "2026-09-18",
    icon: "record",
  },
];

export const mockHealthMetrics = {
  bloodPressure: { systolic: 120, diastolic: 78, unit: "mmHg", status: "normal" },
  heartRate: { value: 72, unit: "bpm", status: "normal" },
  weight: { value: 68, unit: "kg", status: "normal" },
  bmi: { value: 22.1, unit: "kg/m²", status: "normal" },
};

export const mockHealthTips = [
  {
    id: "TIP-001",
    title: "Stay hydrated",
    body: "Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.",
    tag: "Wellness",
  },
  {
    id: "TIP-002",
    title: "Schedule regular checkups",
    body: "Preventive health screenings can detect issues early. Visit your doctor at least once a year.",
    tag: "Prevention",
  },
];

// Derives profile completion percentage from the user object.
// Extend this list as more profile fields are added.
export function getProfileCompletion(user) {
  if (!user) return { percent: 0, missing: [] };

  const fields = [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone number" },
    { key: "dateOfBirth", label: "Date of birth" },
    { key: "gender", label: "Gender" },
    { key: "bloodType", label: "Blood type" },
  ];

  const filled = fields.filter((f) => {
    const val = user[f.key];
    return val !== undefined && val !== null && val !== "";
  });

  const missing = fields
    .filter((f) => {
      const val = user[f.key];
      return val === undefined || val === null || val === "";
    })
    .map((f) => f.label);

  const percent = Math.round((filled.length / fields.length) * 100);
  return { percent, missing };
}
