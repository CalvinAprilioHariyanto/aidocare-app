import { mockHealthTips } from '../../data/dashboardData';

const tagColors = {
  Wellness: 'bg-primary-50 text-primary',
  Prevention: 'bg-success-light text-success',
};

export function HealthTips() {
  const tips = mockHealthTips;

  if (!tips || tips.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
        <h2 className="text-base font-semibold text-text-primary">Health Tips</h2>
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6 flex flex-col gap-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="rounded-lg border border-border-light p-4 hover:bg-surface-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${tagColors[tip.tag] || 'bg-surface-muted text-text-muted'}`}>
                {tip.tag}
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">{tip.title}</p>
            <p className="text-xs text-text-muted leading-relaxed">{tip.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
