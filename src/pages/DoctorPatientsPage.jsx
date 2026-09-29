export function DoctorPatientsPage() {
  const patients = [
    { id: 'PAT-001', name: 'Michael Tan', age: 32, gender: 'Male', status: 'Active', lastVisit: 'Sep 29, 2026' },
    { id: 'PAT-002', name: 'Jessica Lee', age: 29, gender: 'Female', status: 'Active', lastVisit: 'Sep 29, 2026' },
    { id: 'PAT-003', name: 'Daniel Wong', age: 41, gender: 'Male', status: 'Active', lastVisit: 'Sep 20, 2026' },
    { id: 'PAT-004', name: 'Amanda Chen', age: 26, gender: 'Female', status: 'Active', lastVisit: 'Sep 15, 2026' },
  ];

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Patients</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage and review your patients.</p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition">
          + New Patient
        </button>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between bg-surface-muted/50">
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search patients by name or ID..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-muted">Total: 124 patients</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/30 text-xs font-bold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Age / Gender</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((patient) => (
                <tr key={patient.id} className="transition-colors hover:bg-surface-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-text-primary">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-text-secondary">{patient.id}</td>
                  <td className="px-6 py-4 text-text-secondary">{patient.age} · {patient.gender}</td>
                  <td className="px-6 py-4 text-text-secondary">{patient.lastVisit}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-primary hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
