import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAppointments } from '../context/AppointmentContext';
import { getDoctor } from '../services/doctorService';

const statusColors = {
  confirmed: 'bg-success-light text-success',
  pending: 'bg-warning-light text-warning',
  cancelled: 'bg-error-light text-error',
  completed: 'bg-surface-muted text-text-muted',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time) {
  if (!time) return '—';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function getAvailableDates(doctor, count = 14) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const availability = doctor?.availability || {};
  for (let i = 1; dates.length < count && i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();
    if (availability[dayOfWeek] && availability[dayOfWeek].length > 0) {
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
  const { appointments, rescheduleAppointment, cancelAppointment } = useAppointments();

  const appointment = appointments.find((a) => a.id === appointmentId);

  const [doctor, setDoctor] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (appointment?.doctorId) {
      getDoctor(appointment.doctorId)
        .then((doc) => {
          if (active) setDoctor(doc);
        })
        .catch(() => {
          if (active) setDoctor(appointment.doctor || null);
        });
    }
    return () => {
      active = false;
    };
  }, [appointment?.doctorId, appointment?.doctor]);

  const availableDates = useMemo(() => (doctor ? getAvailableDates(doctor) : []), [doctor]);
  const rescheduleSlots = useMemo(() => {
    if (!doctor || !rescheduleDate) return [];
    return (doctor.availability && doctor.availability[rescheduleDate.dayOfWeek]) || [];
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

  const doctorName = appointment.doctorName || appointment.doctor?.name || `Dr. ${appointment.doctor?.firstName || 'Doctor'} ${appointment.doctor?.lastName || ''}`.trim();
  const specialty = appointment.specialty || appointment.doctor?.specialty || 'General Practice';
  const location = appointment.location || doctor?.location || 'Aido Care Clinic';

  async function handleCancel() {
    setActionLoading(true);
    setActionError('');
    try {
      await cancelAppointment(appointment.id);
      setShowCancelModal(false);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReschedule() {
    if (rescheduleDate && rescheduleTime) {
      setActionLoading(true);
      setActionError('');
      try {
        await rescheduleAppointment(appointment.id, rescheduleDate.date, rescheduleTime);
        setShowRescheduleModal(false);
        setRescheduleDate(null);
        setRescheduleTime('');
      } catch (err) {
        setActionError(err.message);
      } finally {
        setActionLoading(false);
      }
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
                {doctorName.split(' ').slice(1).map((n) => n[0]).join('') || 'DR'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">{doctorName}</h1>
                <p className="text-sm text-text-muted">{specialty}</p>
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
              <p className="mt-1 text-sm font-medium text-text-primary">{appointment.consultationType || 'General Consultation'}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Location</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{location}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Queue Number</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{appointment.queueNumber ? `#${appointment.queueNumber}` : '—'}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-muted">Appointment ID</p>
              <p className="mt-1 text-sm font-mono font-medium text-text-primary truncate">{appointment.id}</p>
            </div>
          </div>

          {/* Action buttons */}
          {isActive && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => {
                  setActionError('');
                  setShowRescheduleModal(true);
                }}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface-muted"
              >
                Reschedule
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionError('');
                  setShowCancelModal(true);
                }}
                className="rounded-xl border border-error-200 px-5 py-2.5 text-sm font-semibold text-error transition hover:bg-error-50"
              >
                Cancel Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
            <h3 className="text-lg font-bold text-text-primary">Cancel Appointment?</h3>
            <p className="mt-2 text-sm text-text-muted">
              Are you sure you want to cancel your appointment with {doctorName} on {formatDate(appointment.date)} at {formatTime(appointment.time)}?
            </p>
            {actionError && (
              <div className="mt-3 rounded-lg bg-error-50 p-3 text-xs text-error">
                {actionError}
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted disabled:opacity-50"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={actionLoading}
                className="rounded-xl bg-error px-4 py-2 text-sm font-semibold text-white hover:bg-error/90 disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-xl">
            <h3 className="text-lg font-bold text-text-primary">Reschedule Appointment</h3>
            <p className="mt-1 text-sm text-text-muted">Select a new date and time for your consultation.</p>

            {actionError && (
              <div className="mt-3 rounded-lg bg-error-50 p-3 text-xs text-error">
                {actionError}
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Select Date</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => {
                        setRescheduleDate(d);
                        setRescheduleTime('');
                      }}
                      className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${
                        rescheduleDate?.date === d.date
                          ? 'border-primary bg-primary text-white shadow-sm'
                          : 'border-border bg-surface text-text-primary hover:border-primary-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {rescheduleDate && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Select Time</label>
                  {rescheduleSlots.length === 0 ? (
                    <p className="mt-2 text-xs text-text-muted">No slots available for this day.</p>
                  ) : (
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {rescheduleSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setRescheduleTime(t)}
                          className={`rounded-lg border p-2 text-center text-xs font-medium transition ${
                            rescheduleTime === t
                              ? 'border-primary bg-primary text-white shadow-sm'
                              : 'border-border bg-surface text-text-primary hover:border-primary-300'
                          }`}
                        >
                          {formatTime(t)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                disabled={actionLoading}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReschedule}
                disabled={!rescheduleDate || !rescheduleTime || actionLoading}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? 'Updating…' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
