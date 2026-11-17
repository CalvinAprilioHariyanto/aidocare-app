import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { listDoctors } from '../services/doctorService';

function StarRating({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current"><path d="M10 1.608l2.117 6.515h6.851l-5.543 4.026 2.117 6.515L10 14.638l-5.542 4.026 2.117-6.515L1.032 8.123h6.851z" /></svg>
      {rating}
    </span>
  );
}

export function FindDoctorPage() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    let active = true;
    listDoctors()
      .then((data) => {
        if (active) setDoctorsList(data);
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

  const specialties = useMemo(() => {
    const set = new Set();
    doctorsList.forEach((d) => {
      if (d.specialty) set.add(d.specialty);
      if (Array.isArray(d.specialties)) {
        d.specialties.forEach((s) => set.add(s));
      }
    });
    return Array.from(set).sort();
  }, [doctorsList]);

  const filtered = useMemo(() => {
    return doctorsList.filter((doc) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(query) ||
        (doc.specialty && doc.specialty.toLowerCase().includes(query)) ||
        (doc.specialties && doc.specialties.some((s) => s.toLowerCase().includes(query)));
      const matchesSpecialty =
        !selectedSpecialty ||
        doc.specialty === selectedSpecialty ||
        (doc.specialties && doc.specialties.includes(selectedSpecialty));
      return matchesSearch && matchesSpecialty;
    });
  }, [doctorsList, search, selectedSpecialty]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Find a Doctor</h1>
          <p className="mt-1 text-sm text-text-muted">Search and book appointments with our specialists.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder="Search by name or specialty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-placeholder hover:border-primary-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition hover:border-primary-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="">All Specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Loading / Error / Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16 text-center">
            <svg className="h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            <p className="mt-3 text-sm font-medium text-text-primary">Loading doctors…</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-center text-sm text-error">
            <p className="font-semibold">Unable to load doctor directory</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </div>
            <p className="text-sm font-medium text-text-primary">No doctors found</p>
            <p className="mt-1 text-xs text-text-muted">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((doc) => (
              <Link
                key={doc.id}
                to={`/patient/doctors/${doc.id}`}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary-200 hover:shadow-card"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">
                    {doc.firstName?.[0] || 'D'}{doc.lastName?.[0] || 'R'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      Dr. {doc.firstName} {doc.lastName}
                    </p>
                    <p className="text-xs text-text-muted">{doc.specialty}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <StarRating rating={doc.rating || 4.9} />
                  <span>{doc.reviewCount || 90} reviews</span>
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    Rp {(doc.consultationFee || 150000).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-text-secondary">{doc.bio}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-text-muted">{doc.experience || 8} yrs experience</span>
                  <span className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">
                    View Profile
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
