import { useAuth } from '../../context/AuthContext';
import { mockHealthMetrics } from '../../data/dashboardData';

const statusLabels = {
  normal: { text: 'Normal', color: 'text-success' },
  high: { text: 'High', color: 'text-warning' },
  low: { text: 'Low', color: 'text-warning' },
  critical: { text: 'Critical', color: 'text-error' },
};

function MetricCard({ label, value, unit, status, icon }) {
  const statusInfo = statusLabels[status] || statusLabels.normal;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border-light bg-surface p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted mb-1">{label}</p>
        <p className="text-lg font-bold text-text-primary tabular-nums leading-none">
          {value} <span className="text-xs font-normal text-text-muted">{unit}</span>
        </p>
        <p className={`text-xs font-medium mt-1 ${statusInfo.color}`}>{statusInfo.text}</p>
      </div>
    </div>
  );
}

export function HealthOverview() {
  const { user } = useAuth();
  const metrics = mockHealthMetrics;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
        <h2 className="text-base font-semibold text-text-primary">Health Overview</h2>
        <p className="text-xs text-text-muted mt-0.5">Your latest health metrics</p>
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Blood type (from user profile) */}
          {user?.bloodType && (
            <div className="flex items-start gap-3 rounded-lg border border-border-light bg-surface p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-light text-error shrink-0">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c4.97 0 8-3.58 8-8C20 9 12 2 12 2S4 9 4 14c0 4.42 3.03 8 8 8Z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Blood Type</p>
                <p className="text-lg font-bold text-text-primary leading-none">{user.bloodType}</p>
              </div>
            </div>
          )}

          <MetricCard
            label="Blood Pressure"
            value={`${metrics.bloodPressure.systolic}/${metrics.bloodPressure.diastolic}`}
            unit={metrics.bloodPressure.unit}
            status={metrics.bloodPressure.status}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
          <MetricCard
            label="Heart Rate"
            value={metrics.heartRate.value}
            unit={metrics.heartRate.unit}
            status={metrics.heartRate.status}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            }
          />
          <MetricCard
            label="Weight"
            value={metrics.weight.value}
            unit={metrics.weight.unit}
            status={metrics.weight.status}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          />
          <MetricCard
            label="BMI"
            value={metrics.bmi.value}
            unit={metrics.bmi.unit}
            status={metrics.bmi.status}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20h20M5 20V8l7-5 7 5v12" />
                <path d="M9 20v-4h6v4" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
