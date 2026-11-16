'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { ATB_LOGO } from '@/lib/logoData';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products Catalog', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Customer Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Payments & TrxID', href: '/admin/payments', icon: CreditCard },
  { name: 'Store Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;
    const session = localStorage.getItem('atb_admin_session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoginPage, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('atb_admin_session');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0b474d] border border-slate-700 shrink-0">
            <img src={ATB_LOGO} alt="ATB Admin" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-sm text-white">ATB Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop and Mobile Overlay) */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex w-full md:w-64 bg-slate-900 text-white shrink-0 p-5 flex-col justify-between fixed md:sticky top-0 h-screen z-40 border-r border-slate-800 shadow-xl`}
      >
        <div className="space-y-6">
          {/* Logo & Store Branding */}
          <div className="flex items-center space-x-3 pb-5 border-b border-slate-800">
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#0b474d] border border-slate-700 shadow-md shrink-0">
              <img src={ATB_LOGO} alt="ATB ACCESSORIES" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-tight">ATB ACCESSORIES</h2>
              <p className="text-[10px] text-[#F5921F] font-bold uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#F5921F] text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F5921F]" />
            <span>View Live Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar Header inside Admin */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700">
              ATB ACCESSORIES AURA — Store Administration
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-[#F5921F] hover:underline flex items-center space-x-1"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#0b474d] border border-slate-300 shadow-2xs shrink-0">
                <img src={ATB_LOGO} alt="ATB Admin" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-800">Administrator</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-8 flex-grow max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
