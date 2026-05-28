'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  LayoutDashboard,
  AlertCircle,
  Users,
  Bug,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Image as ImageIcon,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/rescues', label: 'Rescue Requests', icon: AlertCircle },
  { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { href: '/admin/species', label: 'Snake Species', icon: Bug },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/blog', label: 'Blog & Content', icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Don't render layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (item: typeof NAV_ITEMS[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0a1215] border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">BSR Admin</p>
          <p className="text-gray-500 text-xs">Control Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-white bg-white/10'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-gray-300'}`} />
              <span className="text-sm font-medium">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white bg-white/10 transition-all text-sm">
          <ShieldAlert className="w-4 h-4" /> View Public Site
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white bg-red-500/30 transition-all text-sm disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" /> {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1a1c] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-56 xl:w-64 flex-col fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 inset-y-0 w-64 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-56 xl:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0a1215]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-sm">
              {NAV_ITEMS.find(n => isActive(n))?.label ?? 'Admin'}
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
