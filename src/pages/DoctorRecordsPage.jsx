export function DoctorRecordsPage() {
  const records = [
    { id: 'REC-123', patient: 'Jessica Lee', type: 'General Consultation', date: 'September 24, 2026', doctor: 'Dr. Sarah Wilson' },
    { id: 'REC-124', patient: 'Daniel Wong', type: 'Follow-up Consultation', date: 'September 20, 2026', doctor: 'Dr. Sarah Wilson' },
    { id: 'REC-125', patient: 'Amanda Chen', type: 'Lab Results Review', date: 'September 15, 2026', doctor: 'Dr. Sarah Wilson' },
  ];

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Medical Records</h1>
        <p className="mt-1 text-sm text-text-secondary">Review and manage patient medical records.</p>
      </div>

      <div className="grid gap-4">
        {records.map(record => (
          <div key={record.id} className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-[1.5rem] border border-border bg-surface p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-text-muted">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">{record.patient}</h3>
                <p className="text-sm font-medium text-text-secondary">{record.type}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                  <span>{record.date}</span>
                  <span>·</span>
                  <span>{record.id}</span>
                </div>
              </div>
            </div>
            <button className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm font-bold text-text-primary transition hover:bg-surface hover:border-primary-200 hover:text-primary">
              View Record
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
