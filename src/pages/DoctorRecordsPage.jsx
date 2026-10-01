import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPatients, listMedicalRecords } from '../services/doctorService';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function StatusBadge({ status }) {
  const map = {
    ACTIVE: 'bg-green-50 text-green-700 border-green-200',
    ARCHIVED: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${map[status] || map.ACTIVE}`}>
      {status}
    </span>
  );
}

const icons = {
  clipboard: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  spinner: (
    <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
    </svg>
  ),
};

export function DoctorRecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadAll() {
      try {
        setLoading(true);
        setError(null);

        // Get all patients this doctor has seen
        const patientsData = await listPatients();
        const patients = patientsData.patients || [];

        // Load records for each patient (active only)
        const recordsPerPatient = await Promise.all(
          patients.map(p =>
            listMedicalRecords(p.id).then(d => (d.records || []).map(r => ({
              ...r,
              patientName: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Unknown',
              patientId: p.id,
            }))).catch(() => [])
          )
        );

        if (active) {
          const allRecords = recordsPerPatient.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRecords(allRecords);
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAll();
    return () => { active = false; };
  }, []);

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Medical Records</h1>
        <p className="mt-1 text-sm text-text-secondary">Review and manage your patient medical records.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          {icons.spinner}
          <span className="ml-2 text-sm text-text-muted">Loading records…</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-muted">
            {icons.clipboard}
          </div>
          <p className="text-sm font-semibold text-text-primary">No medical records found</p>
          <p className="mt-1 text-xs text-text-muted">Open a patient's profile to create a medical record.</p>
          <button
            onClick={() => navigate('/doctor/patients')}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Go to Patients
          </button>
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="grid gap-4">
          {records.map(record => (
            <div
              key={record.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-[1.5rem] border border-border bg-surface p-5 shadow-sm transition hover:border-primary-200 hover:shadow-card cursor-pointer"
              onClick={() => navigate(`/doctor/patients/${record.patientId}`)}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-text-muted shrink-0">
                  {icons.clipboard}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base font-bold text-text-primary">{record.title}</h3>
                    <StatusBadge status={record.status} />
                  </div>
                  <p className="text-sm font-medium text-text-secondary">Patient: {record.patientName}</p>
                  {record.diagnosis && (
                    <p className="text-xs text-text-muted mt-0.5">Diagnosis: {record.diagnosis}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                    <span>{fmtDate(record.createdAt)}</span>
                    {record.prescriptions?.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-primary font-medium">{record.prescriptions.length} prescription{record.prescriptions.length !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="shrink-0 rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm font-bold text-text-primary transition hover:bg-surface hover:border-primary-200 hover:text-primary"
                onClick={e => { e.stopPropagation(); navigate(`/doctor/patients/${record.patientId}`); }}
              >
                View Patient →
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
