import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emptyProfile = {
	firstName: '',
	lastName: '',
	dateOfBirth: '',
	gender: '',
	phone: '',
	bloodType: '',
	height: '',
	weight: '',
	allergies: '',
	medicalConditions: '',
	currentMedications: '',
	previousSurgeries: '',
	otherMedicalInfo: '',
	emergencyContacts: [{ name: '', relationship: '', phone: '' }],
};

const registrationSteps = [
	{ title: 'Personal Information', description: 'Tell us a little about yourself.' },
	{ title: 'Basic Health', description: 'Add health details that can help personalize your care.' },
	{ title: 'Medical History', description: 'Share any relevant medical history.' },
	{ title: 'Emergency Contact', description: 'Add someone we can contact in an emergency.' },
];

const PROFILE_STORAGE_KEY = 'aido_patient_profile';

export function HealthProfilePage({ registrationMode = false }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [profile, setProfile] = useState(() => {
		const initialProfile = {
			...emptyProfile,
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			phone: user?.phone || '',
		};

		try {
			const savedProfile = localStorage.getItem(`${PROFILE_STORAGE_KEY}:${user?.email || 'patient'}`);
			return savedProfile ? { ...initialProfile, ...JSON.parse(savedProfile) } : initialProfile;
		} catch {
			return initialProfile;
		}
	});
	const [saved, setSaved] = useState(false);
	const [photoName, setPhotoName] = useState('profile-photo.jpg');
	const [photoPreview, setPhotoPreview] = useState('');
	const [isBloodDropdownOpen, setIsBloodDropdownOpen] = useState(false);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
	const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
	const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
	const [activeStep, setActiveStep] = useState(0);

	const initials = useMemo(() => {
		const first = (profile.firstName || 'P').charAt(0).toUpperCase();
		const last = (profile.lastName || 'A').charAt(0).toUpperCase();
		return `${first}${last}`;
	}, [profile.firstName, profile.lastName]);

	function handleChange(event) {
		const { name, value } = event.target;
		setProfile((current) => ({ ...current, [name]: value }));
		setSaved(false);
	}

	function handleEmergencyChange(index, field, value) {
		setProfile((current) => ({
			...current,
			emergencyContacts: current.emergencyContacts.map((contact, contactIndex) =>
				contactIndex === index ? { ...contact, [field]: value } : contact
			),
		}));
		setSaved(false);
	}

	function addEmergencyContact() {
		setProfile((current) => ({
			...current,
			emergencyContacts: [...current.emergencyContacts, { name: '', relationship: '', phone: '' }],
		}));
	}

	function removeEmergencyContact(index) {
		setProfile((current) => ({
			...current,
			emergencyContacts: current.emergencyContacts.length === 1
				? [{ name: '', relationship: '', phone: '' }]
				: current.emergencyContacts.filter((_, contactIndex) => contactIndex !== index),
		}));
	}

	function handlePhotoUpload(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);

		setPhotoName(file.name);
		setPhotoPreview(URL.createObjectURL(file));
		setSaved(false);
	}

	function handleBloodTypeSelect(type) {
		setProfile((current) => ({ ...current, bloodType: type }));
		setIsBloodDropdownOpen(false);
		setSaved(false);
	}

	function formatLocalDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function closeDatePicker() {
		setIsDatePickerOpen(false);
		setIsMonthDropdownOpen(false);
	}

	function handleDateSelect(day) {
		const selectedDate = new Date(calendarYear, calendarMonth, day);
		setProfile((current) => ({ ...current, dateOfBirth: formatLocalDate(selectedDate) }));
		closeDatePicker();
		setSaved(false);
	}

	function handleYearInput(value) {
		const nextYear = Number(value);
		if (!Number.isNaN(nextYear)) setCalendarYear(Math.min(2100, Math.max(1900, nextYear)));
	}

	function handleMonthChange(value) {
		setCalendarMonth(Number(value));
		setIsMonthDropdownOpen(false);
	}

	function changeMonth(direction) {
		let nextMonth = calendarMonth + direction;
		let nextYear = calendarYear;
		if (nextMonth > 11) {
			nextMonth = 0;
			nextYear += 1;
		} else if (nextMonth < 0) {
			nextMonth = 11;
			nextYear -= 1;
		}
		setCalendarMonth(nextMonth);
		setCalendarYear(nextYear);
	}

	function getCalendarDays() {
		const startWeekday = new Date(calendarYear, calendarMonth, 1).getDay();
		const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
		const previousMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
		const days = [];

		for (let index = startWeekday - 1; index >= 0; index -= 1) {
			days.push({ day: previousMonthDays - index, isCurrentMonth: false });
		}
		for (let day = 1; day <= daysInMonth; day += 1) {
			days.push({ day, isCurrentMonth: true });
		}
		while (days.length % 7 !== 0) {
			days.push({ day: days.length - startWeekday - daysInMonth + 1, isCurrentMonth: false });
		}
		return days;
	}

	function handleSubmit(event) {
		event.preventDefault();
		const profileToSave = {
			...profile,
			emergencyContacts: profile.emergencyContacts.filter(
				(contact) => contact.name || contact.relationship || contact.phone
			),
		};
		console.log('Saved patient profile:', profileToSave);
		try {
			localStorage.setItem(`${PROFILE_STORAGE_KEY}:${user?.email || 'patient'}`, JSON.stringify(profileToSave));
			setSaved(true);
		} catch {
			setSaved(false);
		}
	}

	function handleFillLater() {
		try {
			localStorage.setItem(`${PROFILE_STORAGE_KEY}:${user?.email || 'patient'}`, JSON.stringify(profile));
		} catch {
		}
		navigate('/patient', { replace: true });
	}

	function goToStep(step) {
		setActiveStep(Math.min(registrationSteps.length - 1, Math.max(0, step)));
		closeDatePicker();
		setIsBloodDropdownOpen(false);
	}

	return (
		<div className={registrationMode ? 'fixed inset-0 h-dvh overflow-hidden bg-background' : 'min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8'}>
			<div className={registrationMode ? 'relative mx-auto flex h-full max-w-5xl flex-col overflow-hidden px-4 py-5 sm:px-6 lg:px-8' : 'mx-auto max-w-7xl'}>
				{registrationMode ? (
					<header className="mb-5 flex shrink-0 items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-card">AC</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Aido Care</p>
								<h1 className="text-lg font-bold text-text-primary">Set up your health profile</h1>
							</div>
						</div>
						<button type="button" onClick={logout} className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary">Log out</button>
					</header>
				) : (
					<header className="mb-8 rounded-[2rem] bg-surface p-5 shadow-card sm:p-6 lg:p-8">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-xl font-bold text-white shadow-card">
								{initials}
							</div>
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Aido Care</p>
								<h1 className="mt-1 text-2xl font-bold text-text-primary sm:text-3xl">
									{registrationMode ? 'COMPLETE YOUR HEALTH PROFILE' : 'HEALTH PROFILE'}
								</h1>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-3">
							<button type="button" onClick={logout} className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:border-primary hover:text-primary">
								Logout
							</button>
							<Button type="submit" form="patient-profile-form">
								{registrationMode ? 'Save Profile' : 'Save Changes'}
							</Button>
						</div>
					</div>
					</header>
				)}

				{registrationMode && (
					<div className="mb-5 shrink-0">
						<div className="mb-3 flex items-center justify-between gap-3">
							<p className="text-sm font-semibold text-text-primary">Step {activeStep + 1} of {registrationSteps.length}</p>
							<p className="text-sm text-text-muted">{Math.round(((activeStep + 1) / registrationSteps.length) * 100)}% complete</p>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-primary-100">
							<div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((activeStep + 1) / registrationSteps.length) * 100}%` }} />
						</div>
						<div className="mt-5">
							<p className="text-sm font-semibold text-primary">HEALTH PROFILE</p>
							<h2 className="mt-1 text-2xl font-bold text-text-primary sm:text-3xl">{registrationSteps[activeStep].title}</h2>
							<p className="mt-2 text-sm text-text-secondary">{registrationSteps[activeStep].description}</p>
						</div>
					</div>
				)}

				<div className={registrationMode ? 'flex min-h-0 flex-1 flex-col pb-24' : 'grid gap-6 xl:grid-cols-[1.6fr_0.8fr]'}>
					<form id="patient-profile-form" onSubmit={handleSubmit} className={registrationMode ? 'flex min-h-0 flex-1 flex-col space-y-4' : 'space-y-6'}>
						<section className={`rounded-[2rem] border border-border bg-surface p-5 shadow-card sm:p-6 ${registrationMode && activeStep !== 0 ? 'hidden' : ''}`}>
							<div className="mb-5 flex items-center gap-3">
								<span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary">01</span>
								<h2 className="text-xl font-bold text-text-primary">Personal Information</h2>
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								<Input label="First Name" name="firstName" type="text" value={profile.firstName} onChange={handleChange} />
								<Input label="Last Name" name="lastName" type="text" value={profile.lastName} onChange={handleChange} />
								<div>
									<label className="mb-2 block text-sm font-medium text-text-secondary ml-1">Date of Birth</label>
									<div className="relative">
										<button type="button" onClick={() => setIsDatePickerOpen((current) => !current)} className={`flex w-full items-center justify-between rounded-xl border bg-surface px-4 py-3.5 text-left shadow-sm transition-all duration-200 ${isDatePickerOpen ? 'border-primary ring-4 ring-primary/10' : 'border-border hover:border-primary-300'}`}>
											<span className={`text-base ${profile.dateOfBirth ? 'text-text-primary' : 'text-text-placeholder'}`}>
												{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'mm/dd/yyyy'}
											</span>
											<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-text-muted" aria-hidden="true">
												<rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
												<path d="M8 3v4M16 3v4M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
											</svg>
										</button>
										{isDatePickerOpen && (
											<div className="absolute z-20 mt-2 w-full rounded-2xl border border-primary-200 bg-surface p-3 shadow-card">
												<div className="mb-3 flex items-center justify-between gap-2">
													<button type="button" onClick={() => changeMonth(-1)} className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-text-primary hover:bg-primary-50">←</button>
													<div className="relative flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-2 py-1.5">
														<button type="button" aria-expanded={isMonthDropdownOpen} onClick={() => setIsMonthDropdownOpen((current) => !current)} className="flex items-center gap-1 rounded-lg px-1.5 py-1 text-sm font-semibold text-text-primary transition hover:bg-primary-50 hover:text-primary">
															{new Date(2024, calendarMonth, 1).toLocaleString('en-US', { month: 'long' })}
															<svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
														</button>
														{isMonthDropdownOpen && (
															<div className="absolute left-0 top-full z-30 mt-2 grid w-56 grid-cols-3 gap-1 rounded-2xl border border-primary-100 bg-surface p-2 shadow-xl shadow-primary/10">
																{Array.from({ length: 12 }, (_, index) => (
																	<button key={index} type="button" onClick={() => handleMonthChange(index)} className={`rounded-xl px-2 py-2 text-sm font-medium transition ${calendarMonth === index ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-primary-50 hover:text-primary'}`}>
																		{new Date(2024, index, 1).toLocaleString('en-US', { month: 'short' })}
																	</button>
																))}
															</div>
														)}
														<input type="number" min="1900" max="2100" value={calendarYear} onChange={(event) => handleYearInput(event.target.value)} className="w-20 rounded-lg border border-border bg-white px-2 py-1 text-sm font-semibold text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
													</div>
													<button type="button" onClick={() => changeMonth(1)} className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-text-primary hover:bg-primary-50">→</button>
												</div>
												<div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-text-muted">
													{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
												</div>
												<div className="grid grid-cols-7 gap-1">
													{getCalendarDays().map(({ day, isCurrentMonth }, index) => {
														const selectedDate = profile.dateOfBirth ? new Date(profile.dateOfBirth) : null;
														const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === calendarMonth && selectedDate.getFullYear() === calendarYear && isCurrentMonth;
														const today = new Date();
														const isToday = today.getDate() === day && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear && isCurrentMonth;
														return (
															<button key={`${day}-${index}`} type="button" onClick={() => isCurrentMonth && handleDateSelect(day)} className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition ${!isCurrentMonth ? 'text-text-placeholder opacity-50' : 'text-text-primary hover:bg-primary-50'} ${isSelected ? 'bg-primary text-white shadow-sm' : ''} ${isToday && !isSelected ? 'border border-primary/30 bg-primary-50 text-primary' : ''}`}>
																{day}
															</button>
														);
													})}
												</div>
											</div>
										)}
									</div>
								</div>
								<Input label="Gender" name="gender" type="text" value={profile.gender} onChange={handleChange} placeholder="Male / Female" />
								<div className="md:col-span-2"><Input label="Phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} /></div>
							</div>
						</section>

						<section className={`rounded-[2rem] border border-border bg-surface p-5 shadow-card sm:p-6 ${registrationMode && activeStep !== 1 ? 'hidden' : ''}`}>
							<div className="mb-5 flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary">02</span><h2 className="text-xl font-bold text-text-primary">Basic Health</h2></div>
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium text-text-secondary ml-1">Blood Type</label>
									<div className="relative">
										<button type="button" onClick={() => setIsBloodDropdownOpen((current) => !current)} className={`flex w-full items-center justify-between rounded-xl border bg-surface px-4 py-3.5 text-left shadow-sm transition-all duration-200 ${isBloodDropdownOpen ? 'border-primary ring-4 ring-primary/10' : 'border-border hover:border-primary-300'}`}>
											<span className={`text-base ${profile.bloodType ? 'text-text-primary' : 'text-text-placeholder'}`}>{profile.bloodType || 'Select blood type'}</span>
											<svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isBloodDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
										</button>
										{isBloodDropdownOpen && <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-primary-200 bg-surface shadow-card">{bloodTypes.map((type) => <button key={type} type="button" onClick={() => handleBloodTypeSelect(type)} className={`flex w-full items-center justify-between px-4 py-3 text-left text-lg font-medium transition-colors ${profile.bloodType === type ? 'bg-primary text-white' : 'text-text-primary hover:bg-primary-50 hover:text-primary'}`}><span>{type}</span>{profile.bloodType === type && <span className="text-sm font-semibold">✓</span>}</button>)}</div>}
									</div>
								</div>
								<Input label="Height" name="height" type="text" value={profile.height} onChange={handleChange} placeholder="170 cm" />
								<Input label="Weight" name="weight" type="text" value={profile.weight} onChange={handleChange} placeholder="62 kg" />
								<Input label="Allergies" name="allergies" type="text" value={profile.allergies} onChange={handleChange} placeholder="Peanuts, Penicillin" />
								<div className="md:col-span-2"><Input label="Medical Conditions" name="medicalConditions" type="text" value={profile.medicalConditions} onChange={handleChange} placeholder="Asthma, Diabetes" /></div>
							</div>
						</section>

						<section className={`rounded-[2rem] border border-border bg-surface p-5 shadow-card sm:p-6 ${registrationMode && activeStep !== 2 ? 'hidden' : ''}`}>
							<div className="mb-5 flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary">03</span><h2 className="text-xl font-bold text-text-primary">Medical History</h2></div>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="md:col-span-2"><Input label="Current Medications" name="currentMedications" type="text" value={profile.currentMedications} onChange={handleChange} placeholder="Vitamin C, Ibuprofen" /></div>
								<div className="md:col-span-2"><Input label="Previous Surgeries" name="previousSurgeries" type="text" value={profile.previousSurgeries} onChange={handleChange} placeholder="Appendectomy (2017)" /></div>
								<div className="md:col-span-2">
									<label className="mb-2 block text-sm font-medium text-text-secondary ml-1">Other Medical Information</label>
									<textarea name="otherMedicalInfo" value={profile.otherMedicalInfo} onChange={handleChange} rows={registrationMode ? 2 : 4} className="w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-text-primary outline-none transition duration-200 hover:border-primary-300 focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="Any notes, preferences, or important medical information" />
								</div>
							</div>
						</section>

						<section className={`rounded-[2rem] border border-border bg-surface p-5 shadow-card sm:p-6 ${registrationMode && activeStep !== 3 ? 'hidden' : ''} ${registrationMode && activeStep === 3 ? 'flex min-h-0 flex-1 flex-col' : ''}`}>
							<div className="mb-5 flex shrink-0 items-center justify-between gap-3">
								<div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary">04</span><h2 className="text-xl font-bold text-text-primary">Emergency Contact</h2></div>
								<button type="button" onClick={addEmergencyContact} className="rounded-xl bg-primary-50 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-100">+ Add Contact</button>
							</div>
							<div className={`space-y-4 ${registrationMode && activeStep === 3 ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1' : ''}`}>
								{profile.emergencyContacts.map((contact, index) => (
									<div key={index} className="rounded-2xl border border-border bg-surface-muted p-4">
										<div className="mb-3 flex items-center justify-between gap-2">
											<p className="text-sm font-semibold text-text-primary">Contact {index + 1}</p>
											{profile.emergencyContacts.length > 1 && <button type="button" onClick={() => removeEmergencyContact(index)} className="text-sm font-medium text-error hover:underline">Remove</button>}
										</div>
										<div className="grid gap-4 md:grid-cols-3">
											<Input label="Name" type="text" value={contact.name} onChange={(event) => handleEmergencyChange(index, 'name', event.target.value)} placeholder="Jane Patient" />
											<Input label="Relationship" type="text" value={contact.relationship} onChange={(event) => handleEmergencyChange(index, 'relationship', event.target.value)} placeholder="Mother" />
											<Input label="Phone" type="tel" value={contact.phone} onChange={(event) => handleEmergencyChange(index, 'phone', event.target.value)} placeholder="+62 812 3456 7891" />
										</div>
									</div>
								))}
							</div>
						</section>
						{registrationMode && (
							<div className="absolute inset-x-4 bottom-5 z-20 space-y-4 bg-background/95 pt-4 backdrop-blur sm:inset-x-6 lg:inset-x-8">
								<div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<button type="button" onClick={handleFillLater} className="text-sm font-semibold text-primary transition hover:text-primary-800">Fill later</button>
									<p className="mt-1 text-xs text-text-muted">You can fill this later in Settings → Profile.</p>
								</div>
								<div className="flex items-center justify-between gap-3 sm:justify-end">
									{activeStep > 0 && <button type="button" onClick={() => goToStep(activeStep - 1)} className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary">Back</button>}
									{activeStep < registrationSteps.length - 1 ? (
										<button type="button" onClick={() => goToStep(activeStep + 1)} className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700">Continue</button>
									) : (
										<button type="submit" className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700">{saved ? 'Saved' : 'Save profile'}</button>
									)}
								</div>
								</div>
							</div>
						)}
					</form>

					<aside className={registrationMode ? 'hidden' : 'space-y-6'}>
						<div className="rounded-[2rem] border border-border bg-surface p-5 shadow-card sm:p-6">
							<div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-text-primary">Patient Snapshot</h3><span className="rounded-full bg-success-light px-2.5 py-1 text-xs font-semibold text-success">Active</span></div>
							<div className="flex items-center gap-4 border-b border-border pb-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-lg font-bold text-primary">{initials}</div>
								<div><p className="text-xl font-bold text-text-primary">{profile.firstName || 'Patient'} {profile.lastName}</p><p className="text-sm text-text-secondary">Patient ID: PAT-001</p></div>
							</div>
							<div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
								<div className="rounded-2xl bg-primary-50 p-3"><p className="text-xs uppercase tracking-wide text-text-muted">Blood Type</p><p className="mt-1 text-lg font-bold text-primary">{profile.bloodType || '—'}</p></div>
								<div className="rounded-2xl bg-surface-muted p-3"><p className="text-xs uppercase tracking-wide text-text-muted">Height</p><p className="mt-1 text-lg font-bold text-text-primary">{profile.height || '—'}</p></div>
								<div className="rounded-2xl bg-surface-muted p-3"><p className="text-xs uppercase tracking-wide text-text-muted">Weight</p><p className="mt-1 text-lg font-bold text-text-primary">{profile.weight || '—'}</p></div>
							</div>
						</div>
						<div className="rounded-[2rem] border border-border bg-surface p-5 shadow-card sm:p-6">
							<div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-text-primary">Profile Photo</h3><span className="text-xs font-medium text-text-muted">Optional</span></div>
							<label className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-primary-200 bg-primary-50 p-4 text-center transition hover:border-primary hover:bg-primary-100/40">
								<div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-surface text-2xl text-primary shadow-sm" style={photoPreview ? { backgroundImage: `url(${photoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>{!photoPreview && <span>+</span>}</div>
								<span className="text-sm font-semibold text-primary">Upload Photo</span>
								<span className="mt-1 text-xs text-text-muted">{photoName}</span>
								<input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 cursor-pointer opacity-0" />
							</label>
						</div>
						{saved && <div className="rounded-[1.5rem] border border-success/20 bg-success-light p-4 text-sm font-medium text-success shadow-sm">{registrationMode ? 'Your health profile has been saved.' : 'Your profile has been updated successfully.'}</div>}
					</aside>
				</div>
			</div>
		</div>
	);
}
