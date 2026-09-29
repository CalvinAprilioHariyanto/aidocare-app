import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAppointments } from '../context/AppointmentContext';

const statusColors = {
  confirmed: 'bg-success-light text-success',
  pending: 'bg-warning-light text-warning',
  cancelled: 'bg-error-light text-error',
  completed: 'bg-surface-muted text-text-muted',
};

const filterOptions = ['all', 'confirmed', 'completed', 'cancelled'];

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function AppointmentsPage() {
  const { appointments } = useAppointments();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const sorted = [...appointments].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
    if (filter === 'all') return sorted;
    return sorted.filter((apt) => apt.status === filter);
  }, [appointments, filter]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Appointments</h1>
            <p className="mt-1 text-sm text-text-muted">Manage and view your appointment history.</p>
          </div>
          <Link
            to="/patient/find-doctor"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            New Appointment
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg bg-surface-muted p-1">
          {filterOptions.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-surface text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            </div>
            <p className="text-sm font-medium text-text-primary">No appointments found</p>
            <p className="mt-1 text-xs text-text-muted">
              {filter === 'all' ? 'Book your first appointment with a doctor.' : `No ${filter} appointments.`}
            </p>
            {filter === 'all' && (
              <Link to="/patient/find-doctor" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800">
                Find a Doctor
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((apt) => (
              <Link
                key={apt.id}
                to={`/patient/appointments/${apt.id}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary-200 hover:shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">
                    {apt.doctorName?.split(' ').slice(1).map((n) => n[0]).join('') || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{apt.doctorName}</p>
                    <p className="text-xs text-text-muted">{apt.specialty}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted sm:gap-4">
                  <span>{formatDate(apt.date)}</span>
                  <span>{formatTime(apt.time)}</span>
                  <span>{apt.consultationType}</span>
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[apt.status] || 'bg-surface-muted text-text-muted'}`}>
                    {apt.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
