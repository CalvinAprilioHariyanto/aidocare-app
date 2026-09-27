import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthVisualPanel } from '../components/auth/AuthVisualPanel';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';
import { PasswordInput } from '../components/ui/PasswordInput';
import doctorImage from '../assets/images/Doctor2.jpg';

const personIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0H4Z" />
  </svg>
);

const emailIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const phoneIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M6.6 2.8 9.4 2a1.6 1.6 0 0 1 1.9.9l1.3 3.1a1.6 1.6 0 0 1-.4 1.8l-1.7 1.4a14.7 14.7 0 0 0 4.3 4.3l1.4-1.7a1.6 1.6 0 0 1 1.8-.4l3.1 1.3a1.6 1.6 0 0 1 .9 1.9l-.8 2.8a2.2 2.2 0 0 1-2.2 1.6A17.2 17.2 0 0 1 4.9 7.3a2.2 2.2 0 0 1 1.7-4.5Z" />
  </svg>
);

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 15) : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const phone = formData.phone;
    if (!/^\d{7,15}$/.test(phone)) {
      setError('Enter a phone number using 7 to 15 digits.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setError('Please agree to the Terms of Use and Privacy Policy.');
      return;
    }

    const { firstName, lastName, email, password } = formData;
    const result = register({ firstName, lastName, email, phone, password });
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate('/patient', { replace: true });
  }

  return (
    <AuthLayout compact showLogo={false}
      visualPanel={(
        <AuthVisualPanel
          title="Find the Right Care, Faster"
          description="Not sure which specialist to see? Get guided to the right care based on your needs."
          image={doctorImage}
          imageAlt="A doctor ready to help a patient"
          specialties={['General Doctor', 'Cardiology', 'Dermatology', 'Dentist', 'Pediatricians']}
        />
      )}
    >
      <div className="auth-logo mb-6 flex justify-center">
        <Logo className="transform transition-transform hover:scale-[1.02] duration-300" />
      </div>

      <div className="register-tabs mb-6">
        <div className="grid grid-cols-2 rounded-lg bg-surface-muted p-1" aria-label="Account access">
          <span className="rounded-md bg-surface px-3 py-2 text-center text-sm font-semibold text-primary shadow-sm" aria-current="page">
            New Patient
          </span>
          <Link to="/login" className="rounded-md px-3 py-2 text-center text-sm font-medium text-text-secondary transition-colors hover:text-primary">
            Existing Patient
          </Link>
        </div>
      </div>

      <div className="register-heading mb-5">
        <h1 className="text-2xl font-bold text-text-primary">Create Your Account</h1>
        <p className="mt-1 text-sm text-text-secondary">Start your smarter healthcare journey with Aido Care</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form flex flex-col gap-4">
        <div className="register-fields grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            placeholder="e.g. John"
            icon={personIcon}
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            placeholder="e.g. Doe"
            icon={personIcon}
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            icon={emailIcon}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            minLength={7}
            maxLength={15}
            placeholder="089532632332"
            icon={phoneIcon}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="Min. 8 chars (A-Z, 0-9, symbol)"
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            className="register-field sm:col-span-2"
            required
          />
          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="********"
            minLength={8}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="register-field sm:col-span-2"
            required
          />
        </div>

        <Checkbox
          className="register-terms"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          label={(
            <>
              I agree to the handling of personal information.{' '}
              <span className="font-medium text-primary">Terms of Use</span>
            </>
          )}
        />

        {error && <p role="alert" className="text-sm font-medium text-error">{error}</p>}

        <Button type="submit" className="register-submit w-full">Register</Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}
