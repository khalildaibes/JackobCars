'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { FaCar, FaCogs, FaChartBar, FaUser, FaBell, FaFileAlt, FaPlus } from 'react-icons/fa';
import { BiSolidOffer } from 'react-icons/bi';

interface SidebarItem {
  title: string;
  icon: IconType;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { title: 'My Cars', icon: FaCar, href: '/dashboard/cars' },
  { title: 'Parts for Sale', icon: FaCogs, href: '/dashboard/parts' },
  { title: 'Analytics', icon: FaChartBar, href: '/dashboard/analytics' },
  { title: 'Profile Settings', icon: FaUser, href: '/dashboard/settings' },
  { title: 'Notifications', icon: FaBell, href: '/dashboard/notifications' },
  { title: 'Draft Listings', icon: FaFileAlt, href: '/dashboard/drafts' },
];

const DashboardPage = () => {
  const [totalListings] = useState(0);
  const [offersReceived] = useState(0);

  return (
    <div className="flex min-h-screen bg-gray-100 mt-[5%]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2D3748] text-white">
        <nav className="p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            ))}
            <button className="w-full flex items-center space-x-3 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mt-4">
              <FaPlus className="w-5 h-5" />
              <span>Add New Car/Part</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Listed Cars</h3>
            <p className="text-3xl font-bold">{totalListings}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Offers Received</h3>
            <p className="text-3xl font-bold">{offersReceived}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Post New Car
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Latest Offers
            </button>
          </div>
        </div>

        {/* Latest Offers & Popular Cars */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Latest Offers</h2>
            <div className="space-y-4">
              {/* Placeholder for offers */}
              <p className="text-gray-500">No offers yet</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Popular Cars</h2>
            <div className="space-y-4">
              {/* Placeholder for popular cars */}
              <p className="text-gray-500">No popular cars yet</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 