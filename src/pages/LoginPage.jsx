import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthVisualPanel } from '../components/auth/AuthVisualPanel';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import loginDoctorImage from '../assets/images/Doctor1.png';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const result = login(formData.email, formData.password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(result.user.role === 'doctor' ? '/doctor' : '/patient', { replace: true });
  }

  return (
    <AuthLayout
      visualPanel={(
        <AuthVisualPanel
          eyebrow="YOUR HEALTH, OUR CARE"
          title="Care that feels simple"
          description="Access your care journey with ease. Your health deserves a team that is here for you."
          image={loginDoctorImage}
          imageAlt="A doctor ready to care for patients"
        />
      )}
    >
      <div className="mb-6">
        <div className="grid grid-cols-2 rounded-lg bg-surface-muted p-1" aria-label="Account access">
          <Link to="/register" className="rounded-md px-3 py-2 text-center text-sm font-medium text-text-secondary transition-colors hover:text-primary">
            New Patient
          </Link>
          <span className="rounded-md bg-surface px-3 py-2 text-center text-sm font-semibold text-primary shadow-sm" aria-current="page">
            Existing Patient
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-text-secondary">Continue your care journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
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

        {error && <p role="alert" className="text-sm font-medium text-error">{error}</p>}

        <Button type="submit" className="w-full">Log in</Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        New to Aido Care?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
