export function DoctorAnalyticsPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="mt-1 text-sm text-text-secondary">Understand your practice and patient activity.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Stat Cards */}
        <div className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Appointments (This Month)</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">142</p>
          <p className="mt-2 text-xs font-medium text-success flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
            12% vs last month
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">New Patients</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">28</p>
          <p className="mt-2 text-xs font-medium text-success flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
            4% vs last month
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Avg Consultation Time</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">24m</p>
          <p className="mt-2 text-xs font-medium text-text-muted flex items-center gap-1">
            No change vs last month
          </p>
        </div>

        {/* Chart Shell */}
        <div className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary">Consultation Trends</h3>
            <select className="rounded-lg border border-border bg-surface px-3 py-1 text-xs font-medium text-text-primary outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex h-64 items-end justify-between gap-2 border-b border-border pb-4">
             {/* Mock Bars */}
             {[40, 60, 45, 80, 55, 90].map((h, i) => (
                <div key={i} className="w-1/6 group relative flex justify-center">
                  <div style={{ height: `${h}%` }} className="w-full max-w-[40px] rounded-t-lg bg-primary-100 transition-colors group-hover:bg-primary-300"></div>
                </div>
             ))}
          </div>
          <div className="mt-3 flex justify-between px-2 text-xs font-medium text-text-muted">
            <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
          </div>
        </div>

        {/* Donut Chart Shell */}
        <div className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-6 text-base font-bold text-text-primary">Consultation Types</h3>
          <div className="flex items-center justify-center py-4">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-primary-100 border-t-primary border-r-primary-300">
               <span className="text-lg font-bold text-text-primary">142</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary"></div>General</span>
              <span className="text-text-secondary">45%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary-300"></div>Follow-up</span>
              <span className="text-text-secondary">35%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary-100"></div>Video Consult</span>
              <span className="text-text-secondary">20%</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
