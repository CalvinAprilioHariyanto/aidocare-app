import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { getDoctorById } from '../data/doctors';

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">{icon}</div>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );
}

export function DoctorDetailPage() {
  const { doctorId } = useParams();
  const doctor = getDoctorById(doctorId);

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-text-primary">Doctor not found</p>
          <Link to="/patient/find-doctor" className="mt-4 text-sm font-medium text-primary hover:underline">← Back to search</Link>
        </div>
      </DashboardLayout>
    );
  }

  const availableDays = Object.keys(doctor.availability)
    .map(Number)
    .map((d) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d])
    .join(', ');

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Back link */}
        <Link to="/patient/find-doctor" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary transition-colors self-start">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back to doctors
        </Link>

        {/* Profile card */}
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-xl font-bold text-white shadow-card">
                {doctor.firstName[0]}{doctor.lastName[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary sm:text-2xl">Dr. {doctor.firstName} {doctor.lastName}</h1>
                <p className="text-sm text-text-muted">{doctor.specialty}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current"><path d="M10 1.608l2.117 6.515h6.851l-5.543 4.026 2.117 6.515L10 14.638l-5.542 4.026 2.117-6.515L1.032 8.123h6.851z" /></svg>
                    {doctor.rating}
                  </span>
                  <span className="text-xs text-text-muted">({doctor.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <Link
              to={`/patient/appointments/book?doctor=${doctor.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left — About */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-text-primary">About</h2>
              <p className="text-sm leading-relaxed text-text-secondary">{doctor.bio}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-text-primary">Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" /></svg>}
                  label="Education"
                  value={doctor.education}
                />
                <InfoRow
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                  label="Experience"
                  value={`${doctor.experience} years`}
                />
                <InfoRow
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>}
                  label="Location"
                  value={doctor.location}
                />
                <InfoRow
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                  label="Consultation Fee"
                  value={`Rp ${doctor.consultationFee.toLocaleString('id-ID')}`}
                />
              </div>
            </div>
          </div>

          {/* Right — Availability + Languages */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-text-primary">Availability</h2>
              <p className="text-sm text-text-secondary">{availableDays}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-text-primary">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang) => (
                  <span key={lang} className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary">{lang}</span>
                ))}
              </div>
            </div>
            <Link
              to={`/patient/appointments/book?doctor=${doctor.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
