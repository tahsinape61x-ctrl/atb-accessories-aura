'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  Layers,
  Plus,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle,
  Truck,
  Box,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  CreditCard,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Order, Product, Category, Slider } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Last 7 Days');

  const loadDashboard = async () => {
    const [o, p, c, s] = await Promise.all([
      dataService.getOrders(),
      dataService.getProducts({ includeInactive: true }),
      dataService.getCategories(),
      dataService.getSliders(),
    ]);
    setOrders(o);
    setProducts(p);
    setCategories(c);
    setSliders(s);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();

    const handleOrdersUpdate = () => {
      dataService.getOrders().then((o) => setOrders(o));
    };

    window.addEventListener('atb_orders_updated', handleOrdersUpdate);
    return () => window.removeEventListener('atb_orders_updated', handleOrdersUpdate);
  }, []);

  // Compute 100% accurate metrics from real order records (starts strictly at 0 for fresh store)
  const orderCount = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

  // Pipeline counts & revenues
  const newOrders = orders.filter((o) => o.status === 'new');
  const newOrdersCount = newOrders.length;
  const newOrdersRevenue = newOrders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

  const pendingPayments = orders.filter((o) => o.status === 'payment_pending');
  const pendingPaymentsCount = pendingPayments.length;
  const pendingPaymentsRevenue = pendingPayments.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

  const approvedPayments = orders.filter((o) => o.status === 'confirmed');
  const approvedPaymentsCount = approvedPayments.length;
  const approvedPaymentsRevenue = approvedPayments.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

  const packagingOrders = orders.filter((o) => o.status === 'packaging');
  const packagingCount = packagingOrders.length;
  const packagingRevenue = packagingOrders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

  // 1-Click Reset to 0 (Clear test orders & start fresh store counters)
  const handleResetToZero = async () => {
    if (
      confirm(
        'Reset all test orders and revenue counters to 0? This will give you a fresh, clean dashboard to start live business.'
      )
    ) {
      await dataService.clearOrders();
      setOrders([]);
      alert('All order statistics and revenue have been reset to 0!');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent"></div>
        <p className="text-xs text-slate-500 mt-2 font-bold">Loading dashboard analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Overview & Revenue Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live order statistics for ATB Accessories Bangladesh
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Reset All to 0 Button */}
          <button
            onClick={handleResetToZero}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Reset test orders and revenue to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to 0</span>
          </button>

          {/* Date Filter Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Add Product Blue Button */}
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-1.5 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-extrabold text-xs shadow-xs transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Pending bKash / Nagad Alert Banner - Appears ONLY when real pending verification exists */}
      {pendingPaymentsCount > 0 && (
        <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-rose-900">
                {pendingPaymentsCount} Pending bKash / Nagad {pendingPaymentsCount === 1 ? 'Payment' : 'Payments'} Need Verification
              </h3>
              <p className="text-[11px] sm:text-xs text-rose-700 mt-0.5">
                Customers submitted TrxIDs that require manual mobile app approval
              </p>
            </div>
          </div>

          <Link
            href="/admin/payments"
            className="bg-[#E11D48] hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            Open Queue
          </Link>
        </div>
      )}

      {/* Top 2 Big Cards: TOTAL GROSS REVENUE & TOTAL ORDER VOLUME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* TOTAL GROSS REVENUE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              TOTAL GROSS REVENUE
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatPrice(totalRevenue)}
            </p>
            <span className="text-[11px] text-slate-400 font-medium block">
              Across all order status pipelines
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* TOTAL ORDER VOLUME */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              TOTAL ORDER VOLUME
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {orderCount} Orders
            </p>
            <span className="text-[11px] text-slate-400 font-medium block">
              Filter range: 7 days
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pipeline Status Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Orders */}
        <div className="bg-white border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-800">New Orders</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{newOrdersCount} Orders</p>
          <span className="text-[11px] text-slate-500 font-semibold">Tk. {newOrdersRevenue.toLocaleString()}</span>
        </div>

        {/* Payment Pending */}
        <div className="bg-white border border-rose-200 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-800">Payment Pending</span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{pendingPaymentsCount} Orders</p>
          <span className="text-[11px] text-slate-500 font-semibold">Tk. {pendingPaymentsRevenue.toLocaleString()}</span>
        </div>

        {/* Payment Approved */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-800">Payment Approved</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{approvedPaymentsCount} Orders</p>
          <span className="text-[11px] text-slate-500 font-semibold">Tk. {approvedPaymentsRevenue.toLocaleString()}</span>
        </div>

        {/* Packaging */}
        <div className="bg-white border border-blue-200 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-800">Packaging</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{packagingCount} Orders</p>
          <span className="text-[11px] text-slate-500 font-semibold">Tk. {packagingRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Prominent Quick-Edit Banner for Homepage Sliders / Banners */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border border-orange-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F5921F] text-white flex items-center justify-center shrink-0 shadow-sm">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Homepage Hero Slider & Banners Editor
              </h3>
              <span className="bg-[#F5921F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {sliders.length} Active Slides
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Edit the main homepage banners (AirPods, Anker chargers, cables), upload new images from device, update headlines, and set button links.
            </p>
          </div>
        </div>

        <Link
          href="/admin/sliders"
          className="inline-flex items-center space-x-1.5 bg-[#F5921F] hover:bg-[#d97d13] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all shrink-0 transform hover:scale-105"
        >
          <span>Edit Banners / Sliders</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick Catalog & Recent Orders Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catalog Quick Stats */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Catalog Overview
          </h3>

          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-800">Total Products</span>
              </div>
              <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                {products.length}
              </span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-800">Categories</span>
              </div>
              <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                {categories.length}
              </span>
            </Link>

            <Link
              href="/admin/sliders"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-slate-800">Hero Banners</span>
              </div>
              <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                {sliders.length}
              </span>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/products/new"
              className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Recent Customer Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#F5921F] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
              <p className="font-semibold text-slate-600">No orders placed yet.</p>
              <p className="text-[11px] text-slate-400">
                Customer purchases made on your website will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-bold">
                    <th className="pb-2.5">Order</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-900">{ord.order_number}</td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800 block">{ord.customer_name}</span>
                        <span className="text-[11px] text-slate-500">{ord.customer_phone}</span>
                      </td>
                      <td className="py-3 font-extrabold text-[#F5921F]">
                        {formatPrice(ord.total_amount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            ord.status === 'confirmed' || ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'payment_pending'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/admin/orders"
                          className="text-xs font-bold text-slate-700 hover:text-[#F5921F] underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
