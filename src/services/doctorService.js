const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://aidocare-backend-production.up.railway.app');

function getAuthToken() {
  return localStorage.getItem('aido_token') || sessionStorage.getItem('aido_token');
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error(`Network error during request to ${path}:`, error);
    throw new Error('Unable to connect to the server. Please check your connection.', { cause: error });
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // empty response
  }

  if (!response.ok) {
    const message = data.error?.message || data.message || `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
}

// ── Doctor Account ─────────────────────────────────────────────

export async function getDoctorAccount() {
  const data = await request('/api/doctor/account');
  return data.doctor;
}

export async function updateDoctorAccount(payload) {
  const data = await request('/api/doctor/account', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data.doctor;
}

export async function getDoctorSchedules() {
  const data = await request('/api/doctor/schedules');
  return data.schedules || [];
}

// ── Doctor Directory ───────────────────────────────────────────

export async function listDoctors({ search = '', specialty = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (specialty) params.append('specialty', specialty);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const data = await request(`/api/doctors${queryStr}`);
  return data.doctors || [];
}

export async function getDoctor(id) {
  const data = await request(`/api/doctors/${id}`);
  return data.doctor;
}

export const getDoctorById = getDoctor;

// ── Patients ──────────────────────────────────────────────────

export async function listPatients() {
  const data = await request('/api/patients');
  return { patients: data.patients || [] };
}

export async function getPatient(patientId) {
  const data = await request(`/api/patients/${patientId}`);
  return { patient: data.patient };
}

// ── Medical Records ───────────────────────────────────────────

export async function listMedicalRecords(patientId, { includeArchived = false } = {}) {
  const queryStr = includeArchived ? '?includeArchived=true' : '';
  const data = await request(`/api/patients/${patientId}/records${queryStr}`);
  return { records: data.records || [] };
}

export async function getMedicalRecord(patientId, recordId) {
  const data = await request(`/api/patients/${patientId}/records/${recordId}`);
  return { record: data.record };
}

export async function createMedicalRecord(patientId, data) {
  const res = await request(`/api/patients/${patientId}/records`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { record: res.record };
}

export async function updateMedicalRecord(patientId, recordId, data) {
  const res = await request(`/api/patients/${patientId}/records/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return { record: res.record };
}

export async function archiveMedicalRecord(patientId, recordId) {
  const res = await request(`/api/patients/${patientId}/records/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'ARCHIVED' }),
  });
  return { record: res.record };
}

// ── Prescriptions ─────────────────────────────────────────────

export async function listPrescriptions(patientId) {
  const { records } = await listMedicalRecords(patientId, { includeArchived: true });
  const allPrescriptions = [];

  for (const record of records) {
    if (Array.isArray(record.prescriptions)) {
      for (const rx of record.prescriptions) {
        allPrescriptions.push({
          ...rx,
          medicalRecordId: record.id,
          medicalRecord: { id: record.id, title: record.title },
        });
      }
    }
  }

  return { prescriptions: allPrescriptions };
}

export async function getPrescription(patientId, prescriptionId) {
  const { prescriptions } = await listPrescriptions(patientId);
  const found = prescriptions.find((p) => p.id === prescriptionId);
  if (!found) throw new Error('Prescription not found');
  return { prescription: found };
}

export async function createPrescription(patientId, data) {
  // If target medicalRecordId is provided, update that record's prescriptions
  let targetRecordId = data.medicalRecordId;

  if (targetRecordId) {
    const { record } = await getMedicalRecord(patientId, targetRecordId);
    const existingRx = record.prescriptions || [];
    const newRx = {
      id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    const updated = await updateMedicalRecord(patientId, targetRecordId, {
      prescriptions: [...existingRx, newRx],
    });
    return { prescription: newRx, record: updated.record };
  }

  // Otherwise, create a new medical record for this prescription
  const newRx = {
    id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...data,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  const { record } = await createMedicalRecord(patientId, {
    title: `Prescription: ${data.medication || 'Medication'}`,
    content: `Prescription issued: ${data.medication || ''} (${data.dosage || ''}, ${data.frequency || ''}).`,
    prescriptions: [newRx],
  });

  return { prescription: newRx, record };
}

export async function updatePrescription(patientId, prescriptionId, data) {
  const { records } = await listMedicalRecords(patientId, { includeArchived: true });
  const parentRecord = records.find((r) => (r.prescriptions || []).some((p) => p.id === prescriptionId));

  if (!parentRecord) throw new Error('Prescription not found');

  const updatedRxList = parentRecord.prescriptions.map((p) =>
    p.id === prescriptionId ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
  );

  const updatedRecord = await updateMedicalRecord(patientId, parentRecord.id, {
    prescriptions: updatedRxList,
  });

  const updatedRx = updatedRecord.record.prescriptions.find((p) => p.id === prescriptionId);
  return { prescription: updatedRx };
}

export async function discontinuePrescription(patientId, prescriptionId) {
  return updatePrescription(patientId, prescriptionId, { status: 'DISCONTINUED' });
}

export async function listPrescriptionsByRecord(patientId, recordId) {
  const { record } = await getMedicalRecord(patientId, recordId);
  return { prescriptions: record.prescriptions || [] };
}
