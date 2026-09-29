// Mock doctor directory for patient-facing pages.
// Reuses and extends the doctor in data/users.js (Dr. Sarah Anderson, DOC-001).

export const doctors = [
  {
    id: 'DOC-001',
    firstName: 'Sarah',
    lastName: 'Anderson',
    specialty: 'General Medicine',
    title: 'General Practitioner',
    experience: 8,
    rating: 4.9,
    reviewCount: 124,
    bio: 'Dr. Anderson has 8 years of experience in general medicine with a focus on preventive care and chronic disease management.',
    education: 'University of Indonesia, Faculty of Medicine',
    languages: ['English', 'Indonesian'],
    consultationFee: 150000,
    location: 'Aido Care Clinic — Room 204',
    availability: {
      // Day-of-week keys (0 = Sunday). Values are available time slots.
      1: ['09:00', '09:30', '10:00', '10:30', '13:00', '13:30', '14:00', '15:30'],
      2: ['09:00', '10:00', '10:30', '11:00', '13:00', '14:00', '15:00'],
      3: ['09:00', '09:30', '10:30', '13:00', '13:30', '15:30'],
      4: ['09:00', '10:00', '11:00', '13:00', '14:00', '14:30', '15:00'],
      5: ['09:00', '09:30', '10:00', '13:00', '14:00'],
    },
  },
  {
    id: 'DOC-002',
    firstName: 'Michael',
    lastName: 'Chen',
    specialty: 'Cardiology',
    title: 'Cardiologist',
    experience: 12,
    rating: 4.8,
    reviewCount: 98,
    bio: 'Dr. Chen specializes in cardiovascular health, with expertise in hypertension management and cardiac imaging.',
    education: 'Airlangga University, Faculty of Medicine',
    languages: ['English', 'Indonesian', 'Mandarin'],
    consultationFee: 250000,
    location: 'Aido Care Clinic — Room 310',
    availability: {
      1: ['10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
      3: ['09:00', '09:30', '10:00', '10:30', '14:00', '15:00'],
      5: ['10:00', '11:00', '14:00', '14:30'],
    },
  },
  {
    id: 'DOC-003',
    firstName: 'Emily',
    lastName: 'Wijaya',
    specialty: 'Dermatology',
    title: 'Dermatologist',
    experience: 6,
    rating: 4.7,
    reviewCount: 76,
    bio: 'Dr. Wijaya provides comprehensive skin care, from acne treatment to cosmetic dermatology procedures.',
    education: 'Universitas Gadjah Mada, Faculty of Medicine',
    languages: ['English', 'Indonesian'],
    consultationFee: 200000,
    location: 'Aido Care Clinic — Room 115',
    availability: {
      2: ['09:00', '09:30', '10:00', '11:00', '13:00', '14:00'],
      4: ['09:00', '10:00', '10:30', '13:00', '13:30', '14:00', '15:00'],
    },
  },
  {
    id: 'DOC-004',
    firstName: 'David',
    lastName: 'Pratama',
    specialty: 'Pediatrics',
    title: 'Pediatrician',
    experience: 10,
    rating: 4.9,
    reviewCount: 152,
    bio: 'Dr. Pratama is passionate about children\'s health and development, providing gentle and thorough care for young patients.',
    education: 'University of Indonesia, Faculty of Medicine',
    languages: ['English', 'Indonesian'],
    consultationFee: 180000,
    location: 'Aido Care Clinic — Room 208',
    availability: {
      1: ['08:30', '09:00', '09:30', '10:00', '10:30', '13:00', '14:00', '15:00'],
      2: ['09:00', '10:00', '13:00', '14:00', '15:00'],
      3: ['08:30', '09:00', '10:00', '13:00', '14:00'],
      4: ['09:00', '09:30', '10:00', '13:00', '14:00', '15:00'],
      5: ['09:00', '10:00', '13:00'],
    },
  },
  {
    id: 'DOC-005',
    firstName: 'Lisa',
    lastName: 'Hartono',
    specialty: 'Ophthalmology',
    title: 'Ophthalmologist',
    experience: 9,
    rating: 4.6,
    reviewCount: 64,
    bio: 'Dr. Hartono is an eye care specialist offering comprehensive vision exams and treatment for various eye conditions.',
    education: 'Padjadjaran University, Faculty of Medicine',
    languages: ['English', 'Indonesian'],
    consultationFee: 220000,
    location: 'Aido Care Clinic — Room 402',
    availability: {
      1: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      3: ['09:00', '10:00', '14:00', '15:00'],
      5: ['09:00', '10:00', '11:00', '14:00'],
    },
  },
];

export const specialties = [...new Set(doctors.map((d) => d.specialty))];

export function getDoctorById(id) {
  return doctors.find((d) => d.id === id) || null;
}

export const consultationTypes = [
  { id: 'general', label: 'General Consultation', description: 'Standard in-person visit for health concerns' },
  { id: 'follow-up', label: 'Follow-up Consultation', description: 'Revisit to review treatment progress' },
  { id: 'video', label: 'Video Consultation', description: 'Remote consultation via secure video call' },
];
