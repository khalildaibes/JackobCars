import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Store Owner Dashboard - Car Dealer App',
  description: 'Manage your car listings, view analytics, and handle customer interactions',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
} 