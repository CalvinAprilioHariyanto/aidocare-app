import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function WelcomeHeader() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {getGreeting()}, {user?.firstName || 'Patient'}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Here's your health overview for today.
        </p>
      </div>
      <p className="text-sm text-text-muted">{formatDate()}</p>
    </div>
  );
}
