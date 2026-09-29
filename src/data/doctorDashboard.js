// Mock data for the Doctor Dashboard.
// Follows the same pattern as data/users.js — static arrays for development only.

export const todayAppointments = [
  {
    id: 'APT-001',
    patientName: 'Michael Tan',
    patientInitials: 'MT',
    patientId: 'PAT-001',
    age: 32,
    gender: 'Male',
    type: 'General Consultation',
    time: '09:00',
    endTime: '09:30',
    status: 'confirmed',
    notes: 'Routine health check.',
  },
  {
    id: 'APT-002',
    patientName: 'Jessica Lee',
    patientInitials: 'JL',
    patientId: 'PAT-002',
    age: 29,
    gender: 'Female',
    type: 'Follow-up Consultation',
    time: '10:30',
    endTime: '11:00',
    status: 'confirmed',
    notes: 'Asthma follow-up after medication change.',
  },
  {
    id: 'APT-003',
    patientName: 'Daniel Wong',
    patientInitials: 'DW',
    patientId: 'PAT-003',
    age: 41,
    gender: 'Male',
    type: 'Video Consultation',
    time: '13:00',
    endTime: '13:30',
    status: 'pending',
    notes: 'Discussing hypertension management.',
  },
  {
    id: 'APT-004',
    patientName: 'Amanda Chen',
    patientInitials: 'AC',
    patientId: 'PAT-004',
    age: 27,
    gender: 'Female',
    type: 'General Consultation',
    time: '15:30',
    endTime: '16:00',
    status: 'completed',
    notes: 'Completed checkup.',
  },
];

export const patientsRequiringAttention = [
  {
    id: 'PAT-002',
    name: 'Jessica Lee',
    initials: 'JL',
    age: 29,
    gender: 'Female',
    bloodType: 'O+',
    allergy: 'Penicillin',
    condition: 'Asthma',
    medication: 'Salbutamol',
    reason: 'Follow-up consultation today',
    riskLevel: 'medium',
  },
  {
    id: 'PAT-003',
    name: 'Daniel Wong',
    initials: 'DW',
    age: 41,
    gender: 'Male',
    bloodType: 'A+',
    allergy: 'None reported',
    condition: 'Hypertension',
    medication: 'Amlodipine',
    reason: 'Pending consultation',
    riskLevel: 'high',
  },
];

export const upcomingAppointments = [
  {
    day: 'Tomorrow',
    appointments: [
      { id: 'UA-001', time: '08:30', patientName: 'Emily Carter', type: 'Routine Check-up', status: 'confirmed' },
      { id: 'UA-002', time: '11:00', patientName: 'Ryan Miller', type: 'Follow-up Consultation', status: 'confirmed' },
      { id: 'UA-003', time: '14:30', patientName: 'Sophia Nguyen', type: 'Video Consultation', status: 'pending' },
    ]
  },
  {
    day: 'Thursday',
    appointments: [
      { id: 'UA-004', time: '09:30', patientName: 'James Anderson', type: 'General Consultation', status: 'confirmed' },
      { id: 'UA-005', time: '13:00', patientName: 'Olivia Martin', type: 'Routine Check-up', status: 'confirmed' },
    ]
  }
];

export const recentActivities = [
  { id: 'ACT-001', time: '10:42', date: 'Today', description: 'Completed consultation with Amanda Chen' },
  { id: 'ACT-002', time: '09:18', date: 'Today', description: 'Appointment confirmed for Michael Tan' },
  { id: 'ACT-003', time: '16:30', date: 'Yesterday', description: 'Medical record updated for Jessica Lee' },
  { id: 'ACT-004', time: '14:12', date: 'Yesterday', description: 'New appointment request from Daniel Wong' },
];
