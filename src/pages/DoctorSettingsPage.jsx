import { useState, useEffect, useMemo } from 'react';
import { getDoctorAccount, updateDoctorAccount } from '../services/doctorService';

export function DoctorSettingsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let active = true;

    getDoctorAccount()
      .then((doctor) => {
        if (active && doctor) {
          setFormData({
            firstName: doctor.firstName || '',
            lastName: doctor.lastName || '',
            specialty: doctor.specialty || '',
            bio: doctor.bio || '',
          });
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const initials = useMemo(() => {
    const f = (formData.firstName || 'D').charAt(0).toUpperCase();
    const l = (formData.lastName || 'R').charAt(0).toUpperCase();
    return `${f}${l}`;
  }, [formData.firstName, formData.lastName]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateDoctorAccount(formData);
      setFormData({
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
        specialty: updated.specialty || '',
        bio: updated.bio || '',
      });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your profile and preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="flex flex-col gap-2">
          <button className="rounded-xl bg-primary-50 px-4 py-2.5 text-left text-sm font-bold text-primary">
            Profile
          </button>
          <button className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">
            Account
          </button>
          <button className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">
            Availability
          </button>
          <button className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">
            Preferences
          </button>
        </nav>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Profile Information</h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6 flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-2xl font-bold text-primary">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      {formData.firstName || formData.lastName
                        ? `Dr. ${formData.firstName} ${formData.lastName}`.trim()
                        : 'Doctor Account'}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formData.specialty || 'General Practitioner'}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm text-text-primary outline-none focus:border-primary"
                      placeholder="e.g. Sarah"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm text-text-primary outline-none focus:border-primary"
                      placeholder="e.g. Wilson"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-text-muted">Specialty</label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm text-text-primary outline-none focus:border-primary"
                      placeholder="e.g. Cardiology"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-text-muted">Bio</label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm text-text-primary outline-none focus:border-primary"
                      placeholder="Short professional biography..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
