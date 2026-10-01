import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPatients } from '../services/doctorService';

const icons = {
  search: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  spinner: (
    <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

function age(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function DoctorPatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    listPatients()
      .then(data => { if (active) setPatients(data.patients || []); })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(p => {
      const name = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
      const email = p.user?.email?.toLowerCase() || '';
      return name.includes(q) || email.includes(q);
    });
  }, [patients, search]);

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Patients</h1>
          <p className="mt-1 text-sm text-text-secondary">View and manage patients you have seen.</p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between bg-surface-muted/50">
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
            {icons.search}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patients by name or email…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
            />
          </div>
          <div className="flex items-center gap-2">
            {!loading && (
              <span className="text-xs font-semibold text-text-muted">
                {filtered.length} patient{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            {icons.spinner}
            <span className="ml-2 text-sm text-text-muted">Loading patients…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-error">{error}</p>
            <button
              onClick={() => { setLoading(true); listPatients().then(d => setPatients(d.patients || [])).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-muted">
              {icons.user}
            </div>
            <p className="text-sm font-semibold text-text-primary">
              {search ? 'No patients match your search' : 'No patients found'}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {search ? 'Try a different name or email.' : 'Patients will appear here once they book an appointment with you.'}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted/30 text-xs font-bold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Age / Gender</th>
                  <th className="px-6 py-4">Last Visit</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(patient => {
                  const name = `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown';
                  const patientAge = age(patient.dateOfBirth);
                  const initials = `${patient.firstName?.[0] || ''}${patient.lastName?.[0] || ''}`.toUpperCase() || '?';

                  return (
                    <tr key={patient.id} className="transition-colors hover:bg-surface-muted/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-xs font-bold text-primary">
                            {initials}
                          </div>
                          <span className="font-bold text-text-primary">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{patient.user?.email || '—'}</td>
                      <td className="px-6 py-4 text-text-secondary">
                        {patientAge ? `${patientAge} yrs` : '—'}
                        {patient.gender ? ` · ${patient.gender}` : ''}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{fmtDate(patient.lastVisit)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
