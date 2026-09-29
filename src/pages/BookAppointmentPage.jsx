import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { getDoctorById, consultationTypes } from '../data/doctors';
import { useAppointments } from '../context/AppointmentContext';

const STEPS = ['Date & Time', 'Consultation Type', 'Review', 'Confirmed'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.slice(0, 3).map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${i < current ? 'bg-success text-white' : i === current ? 'bg-primary text-white' : 'bg-surface-muted text-text-muted'}`}>
            {i < current ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              i + 1
            )}
          </div>
          <span className={`hidden text-xs font-medium sm:inline ${i === current ? 'text-text-primary' : 'text-text-muted'}`}>{label}</span>
          {i < 2 && <div className={`hidden h-px w-6 sm:block ${i < current ? 'bg-success' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
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

export function BookAppointmentPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { bookAppointment } = useAppointments();

  const doctorId = params.get('doctor');
  const doctor = getDoctorById(doctorId);

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDates = useMemo(() => (doctor ? getAvailableDates(doctor) : []), [doctor]);

  const timeSlots = useMemo(() => {
    if (!doctor || !selectedDate) return [];
    return doctor.availability[selectedDate.dayOfWeek] || [];
  }, [doctor, selectedDate]);

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-text-primary">No doctor selected</p>
          <Link to="/patient/find-doctor" className="mt-4 text-sm font-medium text-primary hover:underline">← Find a doctor</Link>
        </div>
      </DashboardLayout>
    );
  }

  function handleConfirm() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      const apt = bookAppointment({
        doctorId: doctor.id,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        specialty: doctor.specialty,
        date: selectedDate.date,
        time: selectedTime,
        consultationType: consultationTypes.find((t) => t.id === selectedType)?.label || selectedType,
        location: doctor.location,
      });
      setConfirmedAppointment(apt);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Step 3: Confirmation ---
  if (step === 3 && confirmedAppointment) {
    return (
      <DashboardLayout>
        <div className="mx-auto flex max-w-lg flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-success" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Appointment Confirmed!</h1>
          <p className="mt-2 text-sm text-text-muted">Your appointment has been successfully booked.</p>

          <div className="mt-8 w-full rounded-xl border border-border bg-surface p-5 text-left">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">{doctor.firstName[0]}{doctor.lastName[0]}</div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{confirmedAppointment.doctorName}</p>
                <p className="text-xs text-text-muted">{confirmedAppointment.specialty}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Date</span><span className="font-medium text-text-primary">{formatDate(confirmedAppointment.date)}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Time</span><span className="font-medium text-text-primary">{formatTime(confirmedAppointment.time)}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Type</span><span className="font-medium text-text-primary">{confirmedAppointment.consultationType}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Location</span><span className="font-medium text-text-primary">{confirmedAppointment.location}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Status</span><span className="inline-flex items-center rounded-md bg-success-light px-2 py-0.5 text-xs font-semibold capitalize text-success">{confirmedAppointment.status}</span></div>
            </div>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to={`/patient/appointments/${confirmedAppointment.id}`} className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800">View Appointment</Link>
            <Link to="/patient" className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-primary-200 hover:text-primary">Back to Dashboard</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const canProceedStep0 = selectedDate && selectedTime;
  const canProceedStep1 = selectedType;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to={`/patient/doctors/${doctor.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              Dr. {doctor.firstName} {doctor.lastName}
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-text-primary">Book Appointment</h1>
          </div>
          <StepIndicator current={step} />
        </div>

        {/* Doctor summary */}
        <div className="flex items-center gap-3.5 rounded-xl border border-border bg-surface p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">{doctor.firstName[0]}{doctor.lastName[0]}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">Dr. {doctor.firstName} {doctor.lastName}</p>
            <p className="text-xs text-text-muted">{doctor.specialty} · Rp {doctor.consultationFee.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          {/* --- Step 0: Date & Time --- */}
          {step === 0 && (
            <div>
              <h2 className="mb-1 text-base font-semibold text-text-primary">Select Date & Time</h2>
              <p className="mb-5 text-sm text-text-muted">Choose your preferred appointment date and time slot.</p>

              {/* Date selection */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-text-secondary">Available Dates</p>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => { setSelectedDate(d); setSelectedTime(''); }}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${selectedDate?.date === d.date ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text-primary hover:border-primary-300 hover:text-primary'}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selection */}
              {selectedDate && (
                <div>
                  <p className="mb-3 text-sm font-medium text-text-secondary">Available Times — {selectedDate.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${selectedTime === time ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text-primary hover:border-primary-300 hover:text-primary'}`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- Step 1: Consultation Type --- */}
          {step === 1 && (
            <div>
              <h2 className="mb-1 text-base font-semibold text-text-primary">Select Consultation Type</h2>
              <p className="mb-5 text-sm text-text-muted">Choose how you'd like to consult with the doctor.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {consultationTypes.map((ct) => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => setSelectedType(ct.id)}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${selectedType === ct.id ? 'border-primary bg-primary-50 ring-2 ring-primary/20' : 'border-border bg-surface hover:border-primary-300'}`}
                  >
                    <p className={`text-sm font-semibold ${selectedType === ct.id ? 'text-primary' : 'text-text-primary'}`}>{ct.label}</p>
                    <p className="mt-1 text-xs text-text-muted">{ct.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- Step 2: Review --- */}
          {step === 2 && (
            <div>
              <h2 className="mb-1 text-base font-semibold text-text-primary">Review Appointment</h2>
              <p className="mb-5 text-sm text-text-muted">Please confirm the details below before booking.</p>
              
              {error && (
                <div className="mb-5 rounded-lg border border-error/20 bg-error-light/50 p-4 text-sm font-medium text-error">
                  {error}
                </div>
              )}

              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-xs text-text-muted">Doctor</p>
                  <p className="mt-1 font-medium text-text-primary">Dr. {doctor.firstName} {doctor.lastName}</p>
                </div>
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-xs text-text-muted">Specialty</p>
                  <p className="mt-1 font-medium text-text-primary">{doctor.specialty}</p>
                </div>
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-xs text-text-muted">Date</p>
                  <p className="mt-1 font-medium text-text-primary">{formatDate(selectedDate.date)}</p>
                </div>
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-xs text-text-muted">Time</p>
                  <p className="mt-1 font-medium text-text-primary">{formatTime(selectedTime)}</p>
                </div>
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-xs text-text-muted">Consultation Type</p>
                  <p className="mt-1 font-medium text-text-primary">{consultationTypes.find((t) => t.id === selectedType)?.label}</p>
                </div>
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-xs text-text-muted">Location</p>
                  <p className="mt-1 font-medium text-text-primary">{doctor.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setStep((s) => Math.max(0, s - 1)); setError(''); }}
              disabled={step === 0 || isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary-200 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              Back
            </button>
            {step === 2 ? (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
