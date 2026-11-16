'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, ShoppingBag, PackageCheck, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/category/charger', icon: Layers },
    { label: 'Track', href: '/track-order', icon: PackageCheck },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-[#F5921F] font-black' : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F5921F] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* WhatsApp direct chat button */}
        <a
          href="https://wa.me/8801706312594"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
        >
          <MessageCircle className="w-5 h-5 fill-emerald-100" />
          <span className="text-[10px] mt-0.5 tracking-tight">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
