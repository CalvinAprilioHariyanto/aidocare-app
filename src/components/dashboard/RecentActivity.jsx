import { Link } from 'react-router-dom';
import { mockRecentActivity } from '../../data/dashboardData';

const iconMap = {
  consultation: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  prescription: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M12 3v7l5.5 8.5a2 2 0 0 1-1.68 3.08H8.18a2 2 0 0 1-1.68-3.08L12 10V3" />
    </svg>
  ),
  record: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 15h6M9 11h6" />
    </svg>
  ),
};

const typeColors = {
  consultation: 'bg-primary-50 text-primary',
  prescription: 'bg-info-light text-info',
  lab: 'bg-warning-light text-warning',
  record: 'bg-surface-muted text-text-muted',
};

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function RecentActivity() {
  const activities = mockRecentActivity;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
        <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
        <Link to="/patient/records" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="px-5 pb-8 sm:px-6 text-center">
          <p className="text-sm text-text-muted">No recent activity.</p>
        </div>
      ) : (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <ul className="flex flex-col gap-3">
            {activities.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-border-light p-3.5 transition-colors hover:bg-surface-muted/30"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[item.icon] || typeColors.record}`}>
                  {iconMap[item.icon] || iconMap.record}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5 truncate">{item.description}</p>
                </div>
                <span className="shrink-0 text-xs text-text-muted whitespace-nowrap pt-0.5">
                  {formatRelativeDate(item.date)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
