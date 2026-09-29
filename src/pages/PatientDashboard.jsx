import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { WelcomeHeader } from '../components/dashboard/WelcomeHeader';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ProfileCompletion } from '../components/dashboard/ProfileCompletion';
import { UpcomingAppointment } from '../components/dashboard/UpcomingAppointment';
import { HealthOverview } from '../components/dashboard/HealthOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { HealthTips } from '../components/dashboard/HealthTips';

export function PatientDashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8">
        <WelcomeHeader />
        <QuickActions />
        <ProfileCompletion />

        {/* Two-column layout for medium+ screens */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Left column — wider */}
          <div className="flex flex-col gap-6 lg:col-span-3 lg:gap-8">
            <HealthOverview />
            <HealthTips />
          </div>

          {/* Right column — narrower */}
          <div className="flex flex-col gap-6 lg:col-span-2 lg:gap-8">
            <UpcomingAppointment />
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
