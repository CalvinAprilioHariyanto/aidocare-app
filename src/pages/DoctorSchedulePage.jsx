export function DoctorSchedulePage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Schedule</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your appointments and availability.</p>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-text-primary">September 29, 2026</h2>
            <div className="flex items-center gap-1 rounded-xl bg-surface-muted p-1">
              <button className="rounded-lg px-3 py-1 text-xs font-bold text-text-muted hover:text-text-primary">&lt;</button>
              <button className="rounded-lg px-3 py-1 text-xs font-bold text-text-muted hover:text-text-primary">Today</button>
              <button className="rounded-lg px-3 py-1 text-xs font-bold text-text-muted hover:text-text-primary">&gt;</button>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-surface-muted p-1">
            <button className="rounded-lg bg-surface px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">Day</button>
            <button className="rounded-lg px-4 py-1.5 text-xs font-semibold text-text-muted hover:text-text-primary">Week</button>
            <button className="rounded-lg px-4 py-1.5 text-xs font-semibold text-text-muted hover:text-text-primary">Month</button>
          </div>
        </div>

        {/* Calendar Body Shell */}
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-8 sm:divide-x sm:divide-y-0">
          <div className="hidden flex-col divide-y divide-border border-r border-border sm:flex col-span-1">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
              <div key={time} className="flex h-20 items-start justify-end p-2 text-xs font-medium text-text-muted">
                {time}
              </div>
            ))}
          </div>
          <div className="relative col-span-1 min-h-[600px] sm:col-span-7 bg-surface-muted/30">
             {/* Mock Appointments */}
             <div className="absolute left-4 right-4 top-[80px] rounded-xl border border-primary-200 bg-primary-50 p-3 shadow-sm h-16">
               <p className="text-sm font-bold text-primary">Michael Tan</p>
               <p className="text-xs font-medium text-text-secondary">09:00 - 09:30 · General Consultation</p>
             </div>
             <div className="absolute left-4 right-4 top-[200px] rounded-xl border border-primary-200 bg-primary-50 p-3 shadow-sm h-16">
               <p className="text-sm font-bold text-primary">Jessica Lee</p>
               <p className="text-xs font-medium text-text-secondary">10:30 - 11:00 · Follow-up</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
