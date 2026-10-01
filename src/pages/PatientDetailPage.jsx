import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getPatient,
  listMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  archiveMedicalRecord,
  listPrescriptions,
  createPrescription,
  updatePrescription,
  discontinuePrescription,
} from '../services/doctorService';
import { toast } from '../components/ui/Toast';

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */
const icons = {
  back: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  user: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  calendar: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  clipboard: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  pill: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>,
  plus: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  edit: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  archive: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  stop: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>,
  x: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  spinner: <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>,
  check: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function age(dob) {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function initials(first, last) {
  return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || '?';
}

/* ─────────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    ACTIVE: 'bg-green-50 text-green-700 border-green-200',
    ARCHIVED: 'bg-slate-50 text-slate-500 border-slate-200',
    DISCONTINUED: 'bg-red-50 text-red-700 border-red-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
    NO_SHOW: 'bg-slate-50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${map[status] || map.PENDING}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   FORM FIELD
───────────────────────────────────────────────────────────── */
function Field({ label, required, children, error }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-text-primary">
        {label}{required && <span className="ml-0.5 text-error">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = '', rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 resize-none transition ${className}`}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL WRAPPER
───────────────────────────────────────────────────────────── */
function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto rounded-2xl bg-surface shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition">
            {icons.x}
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MEDICAL RECORD FORM
───────────────────────────────────────────────────────────── */
function MedicalRecordForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    symptoms: initial.symptoms || '',
    diagnosis: initial.diagnosis || '',
    treatment: initial.treatment || '',
    content: initial.content || '',
    notes: initial.notes || '',
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.content.trim()) errs.content = 'Consultation summary is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Record Title" required error={errors.title}>
        <Input value={form.title} onChange={set('title')} placeholder="e.g. General Consultation — Sep 2026" />
      </Field>
      <Field label="Symptoms / Chief Complaint">
        <Textarea value={form.symptoms} onChange={set('symptoms')} placeholder="Describe the patient's reported symptoms…" />
      </Field>
      <Field label="Diagnosis">
        <Textarea value={form.diagnosis} onChange={set('diagnosis')} placeholder="Clinical diagnosis…" />
      </Field>
      <Field label="Treatment Plan">
        <Textarea value={form.treatment} onChange={set('treatment')} placeholder="Prescribed treatment, procedures, referrals…" />
      </Field>
      <Field label="Consultation Summary" required error={errors.content}>
        <Textarea rows={4} value={form.content} onChange={set('content')} placeholder="Overall consultation notes…" />
      </Field>
      <Field label="Additional Notes">
        <Textarea value={form.notes} onChange={set('notes')} placeholder="Follow-up instructions, warnings, etc." />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? icons.spinner : icons.check}
          {loading ? 'Saving…' : 'Save Record'}
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRESCRIPTION FORM
───────────────────────────────────────────────────────────── */
function PrescriptionForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    medication: initial.medication || '',
    dosage: initial.dosage || '',
    frequency: initial.frequency || '',
    duration: initial.duration || '',
    instructions: initial.instructions || '',
    notes: initial.notes || '',
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  function validate() {
    const errs = {};
    if (!form.medication.trim()) errs.medication = 'Medication is required.';
    if (!form.dosage.trim()) errs.dosage = 'Dosage is required.';
    if (!form.frequency.trim()) errs.frequency = 'Frequency is required.';
    if (!form.duration.trim()) errs.duration = 'Duration is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Medication" required error={errors.medication}>
        <Input value={form.medication} onChange={set('medication')} placeholder="e.g. Cetirizine 10 mg" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Dosage" required error={errors.dosage}>
          <Input value={form.dosage} onChange={set('dosage')} placeholder="e.g. 1 tablet" />
        </Field>
        <Field label="Frequency" required error={errors.frequency}>
          <Input value={form.frequency} onChange={set('frequency')} placeholder="e.g. Once daily" />
        </Field>
      </div>
      <Field label="Duration" required error={errors.duration}>
        <Input value={form.duration} onChange={set('duration')} placeholder="e.g. 7 days" />
      </Field>
      <Field label="Instructions">
        <Textarea value={form.instructions} onChange={set('instructions')} placeholder="e.g. Take after meals" />
      </Field>
      <Field label="Notes">
        <Textarea value={form.notes} onChange={set('notes')} placeholder="Additional notes for the pharmacist or patient…" />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? icons.spinner : icons.check}
          {loading ? 'Saving…' : 'Save Prescription'}
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   MEDICAL RECORDS TAB
───────────────────────────────────────────────────────────── */
function MedicalRecordsTab({ patientId, patientName }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMedicalRecords(patientId, { includeArchived: showArchived });
      setRecords(data.records || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [patientId, showArchived]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(form) {
    setSubmitting(true);
    try {
      await createMedicalRecord(patientId, form);
      toast('Medical record created successfully.', 'success');
      setModal(null);
      load();
    } catch (e) {
      toast(e.message || 'Unable to save medical record. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(form) {
    setSubmitting(true);
    try {
      await updateMedicalRecord(patientId, selected.id, form);
      toast('Medical record updated successfully.', 'success');
      setModal(null);
      setSelected(null);
      load();
    } catch (e) {
      toast(e.message || 'Unable to update medical record. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleArchive(record) {
    if (!window.confirm(`Archive this record: "${record.title}"? It will no longer appear as active.`)) return;
    try {
      await archiveMedicalRecord(patientId, record.id);
      toast('Medical record archived.', 'success');
      load();
    } catch (e) {
      toast(e.message || 'Unable to archive record.', 'error');
    }
  }

  async function handleViewDetail(record) {
    try {
      const data = await getMedicalRecord(patientId, record.id);
      setSelected(data.record);
      setModal('view');
    } catch (e) {
      toast(e.message || 'Unable to load record.', 'error');
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Medical Records</h2>
          <p className="text-sm text-text-secondary">{records.length} record{records.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={e => setShowArchived(e.target.checked)}
              className="accent-primary"
            />
            Show archived
          </label>
          <button
            onClick={() => setModal('create')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-[0.98]"
          >
            {icons.plus} New Record
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-primary">
          {icons.spinner}
          <span className="ml-2 text-sm text-text-muted">Loading records…</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button onClick={load} className="mt-3 text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-muted">
            {icons.clipboard}
          </div>
          <p className="text-sm font-semibold text-text-primary">No medical records found</p>
          <p className="mt-1 text-xs text-text-muted">Create the first record for {patientName}</p>
          <button
            onClick={() => setModal('create')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {icons.plus} Create Record
          </button>
        </div>
      )}

      {/* Records List */}
      {!loading && !error && records.length > 0 && (
        <div className="space-y-3">
          {records.map(rec => (
            <div key={rec.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary-200 hover:shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-text-primary">{rec.title}</h3>
                    <StatusBadge status={rec.status} />
                  </div>
                  {rec.diagnosis && (
                    <p className="text-sm text-text-secondary mt-1">
                      <span className="font-medium text-text-muted">Diagnosis: </span>{rec.diagnosis}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-text-muted">
                    <span>{fmtDate(rec.createdAt)}</span>
                    {rec.prescriptions?.length > 0 && (
                      <span className="text-primary font-medium">{rec.prescriptions.length} prescription{rec.prescriptions.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleViewDetail(rec)}
                    className="rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary"
                  >
                    View
                  </button>
                  {rec.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => { setSelected(rec); setModal('edit'); }}
                        className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-100"
                      >
                        {icons.edit}
                      </button>
                      <button
                        onClick={() => handleArchive(rec)}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                        title="Archive"
                      >
                        {icons.archive}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modal === 'create' && (
        <Modal title="New Medical Record" onClose={() => setModal(null)} wide>
          <MedicalRecordForm onSubmit={handleCreate} loading={submitting} />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === 'edit' && selected && (
        <Modal title="Edit Medical Record" onClose={() => { setModal(null); setSelected(null); }} wide>
          <MedicalRecordForm initial={selected} onSubmit={handleUpdate} loading={submitting} />
        </Modal>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <Modal title="Medical Record Detail" onClose={() => { setModal(null); setSelected(null); }} wide>
          <RecordDetailView record={selected} onClose={() => { setModal(null); setSelected(null); }} />
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   RECORD DETAIL VIEW (inside modal)
───────────────────────────────────────────────────────────── */
function RecordDetailView({ record, onClose }) {
  const sections = [
    { label: 'Symptoms / Chief Complaint', value: record.symptoms },
    { label: 'Diagnosis', value: record.diagnosis },
    { label: 'Treatment Plan', value: record.treatment },
    { label: 'Consultation Summary', value: record.content },
    { label: 'Additional Notes', value: record.notes },
  ].filter(s => s.value);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-bold text-text-primary">{record.title}</h3>
        <StatusBadge status={record.status} />
      </div>
      <p className="text-sm text-text-muted">{fmtDate(record.createdAt)}</p>

      {sections.map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-surface-muted/50 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">{s.label}</p>
          <p className="text-sm text-text-primary whitespace-pre-wrap">{s.value}</p>
        </div>
      ))}

      {record.prescriptions?.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Prescriptions ({record.prescriptions.length})</p>
          <div className="space-y-2">
            {record.prescriptions.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{p.medication}</p>
                  <p className="text-xs text-text-muted">{p.dosage} · {p.frequency} · {p.duration}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {record.prescriptions?.length === 0 && (
        <p className="text-sm text-text-muted italic">No prescriptions attached to this record.</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRESCRIPTIONS TAB
───────────────────────────────────────────────────────────── */
function PrescriptionsTab({ patientId, patientName }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPrescriptions(patientId);
      setPrescriptions(data.prescriptions || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(form) {
    setSubmitting(true);
    try {
      await createPrescription(patientId, form);
      toast('Prescription created successfully.', 'success');
      setModal(null);
      load();
    } catch (e) {
      toast(e.message || 'Unable to save prescription. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(form) {
    setSubmitting(true);
    try {
      await updatePrescription(patientId, selected.id, form);
      toast('Prescription updated successfully.', 'success');
      setModal(null);
      setSelected(null);
      load();
    } catch (e) {
      toast(e.message || 'Unable to update prescription. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDiscontinue(rx) {
    if (!window.confirm(`Discontinue "${rx.medication}"? This cannot be undone.`)) return;
    try {
      await discontinuePrescription(patientId, rx.id);
      toast('Prescription discontinued.', 'success');
      load();
    } catch (e) {
      toast(e.message || 'Unable to discontinue prescription.', 'error');
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Prescriptions</h2>
          <p className="text-sm text-text-secondary">{prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-[0.98]"
        >
          {icons.plus} New Prescription
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-primary">
          {icons.spinner}
          <span className="ml-2 text-sm text-text-muted">Loading prescriptions…</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button onClick={load} className="mt-3 text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {!loading && !error && prescriptions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-muted">
            {icons.pill}
          </div>
          <p className="text-sm font-semibold text-text-primary">No prescriptions found</p>
          <p className="mt-1 text-xs text-text-muted">Issue the first prescription for {patientName}</p>
          <button
            onClick={() => setModal('create')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {icons.plus} Issue Prescription
          </button>
        </div>
      )}

      {/* Prescriptions List */}
      {!loading && !error && prescriptions.length > 0 && (
        <div className="space-y-3">
          {prescriptions.map(rx => (
            <div key={rx.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary-200 hover:shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-text-primary">{rx.medication}</h3>
                    <StatusBadge status={rx.status} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-surface-muted px-3 py-2">
                      <p className="font-semibold text-text-muted uppercase tracking-wide mb-0.5">Dosage</p>
                      <p className="font-medium text-text-primary">{rx.dosage}</p>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-3 py-2">
                      <p className="font-semibold text-text-muted uppercase tracking-wide mb-0.5">Frequency</p>
                      <p className="font-medium text-text-primary">{rx.frequency}</p>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-3 py-2">
                      <p className="font-semibold text-text-muted uppercase tracking-wide mb-0.5">Duration</p>
                      <p className="font-medium text-text-primary">{rx.duration}</p>
                    </div>
                  </div>
                  {rx.instructions && (
                    <p className="mt-2 text-xs text-text-secondary">
                      <span className="font-semibold text-text-muted">Instructions: </span>{rx.instructions}
                    </p>
                  )}
                  {rx.medicalRecord && (
                    <p className="mt-1 text-xs text-text-muted">
                      From record: <span className="font-medium text-text-secondary">{rx.medicalRecord.title}</span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-text-muted">{fmtDate(rx.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {rx.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => { setSelected(rx); setModal('edit'); }}
                        className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-100"
                        title="Edit"
                      >
                        {icons.edit}
                      </button>
                      <button
                        onClick={() => handleDiscontinue(rx)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        title="Discontinue"
                      >
                        {icons.stop}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modal === 'create' && (
        <Modal title="Issue New Prescription" onClose={() => setModal(null)}>
          <PrescriptionForm onSubmit={handleCreate} loading={submitting} />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === 'edit' && selected && (
        <Modal title="Edit Prescription" onClose={() => { setModal(null); setSelected(null); }}>
          <PrescriptionForm initial={selected} onSubmit={handleUpdate} loading={submitting} />
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   APPOINTMENTS TAB
───────────────────────────────────────────────────────────── */
function AppointmentsTab({ appointments }) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-muted">
          {icons.calendar}
        </div>
        <p className="text-sm font-semibold text-text-primary">No appointments found</p>
        <p className="mt-1 text-xs text-text-muted">No appointments with this patient yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-text-primary mb-4">Appointment History</h2>
      {appointments.map(apt => (
        <div key={apt.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div>
            <p className="text-sm font-bold text-text-primary">{fmtDate(apt.appointmentDate)}</p>
            <p className="text-xs text-text-muted">
              Queue #{apt.queueNumber || '—'} · {apt.startTime ? new Date(apt.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
            </p>
          </div>
          <StatusBadge status={apt.status} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   OVERVIEW TAB
───────────────────────────────────────────────────────────── */
function OverviewTab({ patient }) {
  const fields = [
    { label: 'Email', value: patient.user?.email },
    { label: 'Phone', value: patient.phone },
    { label: 'Date of Birth', value: fmtDate(patient.dateOfBirth) },
    { label: 'Age', value: patient.dateOfBirth ? `${age(patient.dateOfBirth)} years old` : '—' },
    { label: 'Gender', value: patient.gender || '—' },
    { label: 'Allergies', value: patient.allergies?.length ? patient.allergies.join(', ') : 'None reported' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-4">Patient Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(f => (
          <div key={f.label} className="rounded-xl border border-border bg-surface-muted/50 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">{f.label}</p>
            <p className="text-sm font-semibold text-text-primary">{f.value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT: PatientDetailPage
───────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview', label: 'Overview', icon: icons.user },
  { id: 'appointments', label: 'Appointments', icon: icons.calendar },
  { id: 'records', label: 'Medical Records', icon: icons.clipboard },
  { id: 'prescriptions', label: 'Prescriptions', icon: icons.pill },
];

export function PatientDetailPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getPatient(patientId)
      .then(data => { if (active) setPatient(data.patient); })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [patientId]);

  if (loading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-24 text-primary">
          {icons.spinner}
          <span className="ml-2 text-sm text-text-muted">Loading patient…</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button onClick={() => navigate('/doctor/patients')} className="mt-4 text-sm font-semibold text-primary hover:underline">
            ← Back to Patients
          </button>
        </div>
      </main>
    );
  }

  if (!patient) return null;

  const patientName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient';

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-text-muted">
        <Link to="/doctor/patients" className="flex items-center gap-1 hover:text-primary transition">
          {icons.back} Patients
        </Link>
        <span>/</span>
        <span className="font-semibold text-text-primary">{patientName}</span>
      </div>

      {/* Patient Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-xl font-bold text-white shadow-sm">
          {initials(patient.firstName, patient.lastName)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary">{patientName}</h1>
          <div className="mt-1 flex flex-wrap gap-3 text-sm text-text-secondary">
            {patient.gender && <span>{patient.gender}</span>}
            {patient.dateOfBirth && <span>{age(patient.dateOfBirth)} years old</span>}
            {patient.user?.email && <span>{patient.user.email}</span>}
          </div>
          {patient.allergies?.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-error uppercase tracking-wide">Allergies:</span>
              <span className="text-xs font-medium text-text-primary">{patient.allergies.join(', ')}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            to={`/doctor/patients/${patientId}/records/new`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            onClick={e => { e.preventDefault(); setActiveTab('records'); }}
          >
            {icons.plus} New Record
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto rounded-2xl border border-border bg-surface p-1.5 shadow-sm">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        {activeTab === 'overview' && <OverviewTab patient={patient} />}
        {activeTab === 'appointments' && <AppointmentsTab appointments={patient.appointments} />}
        {activeTab === 'records' && <MedicalRecordsTab patientId={patientId} patientName={patientName} />}
        {activeTab === 'prescriptions' && <PrescriptionsTab patientId={patientId} patientName={patientName} />}
      </div>
    </main>
  );
}
