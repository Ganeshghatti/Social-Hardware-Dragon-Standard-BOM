import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children, pageTitle }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle={pageTitle} />
      <Sidebar />
      <main className="ml-64 pt-16">
        <div className="p-8">{children}</div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

