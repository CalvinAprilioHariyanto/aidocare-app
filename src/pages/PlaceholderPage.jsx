import { Link, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';

const pageInfo = {
  '/patient/find-doctor': { title: 'Find a Doctor', description: 'Search and filter available specialists.' },
  '/patient/appointments': { title: 'Appointments', description: 'View and manage your appointment schedule.' },
  '/patient/records': { title: 'Medical Records', description: 'Access your complete medical history.' },
  '/patient/health-profile': { title: 'Health Profile', description: 'View and update your health information.' },
  '/patient/settings': { title: 'Settings', description: 'Manage your account preferences.' },
};

export function PlaceholderPage() {
  const { pathname } = useLocation();
  const info = pageInfo[pathname] || { title: 'Coming Soon', description: 'This page is under development.' };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-6">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">{info.title}</h1>
        <p className="text-sm text-text-muted mb-8 max-w-sm">{info.description}<br/>This feature is coming soon.</p>
        <Link
          to="/patient"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}
