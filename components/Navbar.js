'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar({ pageTitle }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-10">
      <div className="flex items-center justify-between h-full px-6 pl-72">
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ff6600] flex items-center justify-center text-white font-bold">
            A
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-[#ff6600] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

