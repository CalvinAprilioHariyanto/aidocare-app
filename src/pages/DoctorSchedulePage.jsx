import { useState, useEffect } from 'react';
import { getDoctorSchedules } from '../services/doctorService';
import { listAppointments } from '../services/appointmentService';

export function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      getDoctorSchedules().catch(() => []),
      listAppointments().catch(() => []),
    ])
      .then(([schedData, aptData]) => {
        if (active) {
          setSchedules(schedData || []);
          setAppointments(aptData || []);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Doctor Schedule</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your working hours and upcoming appointments.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-[1.5rem] border border-border bg-surface py-24 text-center">
          <svg className="h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
          <span className="ml-3 text-sm font-medium text-text-primary">Loading schedule…</span>
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-error-200 bg-error-50 p-6 text-center text-sm text-error">
          <p className="font-semibold">Unable to load doctor schedule</p>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Weekly Working Hours Panel */}
          <div className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-text-primary">Weekly Working Hours</h2>
            <p className="text-xs text-text-muted mt-0.5 mb-4">Configured working slots registered in your clinic profile.</p>

            {schedules.length === 0 ? (
              <p className="text-sm text-text-muted py-4">No working schedules registered yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {schedules.map((s) => (
                  <div key={s.id} className="rounded-xl border border-border bg-surface-muted/50 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary tracking-wide uppercase">{s.dayOfWeek}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.isActive ? 'bg-success-light text-success' : 'bg-surface-muted text-text-muted'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-semibold text-text-primary">
                      {s.startTime} – {s.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments & Schedule View */}
          <div className="rounded-[1.5rem] border border-border bg-surface shadow-sm overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-text-primary">{todayStr}</h2>
                <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary">
                  {appointments.length} Consultations
                </span>
              </div>
            </div>

            {/* Appointment List in Schedule */}
            {appointments.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-medium text-text-primary">No appointments scheduled</p>
                <p className="mt-1 text-xs text-text-muted">New bookings from patients will appear here in real time.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {appointments.map((apt) => {
                  const patName = apt.patient ? `${apt.patient.firstName || 'Patient'} ${apt.patient.lastName || ''}`.trim() : 'Patient';
                  return (
                    <div key={apt.id} className="flex flex-col gap-3 p-4 hover:bg-surface-muted/30 transition sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xs font-bold text-primary">
                          {patName[0] || 'P'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{patName}</p>
                          <p className="text-xs text-text-muted">
                            {apt.date} · {apt.time} · {apt.consultationType || 'Consultation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        {apt.queueNumber && (
                          <span className="font-semibold text-text-muted">Queue #{apt.queueNumber}</span>
                        )}
                        <span className={`rounded-md px-2.5 py-1 font-semibold uppercase text-[11px] ${
                          apt.status === 'confirmed' ? 'bg-success-light text-success' :
                          apt.status === 'cancelled' ? 'bg-error-light text-error' :
                          'bg-surface-muted text-text-muted'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
