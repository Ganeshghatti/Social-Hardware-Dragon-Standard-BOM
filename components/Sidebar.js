'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/parts', label: 'Parts', icon: '⚙️' },
  { path: '/admin/boms', label: 'BOMs', icon: '🧱' },
  { path: '/admin/workorders', label: 'Work Orders', icon: '🦿' },
  { path: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { path: '/admin/suppliers', label: 'Suppliers', icon: '🧾' },
  { path: '/admin/purchase-orders', label: 'Purchase Orders', icon: '📝' },
  { path: '/admin/qc', label: 'QC', icon: '🔍' },
  { path: '/admin/reports', label: 'Reports', icon: '📊' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#1f1f1f] min-h-screen fixed left-0 top-0 pt-16">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#ff6600] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

