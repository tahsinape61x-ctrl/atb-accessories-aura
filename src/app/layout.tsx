import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TopHeader from '@/components/layout/TopHeader';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FacebookPixel from '@/components/FacebookPixel';
import { CartProvider } from '@/context/CartContext';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ATB ACCESSORIES AURA | Official Phone & Gadget Accessories Bangladesh',
  description: 'Buy 100% genuine chargers, AirPods, cables, earphones, neckbands, bluetooth speakers, power banks & smart watches at best prices in Bangladesh. Fast home delivery & Cash on Delivery.',
  keywords: ['ATB ACCESSORIES AURA', 'ATB Accessories', 'gadgets Bangladesh', 'iPhone accessories BD', 'Anker charger Bangladesh', 'bKash payment', 'TWS earbuds BD'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-full max-w-full overflow-x-hidden">
      <body className={`${inter.className} w-full max-w-full overflow-x-hidden min-h-screen flex flex-col`}>
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <CartProvider>
          <TopHeader />
          <Header />
          <Navbar />
          <main className="flex-grow bg-[#F7F8FA] text-slate-900 w-full max-w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
