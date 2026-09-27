import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

const destinations = {
  login: { label: 'New Patient', path: '/register' },
  register: { label: 'Existing Patient', path: '/login' },
};

export function AuthAccountSwitcher({ activePage }) {
  const activeLabel = activePage === 'register' ? 'New Patient' : 'Existing Patient';
  const inactiveDestination = destinations[activePage];

  return (
    <div className="auth-account-switcher mb-6">
      <Logo className="auth-logo mb-6 justify-center" />
      <div className="grid h-12 w-full grid-cols-2 rounded-lg bg-surface-muted p-1" aria-label="Account access">
        {activePage === 'register' ? (
          <span className="flex h-10 min-w-0 w-full items-center justify-center whitespace-nowrap rounded-md bg-surface px-3 text-center text-sm font-medium text-primary shadow-sm" aria-current="page">
            {activeLabel}
          </span>
        ) : (
          <Link to="/register" className="flex h-10 min-w-0 w-full items-center justify-center whitespace-nowrap rounded-md px-3 text-center text-sm font-medium text-text-secondary transition-colors hover:text-primary">
            New Patient
          </Link>
        )}

        {activePage === 'login' ? (
          <span className="flex h-10 min-w-0 w-full items-center justify-center whitespace-nowrap rounded-md bg-surface px-3 text-center text-sm font-medium text-primary shadow-sm" aria-current="page">
            {activeLabel}
          </span>
        ) : (
          <Link to={inactiveDestination.path} className="flex h-10 min-w-0 w-full items-center justify-center whitespace-nowrap rounded-md px-3 text-center text-sm font-medium text-text-secondary transition-colors hover:text-primary">
            {inactiveDestination.label}
          </Link>
        )}
      </div>
    </div>
  );
}