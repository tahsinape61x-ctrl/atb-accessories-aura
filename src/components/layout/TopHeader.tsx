'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Phone } from 'lucide-react';

export default function TopHeader() {
  return (
    <div className="bg-slate-100 text-slate-600 text-xs border-b border-slate-200 py-2 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 text-slate-700">
            <Truck className="w-4 h-4 text-[#F5921F]" />
            <span>Fast Delivery across Bangladesh (Inside Dhaka ৳60 / Outside Dhaka ৳120)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Official & Authentic Accessories</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="https://wa.me/8801706312594"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-slate-700 hover:text-[#F5921F] font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hotline / WhatsApp: 01706-312594</span>
          </a>
          <Link href="/track-order" className="hover:text-[#F5921F] transition-colors text-slate-700 font-bold">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
