import { Link } from 'react-router-dom';

const actions = [
  {
    label: 'Find a Doctor',
    description: 'Search specialists',
    to: '/patient/find-doctor',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    color: 'bg-primary-50 text-primary',
  },
  {
    label: 'Appointments',
    description: 'View schedule',
    to: '/patient/appointments',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    color: 'bg-info-light text-info',
  },
  {
    label: 'Medical Records',
    description: 'View history',
    to: '/patient/records',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M9 15h6M9 11h6" />
      </svg>
    ),
    color: 'bg-warning-light text-warning',
  },
  {
    label: 'Health Profile',
    description: 'Update info',
    to: '/patient/health-profile',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: 'bg-success-light text-success',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:shadow-card hover:border-primary-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
            {action.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
              {action.label}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
