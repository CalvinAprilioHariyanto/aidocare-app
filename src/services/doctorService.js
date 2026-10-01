import { patientsRequiringAttention } from '../data/doctorDashboard';

/**
 * Doctor Service - FRONTEND ONLY MOCK
 * Simulates API calls using localStorage for Medical Records and Prescriptions.
 * Reads mock data for Patients.
 */

// --- Helpers to simulate network delay ---
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// --- LocalStorage keys ---
const RECORDS_KEY = 'aido_mock_medical_records';
const PRESCRIPTIONS_KEY = 'aido_mock_prescriptions';

function getStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Patients ──────────────────────────────────────────────────

export async function listPatients() {
  await delay();
  // Map mock dashboard patients to the format expected by DoctorPatientsPage
  const patients = patientsRequiringAttention.map(p => ({
    id: p.id,
    firstName: p.name.split(' ')[0],
    lastName: p.name.split(' ').slice(1).join(' '),
    user: { email: `${p.name.split(' ')[0].toLowerCase()}@example.com` },
    dateOfBirth: new Date(new Date().getFullYear() - p.age, 0, 1).toISOString(),
    gender: p.gender,
    allergies: p.allergy !== 'None reported' ? [p.allergy] : [],
    phone: '555-0198',
    lastVisit: new Date().toISOString(), // Mock recent visit
  }));
  return { patients };
}

export async function getPatient(patientId) {
  await delay();
  const res = await listPatients();
  const patient = res.patients.find(p => p.id === patientId);
  if (!patient) throw new Error('Patient not found');
  
  // Attach some mock appointments for the detail page
  patient.appointments = [
    {
      id: generateId(),
      appointmentDate: new Date().toISOString(),
      startTime: new Date().toISOString(),
      status: 'COMPLETED',
      queueNumber: 12
    }
  ];
  return { patient };
}

// ── Medical Records ───────────────────────────────────────────

export async function listMedicalRecords(patientId, { includeArchived = false } = {}) {
  await delay();
  let records = getStorage(RECORDS_KEY);
  
  if (patientId) {
    records = records.filter(r => r.patientId === patientId);
  }

  if (!includeArchived) {
    records = records.filter(r => r.status === 'ACTIVE');
  }

  // Also include prescriptions for each record
  const prescriptions = getStorage(PRESCRIPTIONS_KEY);
  records = records.map(r => ({
    ...r,
    prescriptions: prescriptions.filter(p => p.medicalRecordId === r.id)
  }));

  // Sort by createdAt descending
  records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return { records };
}

export async function getMedicalRecord(patientId, recordId) {
  await delay();
  const records = getStorage(RECORDS_KEY);
  const record = records.find(r => r.id === recordId && r.patientId === patientId);
  if (!record) throw new Error('Medical record not found');
  
  const prescriptions = getStorage(PRESCRIPTIONS_KEY).filter(p => p.medicalRecordId === record.id);
  record.prescriptions = prescriptions;

  return { record };
}

export async function createMedicalRecord(patientId, data) {
  await delay();
  const records = getStorage(RECORDS_KEY);
  
  const newRecord = {
    id: `MR-${generateId()}`,
    patientId,
    ...data,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  records.push(newRecord);
  setStorage(RECORDS_KEY, records);
  return { record: newRecord };
}

export async function updateMedicalRecord(patientId, recordId, data) {
  await delay();
  const records = getStorage(RECORDS_KEY);
  const idx = records.findIndex(r => r.id === recordId && r.patientId === patientId);
  
  if (idx === -1) throw new Error('Medical record not found');
  
  records[idx] = {
    ...records[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  setStorage(RECORDS_KEY, records);
  return { record: records[idx] };
}

export async function archiveMedicalRecord(patientId, recordId) {
  await delay();
  const records = getStorage(RECORDS_KEY);
  const idx = records.findIndex(r => r.id === recordId && r.patientId === patientId);
  
  if (idx === -1) throw new Error('Medical record not found');
  
  records[idx].status = 'ARCHIVED';
  records[idx].updatedAt = new Date().toISOString();
  
  setStorage(RECORDS_KEY, records);
  return { record: records[idx] };
}

// ── Prescriptions ─────────────────────────────────────────────

export async function listPrescriptions(patientId) {
  await delay();
  let prescriptions = getStorage(PRESCRIPTIONS_KEY);
  
  if (patientId) {
    prescriptions = prescriptions.filter(p => p.patientId === patientId);
  }

  // Attach medical record mock info if exists
  const records = getStorage(RECORDS_KEY);
  prescriptions = prescriptions.map(p => {
    const mr = records.find(r => r.id === p.medicalRecordId);
    return {
      ...p,
      medicalRecord: mr ? { id: mr.id, title: mr.title } : null
    };
  });

  prescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return { prescriptions };
}

export async function getPrescription(patientId, prescriptionId) {
  await delay();
  const prescriptions = getStorage(PRESCRIPTIONS_KEY);
  const prescription = prescriptions.find(p => p.id === prescriptionId && p.patientId === patientId);
  if (!prescription) throw new Error('Prescription not found');
  
  return { prescription };
}

export async function createPrescription(patientId, data) {
  await delay();
  const prescriptions = getStorage(PRESCRIPTIONS_KEY);
  
  const newPrescription = {
    id: `RX-${generateId()}`,
    patientId,
    ...data,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  prescriptions.push(newPrescription);
  setStorage(PRESCRIPTIONS_KEY, prescriptions);
  return { prescription: newPrescription };
}

export async function updatePrescription(patientId, prescriptionId, data) {
  await delay();
  const prescriptions = getStorage(PRESCRIPTIONS_KEY);
  const idx = prescriptions.findIndex(p => p.id === prescriptionId && p.patientId === patientId);
  
  if (idx === -1) throw new Error('Prescription not found');
  
  prescriptions[idx] = {
    ...prescriptions[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  setStorage(PRESCRIPTIONS_KEY, prescriptions);
  return { prescription: prescriptions[idx] };
}

export async function discontinuePrescription(patientId, prescriptionId) {
  await delay();
  const prescriptions = getStorage(PRESCRIPTIONS_KEY);
  const idx = prescriptions.findIndex(p => p.id === prescriptionId && p.patientId === patientId);
  
  if (idx === -1) throw new Error('Prescription not found');
  
  prescriptions[idx].status = 'DISCONTINUED';
  prescriptions[idx].updatedAt = new Date().toISOString();
  
  setStorage(PRESCRIPTIONS_KEY, prescriptions);
  return { prescription: prescriptions[idx] };
}

export async function listPrescriptionsByRecord(recordId) {
  await delay();
  let prescriptions = getStorage(PRESCRIPTIONS_KEY).filter(p => p.medicalRecordId === recordId);
  return { prescriptions };
}
