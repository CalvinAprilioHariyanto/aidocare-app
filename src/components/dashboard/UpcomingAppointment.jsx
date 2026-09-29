import { Link } from 'react-router-dom';
import { mockUpcomingAppointment } from '../../data/dashboardData';

function formatAppointmentDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const statusColors = {
  confirmed: 'bg-success-light text-success',
  pending: 'bg-warning-light text-warning',
  cancelled: 'bg-error-light text-error',
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted mb-4">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
      <p className="text-sm font-medium text-text-primary">No upcoming appointments</p>
      <p className="text-xs text-text-muted mt-1 mb-4">Book a consultation with a specialist.</p>
      <Link
        to="/patient/find-doctor"
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
      >
        Find a Doctor
      </Link>
    </div>
  );
}

export function UpcomingAppointment() {
  const appointment = mockUpcomingAppointment;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
        <h2 className="text-base font-semibold text-text-primary">Upcoming Appointment</h2>
        <Link to="/patient/appointments" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {!appointment ? (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <EmptyState />
        </div>
      ) : (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="flex flex-col gap-4 rounded-lg border border-border-light bg-surface-muted/40 p-4">
            {/* Status badge + date */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[appointment.status] || 'bg-surface-muted text-text-muted'}`}>
                {appointment.status}
              </span>
              <span className="text-xs text-text-muted">
                {formatAppointmentDate(appointment.date)} · {appointment.time}
              </span>
            </div>

            {/* Doctor info */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary shrink-0">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{appointment.doctorName}</p>
                <p className="text-xs text-text-muted">{appointment.specialty}</p>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {appointment.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94" />
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                {appointment.type}
              </span>
            </div>

            {/* CTA */}
            <Link
              to="/patient/appointments"
              className="mt-1 inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-muted hover:border-primary-200"
            >
              View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
