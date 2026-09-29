import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { todayAppointments, patientsRequiringAttention, upcomingAppointments, recentActivities } from '../data/doctorDashboard';

/* ─── Icon Library (consistent stroke style: 1.8 weight, round caps) ─── */
const icons = {
  calendar: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  stethoscope: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  clipboardList: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
    </svg>
  ),
  heartPulse: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  ),
  arrowRightCircle: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/>
    </svg>
  ),
};

/* ─── Status badge helper ─── */
const statusConfig = {
  completed: { label: 'Completed', dotColor: 'bg-[var(--color-status-completed)]', textColor: 'text-[var(--color-status-completed)]', bgColor: 'bg-slate-50' },
  confirmed: { label: 'Confirmed', dotColor: 'bg-[var(--color-status-confirmed)]', textColor: 'text-[var(--color-status-confirmed)]', bgColor: 'bg-[var(--color-success-light)]' },
  pending:   { label: 'Pending',   dotColor: 'bg-[var(--color-status-pending)]',   textColor: 'text-[var(--color-status-pending)]',   bgColor: 'bg-[var(--color-warning-light)]' },
  cancelled: { label: 'Cancelled', dotColor: 'bg-[var(--color-status-cancelled)]', textColor: 'text-[var(--color-status-cancelled)]', bgColor: 'bg-[var(--color-error-light)]' },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${cfg.bgColor} ${cfg.textColor}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
      {cfg.label}
    </span>
  );
}

/* ─── Risk level indicator ─── */
const riskConfig = {
  low:    { color: 'text-[var(--color-success)]',  bg: 'bg-[var(--color-success-light)]' },
  medium: { color: 'text-[var(--color-warning)]',  bg: 'bg-[var(--color-warning-light)]', border: 'border-[var(--color-warning)]' },
  high:   { color: 'text-[var(--color-error)]',    bg: 'bg-[var(--color-error-light)]', border: 'border-[var(--color-error)]' },
};

