import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop, by top bar on mobile */}
      <main className="pt-16 lg:pt-0 lg:pl-[260px]">
        <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8 max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
