'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Package,
  Layers,
  Award,
  SlidersHorizontal,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { ATB_LOGO } from '@/lib/logoData';
import { dataService } from '@/lib/services/dataService';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  useEffect(() => {
    if (isLoginPage) return;
    const session = localStorage.getItem('atb_admin_session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }

    const checkPending = () => {
      dataService.getOrders().then((ords) => {
        const count = ords.filter((o) => o.status === 'payment_pending').length;
        setPendingPaymentsCount(count);
      });
    };
    checkPending();
    window.addEventListener('atb_orders_updated', checkPending);
    return () => window.removeEventListener('atb_orders_updated', checkPending);
  }, [pathname, isLoginPage, router]);

  const ADMIN_NAV = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    {
      name: 'Payment Queue',
      href: '/admin/payments',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Pending` : undefined,
    },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Brands', href: '/admin/brands', icon: Award },
    { name: 'Sliders / Banners', href: '/admin/sliders', icon: SlidersHorizontal },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
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
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0b474d] border border-slate-200 shrink-0">
            <img src={ATB_LOGO} alt="ATB Admin" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-slate-900 leading-none">ATB Admin</span>
            <span className="text-[10px] text-[#F5921F] font-bold">Portal</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar (Desktop Sticky & Mobile Slide-in Drawer) */}
      <aside
        className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-300 ease-in-out md:flex w-72 md:w-64 bg-white text-slate-700 shrink-0 p-5 flex-col justify-between fixed md:sticky top-0 h-screen z-50 md:z-40 border-r border-slate-200 shadow-xl md:shadow-xs overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Logo & Store Branding */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-[#0b474d] border border-slate-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <img src={ATB_LOGO} alt="ATB ACCESSORIES" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-base font-black text-slate-900 tracking-tight leading-none">ATB</span>
                  <span className="text-base font-black text-[#F5921F] tracking-tight leading-none">AURA</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Admin Portal</p>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#F5921F] text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-rose-600'
                          : 'bg-rose-500 text-white shadow-2xs'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#F5921F]" />
              <span>View Live Website</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar Header inside Admin - Exact Match to Image 1 */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ATB ACCESSORIES AURA Admin
              </h2>
              <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Live System
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage products, categories, mobile banking payments & store settings
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell with Badge 1 */}
            <Link
              href="/admin/payments"
              className="relative p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
              title="1 Pending Verification"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {pendingPaymentsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F5921F] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                  {pendingPaymentsCount}
                </span>
              )}
            </Link>

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/60 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
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
