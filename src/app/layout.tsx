import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreLayout from '@/components/layout/StoreLayout';
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
          <StoreLayout>{children}</StoreLayout>
        </CartProvider>
      </body>
    </html>
  );
}
