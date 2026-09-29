import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAppointments } from '../context/AppointmentContext';
import { getDoctorById } from '../data/doctors';

const statusColors = {
  confirmed: 'bg-success-light text-success',
  pending: 'bg-warning-light text-warning',
  cancelled: 'bg-error-light text-error',
  completed: 'bg-surface-muted text-text-muted',
};

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function getAvailableDates(doctor, count = 14) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; dates.length < count && i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();
    if (doctor.availability[dayOfWeek]) {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      dates.push({ date: `${y}-${mo}-${da}`, dayOfWeek, label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) });
    }
  }
  return dates;
}

export function AppointmentDetailPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { appointments, rescheduleAppointment, cancelAppointment } = useAppointments();

  const appointment = appointments.find((a) => a.id === appointmentId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState('');

  const doctor = appointment ? getDoctorById(appointment.doctorId) : null;
  const availableDates = useMemo(() => (doctor ? getAvailableDates(doctor) : []), [doctor]);
  const rescheduleSlots = useMemo(() => {
    if (!doctor || !rescheduleDate) return [];
    return doctor.availability[rescheduleDate.dayOfWeek] || [];
  }, [doctor, rescheduleDate]);

  if (!appointment) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-text-primary">Appointment not found</p>
          <Link to="/patient/appointments" className="mt-4 text-sm font-medium text-primary hover:underline">← Back to appointments</Link>
        </div>
      </DashboardLayout>
    );
  }

  function handleCancel() {
    cancelAppointment(appointment.id);
    setShowCancelModal(false);
  }

  function handleReschedule() {
    if (rescheduleDate && rescheduleTime) {
      rescheduleAppointment(appointment.id, rescheduleDate.date, rescheduleTime);
      setShowRescheduleModal(false);
      setRescheduleDate(null);
      setRescheduleTime('');
    }
  }

  const isActive = appointment.status === 'confirmed' || appointment.status === 'pending';

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Back link */}
        <Link to="/patient/appointments" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary transition-colors self-start">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back to appointments
        </Link>

        {/* Main card */}
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-base font-bold text-primary">
                {appointment.doctorName?.split(' ').slice(1).map((n) => n[0]).join('') || '?'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">{appointment.doctorName}</h1>
                <p className="text-sm text-text-muted">{appointment.specialty}</p>
              </div>
            </div>
            <span className={`self-start inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${statusColors[appointment.status] || 'bg-surface-muted text-text-muted'}`}>
              {appointment.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Date</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{formatDate(appointment.date)}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Time</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{formatTime(appointment.time)}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Consultation Type</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{appointment.consultationType}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Location</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{appointment.location}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Appointment ID</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{appointment.id}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Booked On</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{new Date(appointment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Actions */}
          {isActive && (
            <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary-200 hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                Reschedule
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-error/30 bg-surface px-5 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error-light"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                Cancel Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCancelModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-light">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-error" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
            </div>
            <h2 className="text-lg font-bold text-text-primary">Cancel Appointment?</h2>
            <p className="mt-2 text-sm text-text-muted">Are you sure you want to cancel your appointment with {appointment.doctorName}? This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowCancelModal(false)} className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary-200">Keep Appointment</button>
              <button type="button" onClick={handleCancel} className="flex-1 rounded-xl bg-error px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">Cancel Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowRescheduleModal(false)}>
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text-primary">Reschedule Appointment</h2>
            <p className="mt-1 text-sm text-text-muted">Select a new date and time for your appointment.</p>

            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-text-secondary">Select Date</p>
              <div className="flex flex-wrap gap-2">
                {availableDates.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => { setRescheduleDate(d); setRescheduleTime(''); }}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${rescheduleDate?.date === d.date ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text-primary hover:border-primary-300'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {rescheduleDate && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-text-secondary">Select Time — {rescheduleDate.label}</p>
                <div className="flex flex-wrap gap-2">
                  {rescheduleSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setRescheduleTime(time)}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${rescheduleTime === time ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text-primary hover:border-primary-300'}`}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowRescheduleModal(false)} className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary-200">Cancel</button>
              <button
                type="button"
                onClick={handleReschedule}
                disabled={!rescheduleDate || !rescheduleTime}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
