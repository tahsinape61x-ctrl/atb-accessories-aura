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

  return (
    <>
      <TopHeader />
      <Header />
      <Navbar />
      <main className="flex-grow bg-[#F8FAFC] text-slate-900 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
