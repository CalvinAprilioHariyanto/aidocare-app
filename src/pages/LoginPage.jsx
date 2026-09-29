import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthAccountSwitcher } from '../components/auth/AuthAccountSwitcher';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthVisualPanel } from '../components/auth/AuthVisualPanel';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import loginDoctorImage from '../assets/images/Doctor1.png';

const dosesIcon = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14 4 6 6M12 6l6 6M5 19l8-8m-6 10-3-3 8-8 3 3-8 8Zm11-15 2-2m1 7 2 1M13 2v2" />
  </svg>
);

const accuracyIcon = (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="16" height="16" rx="3" fill="currentColor" />
    <path d="m5.5 10 3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const emailIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password, rememberMe);
      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate(result.user.role === 'doctor' ? '/doctor' : '/patient', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout compact topAlignForm
      visualPanel={(
        <AuthVisualPanel
          title="Your Health, Our Care — Made Simple"
          titleColor="text-green-700"
          description="Access your healthcare journey with ease."
          image={loginDoctorImage}
          imageAlt="A doctor ready to care for patients"
          imageBackdrop
          imageCallouts={[
            { label: '5.7 Million doses insured!', icon: dosesIcon, position: 'bottom-left' },
            { label: '98% Accurate', icon: accuracyIcon, position: 'middle-right' },
          ]}
        />
      )}
    >
      <AuthAccountSwitcher activePage="login" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-2 text-sm text-text-secondary">Continue your care journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          icon={emailIcon}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="flex items-center justify-between gap-4">
          <Checkbox
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            label="Remember me"
          />
          <button
            type="button"
            onClick={() => setNotice('Password reset is not available in this demo yet.')}
            className="shrink-0 text-sm font-medium text-text-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Reset Password
          </button>
        </div>

        {error && <p role="alert" className="text-sm font-medium text-error">{error}</p>}
        {notice && <p role="status" className="text-sm text-text-muted">{notice}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Didn&apos;t have an account yet?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link>
      </p>
    </AuthLayout>
  );
}