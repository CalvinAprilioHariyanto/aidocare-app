export function DoctorSettingsPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your profile and preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="flex flex-col gap-2">
          <button className="rounded-xl bg-primary-50 px-4 py-2.5 text-left text-sm font-bold text-primary">Profile</button>
          <button className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">Account</button>
          <button className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">Availability</button>
          <button className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">Preferences</button>
        </nav>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Profile Information</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-2xl font-bold text-primary">
                SW
              </div>
              <button className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-bold text-text-primary hover:bg-surface-muted">Change Photo</button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted">First Name</label>
                <input type="text" className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm text-text-primary outline-none focus:border-primary" defaultValue="Sarah" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted">Last Name</label>
                <input type="text" className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm text-text-primary outline-none focus:border-primary" defaultValue="Wilson" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-text-muted">Specialty</label>
                <input type="text" className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm text-text-primary outline-none focus:border-primary" defaultValue="General Practitioner" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-700">Save Changes</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
