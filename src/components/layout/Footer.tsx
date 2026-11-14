'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, CreditCard, RefreshCw, Phone, MapPin, Mail, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-600 text-xs border-t border-slate-200 w-full max-w-full overflow-x-hidden">
      
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 bg-[#F7F8FA] border border-slate-200 p-3.5 rounded-2xl">
            <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-xl text-[#F5921F] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">100% Genuine Products</h4>
              <p className="text-slate-500 text-[11px]">Official warranty & authentic gear</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-[#F7F8FA] border border-slate-200 p-3.5 rounded-2xl">
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Fastest Delivery in BD</h4>
              <p className="text-slate-500 text-[11px]">Dhaka 24h, Chittagong & BD 48h</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-[#F7F8FA] border border-slate-200 p-3.5 rounded-2xl">
            <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-xl text-purple-600 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">bKash / Nagad & COD</h4>
              <p className="text-slate-500 text-[11px]">Multiple payment channels</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-[#F7F8FA] border border-slate-200 p-3.5 rounded-2xl">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-600 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Easy Replacement</h4>
              <p className="text-slate-500 text-[11px]">7 days replacement policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Store Intro & Social Links */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black text-[#F5921F]">
              ATB <span className="text-slate-900 ml-1 font-extrabold">AURA</span>
            </span>
          </Link>
          <p className="text-slate-600 leading-relaxed text-xs font-medium">
            <strong>ATB ACCESSORIES AURA</strong> — Your premier destination for chargers, AirPods, cables, earphones, speakers, power banks, and smartwatches in Bangladesh.
          </p>
          <div className="pt-1">
            <a
              href="https://wa.me/8801706312594"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold transition-colors text-xs shadow-sm"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp: 01706-312594</span>
            </a>
          </div>
          <div className="pt-2 space-y-2">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
              Follow Us On Social Media
            </span>
            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com/share/18qi8gzsJg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-slate-300 text-blue-600 hover:bg-[#F5921F] hover:text-white hover:border-[#F5921F] flex items-center justify-center transition-all shadow-sm transform hover:scale-110"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://www.instagram.com/atb_accessories_aura?igsh=ZWN2bDEwaHliajZ6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-slate-300 text-pink-600 hover:bg-[#F5921F] hover:text-white hover:border-[#F5921F] flex items-center justify-center transition-all shadow-sm transform hover:scale-110"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div>
          <h5 className="font-extrabold text-slate-900 text-xs mb-3 uppercase tracking-wider">
            Explore Categories
          </h5>
          <ul className="space-y-2 text-slate-600 font-semibold">
            <li><Link href="/category/charger" className="hover:text-[#F5921F] transition-colors">Charger</Link></li>
            <li><Link href="/category/airpods-bluetooth" className="hover:text-[#F5921F] transition-colors">AirPods / Bluetooth</Link></li>
            <li><Link href="/category/cables" className="hover:text-[#F5921F] transition-colors">Cables</Link></li>
            <li><Link href="/category/earphones-neckbands" className="hover:text-[#F5921F] transition-colors">Earphones / Neckbands</Link></li>
            <li><Link href="/category/speaker" className="hover:text-[#F5921F] transition-colors">Speaker</Link></li>
            <li><Link href="/category/power-bank" className="hover:text-[#F5921F] transition-colors">Power Bank</Link></li>
            <li><Link href="/category/smart-watch" className="hover:text-[#F5921F] transition-colors">Smart Watch</Link></li>
          </ul>
        </div>

        {/* Col 3: Customer Support */}
        <div>
          <h5 className="font-extrabold text-slate-900 text-xs mb-3 uppercase tracking-wider">
            Customer Support & Info
          </h5>
          <ul className="space-y-2 text-slate-600 font-semibold">
            <li><Link href="/track-order" className="hover:text-[#F5921F] transition-colors">Track Your Order</Link></li>
            <li><Link href="/about" className="hover:text-[#F5921F] transition-colors">About ATB ACCESSORIES AURA</Link></li>
            <li><Link href="/contact" className="hover:text-[#F5921F] transition-colors">Contact Us</Link></li>
            <li><Link href="/terms" className="hover:text-[#F5921F] transition-colors">Warranty & Return Policy</Link></li>
            <li><Link href="/privacy" className="hover:text-[#F5921F] transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Col 4: Store Contact & Payment Numbers */}
        <div className="space-y-4">
          <h5 className="font-extrabold text-slate-900 text-xs mb-1 uppercase tracking-wider">
            Store Contact Details
          </h5>
          <div className="text-[11px] text-slate-700 space-y-2 font-semibold">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#F5921F] shrink-0" />
              <span>Hotline / WhatsApp: 01706-312594</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#F5921F] shrink-0" />
              <span>Location: Chittagong, Bangladesh</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#F5921F] shrink-0" />
              <span>Email: atbaccessories30@gmail.com</span>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[11px] font-extrabold text-slate-900 block mb-1.5 uppercase">
              Mobile Banking Numbers
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 rounded font-bold text-[10px]">
                bKash: 01706-312594
              </span>
              <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded font-bold text-[10px]">
                Nagad: 01706-312594
              </span>
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-bold text-[10px]">
                Rocket: 01706-312594
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Payment Methods Bar */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm text-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 sm:mb-3">
            Guaranteed Safe & Secure Checkout — Supported Payment Methods
          </span>
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 py-1 text-xs font-bold text-slate-700">
            <span className="bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1 rounded-lg">bKash Send Money</span>
            <span className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-lg">Nagad Send Money</span>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-lg">Rocket Send Money</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-200 bg-white py-4 px-4 text-center text-slate-500 text-[11px] font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© 2026 ATB ACCESSORIES AURA. All Rights Reserved.</p>
          <p className="text-slate-500">
            Developed by{' '}
            <a href="https://tahsingenstudio.com" target="_blank" rel="noopener noreferrer" className="text-[#F5921F] font-bold hover:underline">
              TAHSINGENSTUDIO
            </a>
          </p>
        </div>
      </div>

    </footer>
  );
}
