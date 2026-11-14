'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, DollarSign, Package, Layers, Plus, ArrowRight } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Order, Product, Category } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const [o, p, c] = await Promise.all([
        dataService.getOrders(),
        dataService.getProducts({ includeInactive: true }),
        dataService.getCategories(),
      ]);
      setOrders(o);
      setProducts(p);
      setCategories(c);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent"></div>
        <p className="text-xs text-slate-500 mt-2">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Overview of store sales, catalog, and recent customer orders</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{formatPrice(totalRevenue)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{orders.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Products</span>
            <Package className="w-4 h-4 text-[#F5921F]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{products.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Categories</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{categories.length}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Recent Customer Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-[#F5921F] hover:underline flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No orders placed yet. Orders made by customers will appear here immediately.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{ord.order_number}</td>
                    <td className="py-3.5 px-4 text-slate-700">{ord.customer_name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{ord.customer_phone}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{formatPrice(ord.total_amount)}</td>
                    <td className="py-3.5 px-4 uppercase text-slate-600 font-semibold">{ord.payment_method}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-[#F5921F]">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
