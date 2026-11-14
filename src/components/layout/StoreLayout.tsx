'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopHeader from './TopHeader';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If in admin panel, do not render customer header, navbar, or footer
  if (isAdmin) {
    return <main className="min-h-screen bg-slate-900">{children}</main>;
  }

  return (
    <>
      <TopHeader />
      <Header />
      <Navbar />
      <main className="flex-grow bg-[#F7F8FA] text-slate-900 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
}
