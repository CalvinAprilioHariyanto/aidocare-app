import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfileCompletion } from '../../data/dashboardData';

export function ProfileCompletion() {
  const { user } = useAuth();
  const { percent, missing } = getProfileCompletion(user);

  if (percent >= 100) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-light text-warning shrink-0">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Complete your health profile</p>
              <p className="text-xs text-text-muted mt-0.5">
                {missing.length > 0
                  ? `Missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` +${missing.length - 3} more` : ''}`
                  : 'Almost there!'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-text-primary tabular-nums w-10 text-right">
              {percent}%
            </span>
          </div>
        </div>

        <Link
          to="/patient/health-profile"
          className="shrink-0 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Update Profile
        </Link>
      </div>
    </div>
  );
}