/* ─── Greeting by time of day ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

/* ─── Compact metric for the top section ─── */
function MetricCard({ icon, label, value, subValue, accent = false, warning = false }) {
  return (
    <div className={`group relative flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 hover:shadow-card ${
      accent ? 'border-primary-200 bg-gradient-to-br from-primary-50 to-surface' 
      : warning ? 'border-warning/30 bg-warning-light/30'
      : 'border-border bg-surface'
    }`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
        accent ? 'bg-primary/10 text-primary' 
        : warning ? 'bg-warning/10 text-warning'
        : 'bg-surface-muted text-text-muted group-hover:text-primary group-hover:bg-primary-50'
      }`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-medium uppercase tracking-wider ${warning ? 'text-warning' : 'text-text-muted'}`}>{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className={`text-2xl font-bold tracking-tight ${accent ? 'text-primary' : warning ? 'text-warning' : 'text-text-primary'}`}>{value}</span>
          {subValue && <span className="text-xs font-medium text-text-muted">{subValue}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Patient Preview Modal ─── */
function PatientPreviewModal({ patient, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2rem] bg-surface shadow-2xl transition-all">
        {/* Header (Colored by risk/status) */}
        <div className="bg-gradient-to-br from-primary-50 to-surface-muted px-6 pb-6 pt-8">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-text-muted hover:bg-black/5 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            {icons.x}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-xl font-bold text-white shadow-card">
              {patient.initials || patient.patientInitials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary leading-tight">{patient.name || patient.patientName}</h2>
              <p className="mt-1 text-sm font-medium text-text-secondary">
                {patient.age} years old · {patient.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Blood Type</p>
              <p className="mt-1 text-base font-bold text-error">{patient.bloodType || '—'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Allergy</p>
              <p className="mt-1 text-base font-bold text-text-primary">{patient.allergy || '—'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Condition</p>
              <p className="mt-1 text-base font-bold text-text-primary">{patient.condition || '—'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Medication</p>
              <p className="mt-1 text-base font-bold text-text-primary">{patient.medication || '—'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 active:scale-[0.98]">
              {icons.clipboardList} View Full Medical Record
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-primary-200 hover:bg-primary-50 active:scale-[0.98]">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════ */

export function DoctorDashboardPage() {
  const { user, logout } = useAuth();
  
  // Local state for interactive elements
  const [appointments, setAppointments] = useState(todayAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [previewPatient, setPreviewPatient] = useState(null);

  // Mock User Data for Doctor (fallback if not in context)
  const doctorName = user?.lastName ? `Dr. ${user.lastName}` : 'Dr. Sarah Wilson';
  const specialty = user?.specialty || 'General Practitioner';

  /* Derived data */
  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'all') return appointments;
    return appointments.filter(a => a.status === appointmentFilter);
  }, [appointmentFilter, appointments]);

  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  const nextAppointment = appointments.find(a => a.status === 'confirmed');

  // Interactive Action Handlers
  const handleConfirmAppointment = (e, id) => {
    e.stopPropagation();
    setAppointments(current => 
      current.map(apt => apt.id === id ? { ...apt, status: 'confirmed' } : apt)
    );
  };

  const handleCompleteAppointment = (e, id) => {
    e.stopPropagation();
    setAppointments(current => 
      current.map(apt => apt.id === id ? { ...apt, status: 'completed' } : apt)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ───── Top Navigation Bar ───── */}
      <nav className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white shadow-sm">AC</div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Aido Care</p>
              <p className="text-sm font-semibold text-text-primary -mt-0.5">Doctor Portal</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface-muted hover:text-text-primary">
              {icons.bell}
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-surface" />
            </button>
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-sm font-bold text-primary">
                {doctorName.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-text-primary leading-tight">{doctorName}</p>
                <p className="text-[11px] text-text-muted">{specialty}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex h-9 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition hover:border-error/30 hover:bg-error-light hover:text-error"
            >
              {icons.logout}
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ───── Main Content ───── */}
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* ── Hero / Greeting Area ── */}
        <section className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">{formatDate()}</p>
              <h1 className="mt-1 text-2xl font-bold text-text-primary sm:text-3xl">
                {getGreeting()}, <span className="text-primary">{doctorName}</span>
              </h1>
              <p className="mt-1.5 text-sm text-text-secondary">
                You have <span className="font-semibold text-primary">{confirmedCount} upcoming</span> and <span className="font-semibold text-warning">{pendingCount} pending</span> appointment{confirmedCount + pendingCount !== 1 && 's'} today.
              </p>
            </div>
            {/* Quick "next up" banner — only shows if there is an upcoming appointment */}
            {nextAppointment && (
              <div className="flex items-center gap-3 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-surface px-4 py-3 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {icons.clock}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Next Up</p>
                  <p className="text-sm font-semibold text-text-primary truncate">{nextAppointment.patientName}</p>
                  <p className="text-xs text-text-muted">{nextAppointment.time} · {nextAppointment.type}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Metric Row ── */}
        <section className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MetricCard icon={icons.calendar}      label="Today"       value={appointments.length} subValue="appointments" accent />
          <MetricCard icon={icons.check}         label="Completed"   value={completedCount} />
          <MetricCard icon={icons.clock}         label="Pending"     value={pendingCount} />
          <MetricCard icon={icons.alert}         label="Attention"   value={patientsRequiringAttention.length} subValue="patients" warning />
        </section>

        {/* ── Two-Column Layout: Appointments (primary) + Sidebar (secondary) ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

          {/* ── LEFT: Primary Content (Schedules) ── */}
          <div className="space-y-8">
            
            {/* ── Today's Schedule ── */}
            <section>
              {/* Section header */}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">{icons.clipboardList}</div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary leading-tight">Today's Appointments</h2>
                    <p className="text-xs font-medium text-text-muted">{appointments.length} appointments · {completedCount} completed</p>
                  </div>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 rounded-xl bg-surface-muted p-1">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'confirmed', label: 'Confirmed' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'completed', label: 'Done' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setAppointmentFilter(f.key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        appointmentFilter === f.key
                          ? 'bg-surface text-primary shadow-sm'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointment Timeline */}
              <div className="space-y-3">
                {filteredAppointments.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-text-muted">{icons.calendar}</div>
                    <p className="text-sm font-medium text-text-secondary">No appointments match this filter</p>
                  </div>
                )}
                {filteredAppointments.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => setSelectedAppointment(selectedAppointment?.id === apt.id ? null : apt)}
                    className={`group w-full text-left rounded-[1.5rem] border p-4 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${
                      selectedAppointment?.id === apt.id
                        ? 'border-primary-200 bg-primary-50/50 shadow-card'
                        : 'border-border bg-surface hover:border-primary-200 hover:shadow-card'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                      {/* Time block */}
                      <div className={`flex w-full sm:w-16 shrink-0 flex-row sm:flex-col items-center justify-between sm:justify-center rounded-xl py-2 px-3 sm:px-0 text-center transition-colors ${
                        apt.status === 'completed' ? 'bg-surface-muted text-text-muted' :
                        apt.status === 'pending' ? 'bg-warning-light text-warning' :
                        'bg-primary-50 text-primary'
                      }`}>
                        <span className="text-base sm:text-xl font-bold leading-none">{apt.time.split(':')[0]}<span className="text-[12px] sm:text-[10px] font-semibold uppercase opacity-70">:{apt.time.split(':')[1]}</span></span>
                        <span className="text-xs sm:hidden font-medium">{apt.endTime}</span>
                      </div>

                      {/* Patient info */}
                      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${
                            apt.status === 'completed'
                              ? 'bg-slate-100 text-text-muted border border-border'
                              : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                          }`}>
                            {apt.patientInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-text-primary truncate">{apt.patientName}</p>
                            <p className="text-sm font-medium text-text-secondary">{apt.type}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0 mt-2 sm:mt-0">
                          <StatusBadge status={apt.status} />
                          <span className="text-text-muted/40 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                            {icons.chevronRight}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details & actions */}
                    {selectedAppointment?.id === apt.id && (
                      <div className="mt-4 border-t border-primary-100 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4" onClick={(e) => e.stopPropagation()}>
                        <div>
                           <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Appointment Details</p>
                           <p className="text-sm text-text-secondary">{apt.notes || 'No specific notes.'}</p>
                           <div className="mt-2 text-xs font-medium text-text-muted flex items-center gap-2">
                             <span>Patient ID: {apt.patientId}</span>
                             <span>·</span>
                             <span>End Time: {apt.endTime}</span>
                           </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {apt.status === 'pending' && (
                            <button 
                              onClick={(e) => handleConfirmAppointment(e, apt.id)}
                              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 active:scale-[0.98]"
                            >
                              Confirm Appointment
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <>
                              <button 
                                onClick={() => setPreviewPatient(apt)}
                                className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-100 active:scale-[0.98]"
                              >
                                View Patient
                              </button>
                              <button 
                                onClick={(e) => handleCompleteAppointment(e, apt.id)}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 active:scale-[0.98]"
                              >
                                Mark Complete
                              </button>
                            </>
                          )}
                          {apt.status === 'completed' && (
                            <button className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary active:scale-[0.98]">
                              View Summary
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Upcoming Appointments (Tomorrow & Beyond) ── */}
            <section className="pt-2">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-text-muted">{icons.calendar}</div>
                <h2 className="text-base font-bold text-text-primary">Upcoming Appointments</h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingAppointments.map((group, i) => (
                  <div key={i} className="rounded-[1.5rem] border border-border bg-surface p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-text-primary">{group.day}</h3>
                    <div className="space-y-3">
                      {group.appointments.map(apt => (
                        <div key={apt.id} className="group flex items-center gap-3">
                          <div className="w-12 text-xs font-bold text-text-secondary">{apt.time}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{apt.patientName}</p>
                            <p className="text-[11px] font-medium text-text-muted truncate">{apt.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: Secondary Sidebar ── */}
          <aside className="space-y-6">
            
            {/* ── Patients Requiring Attention ── */}
            <div className="rounded-[1.5rem] border border-warning/30 bg-surface shadow-card overflow-hidden">
              <div className="bg-gradient-to-r from-warning-light/50 to-surface p-5 border-b border-warning/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-warning">
                    {icons.alert}
                    <h3 className="text-sm font-bold uppercase tracking-wider">Requires Attention</h3>
                  </div>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning text-xs font-bold text-white">
                    {patientsRequiringAttention.length}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {patientsRequiringAttention.map(patient => (
                  <div
                    key={patient.id}
                    onClick={() => setPreviewPatient(patient)}
                    className="group relative cursor-pointer rounded-2xl border border-border bg-surface p-4 transition-all duration-200 hover:border-warning/30 hover:bg-warning-light/10 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold text-text-primary">
                          {patient.initials}
                        </span>
                        <h4 className="text-sm font-bold text-text-primary">{patient.name}</h4>
                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${riskConfig[patient.riskLevel]?.bg || riskConfig.low.bg} ${riskConfig[patient.riskLevel]?.color || riskConfig.low.color}`}>
                          {patient.riskLevel}
                        </span>
                      </div>
                      <span className="text-text-muted/30 group-hover:text-warning transition-colors">
                        {icons.arrowRightCircle}
                      </span>
                    </div>
                    
                    <div className="text-xs text-text-secondary leading-relaxed mb-2">
                      <p><span className="font-medium text-text-muted">Condition:</span> {patient.condition}</p>
                      <p><span className="font-medium text-text-muted">Reason:</span> <span className="text-warning font-medium">{patient.reason}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="rounded-[1.5rem] border border-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-bold text-text-primary uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: icons.calendar, label: 'Schedule', primary: true },
                  { icon: icons.users,    label: 'Patients' },
                  { icon: icons.heartPulse, label: 'Records' },
                  { icon: icons.stethoscope, label: 'Prescriptions' },
                ].map((action, i) => (
                  <button
                    key={i}
                    className={`flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all duration-200 ${
                      action.primary
                        ? 'bg-primary text-white shadow-sm hover:bg-primary-800 active:scale-[0.97]'
                        : 'border border-border bg-surface-muted text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-50 active:scale-[0.97]'
                    }`}
                  >
                    {action.icon}
                    <span className="text-[11px] font-semibold uppercase tracking-wider">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="rounded-[1.5rem] border border-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-bold text-text-primary uppercase tracking-wider">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Timeline line */}
                    {i !== recentActivities.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-16px] w-px bg-border" />
                    )}
                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-surface bg-primary-100 text-primary">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="pb-1">
                      <p className="text-xs font-semibold text-text-muted">{activity.date} · {activity.time}</p>
                      <p className="mt-0.5 text-sm font-medium text-text-primary">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Patient Preview Modal */}
      {previewPatient && (
        <PatientPreviewModal 
          patient={previewPatient} 
          onClose={() => setPreviewPatient(null)} 
        />
      )}
    </div>
  );
}
