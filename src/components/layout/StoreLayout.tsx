'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopHeader from './TopHeader';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Complete isolation for Admin Panel: zero customer headers, zero customer navbars, zero customer footers
  if (isAdmin) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] text-slate-900 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    );
  }

  // Customer Storefront Layout (Web & Mobile optimized)
  return (
    <>
      <TopHeader />
      <Header />
      <Navbar />
      <main className="flex-grow bg-[#F8FAFC] text-slate-900 w-full max-w-full overflow-x-hidden pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
