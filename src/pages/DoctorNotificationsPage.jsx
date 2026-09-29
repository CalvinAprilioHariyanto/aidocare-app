export function DoctorNotificationsPage() {
  const notifications = [
    { id: 1, title: 'New Appointment Request', message: 'Daniel Wong requested a Video Consultation.', time: '10 mins ago', unread: true, category: 'Appointments' },
    { id: 2, title: 'Lab Results Available', message: 'Blood test results for Jessica Lee are now available.', time: '1 hour ago', unread: true, category: 'Records' },
    { id: 3, title: 'System Update', message: 'Aido Care platform will undergo maintenance at 2 AM.', time: '1 day ago', unread: false, category: 'System' },
  ];

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-text-secondary">Stay up to date with your practice.</p>
        </div>
        <button className="text-sm font-bold text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface shadow-sm overflow-hidden divide-y divide-border">
        {notifications.map(note => (
          <div key={note.id} className={`flex items-start gap-4 p-5 transition hover:bg-surface-muted/50 ${note.unread ? 'bg-primary-50/30' : ''}`}>
            <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${note.unread ? 'bg-primary' : 'bg-transparent'}`}></div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className={`text-sm ${note.unread ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`}>{note.title}</h3>
                <span className="text-[10px] font-semibold uppercase text-text-muted">{note.time}</span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{note.message}</p>
              <div className="mt-2">
                <span className="rounded-lg bg-surface-muted px-2 py-1 text-[10px] font-bold uppercase text-text-muted">{note.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
