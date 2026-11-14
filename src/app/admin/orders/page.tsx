'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Order, OrderStatus } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    const data = await dataService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await dataService.updateOrderStatus(orderId, newStatus);
      if (updated) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(
    (o) =>
      (o.order_number ? o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (o.customer_name ? o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (o.customer_phone ? o.customer_phone.includes(searchTerm) : false)
  );

  const newOrdersCount = orders.filter((o) => o.status === 'new' || o.status === 'payment_pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Orders Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept, confirm, track, and update delivery status of customer orders
          </p>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Orders</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
        </div>

        <div className="bg-white border border-amber-200 bg-amber-50/20 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase">New / Pending</span>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{newOrdersCount}</p>
        </div>

        <div className="bg-white border border-indigo-200 bg-indigo-50/20 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-700 uppercase">Confirmed / Processing</span>
          <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{confirmedCount}</p>
        </div>

        <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Delivered</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{deliveredCount}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID (ATB-...), Name, Phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">Showing {filtered.length} orders</span>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Delivery Address</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ord) => {
                  const isNew = ord.status === 'new' || ord.status === 'payment_pending';

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-black text-[#F5921F] whitespace-nowrap">
                        {ord.order_number}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-slate-900">{ord.customer_name}</p>
                        <a
                          href={`tel:${ord.customer_phone}`}
                          className="text-[11px] text-[#F5921F] hover:underline font-semibold block"
                        >
                          {ord.customer_phone}
                        </a>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {ord.shipping_address}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="uppercase text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {ord.payment_method}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                        {formatPrice(ord.total_amount)}
                      </td>

                      {/* Status Dropdown / Action */}
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          disabled={updatingId === ord.id}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-extrabold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none transition-all ${
                            ord.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : ord.status === 'shipped'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-orange-50 text-[#F5921F] border-orange-200 ring-1 ring-[#F5921F]/30'
                          }`}
                        >
                          <option value="new">Placed (New)</option>
                          <option value="confirmed">✓ Confirmed (Accept)</option>
                          <option value="shipped">🚚 Shipped (On Way)</option>
                          <option value="delivered">📦 Delivered</option>
                          <option value="cancelled">✕ Cancelled</option>
                        </select>
                      </td>

                      {/* Quick Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {isNew && (
                            <button
                              onClick={() => handleStatusChange(ord.id, 'confirmed')}
                              disabled={updatingId === ord.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm transition-all"
                              title="Accept Order"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Order Details
                </span>
                <h3 className="text-xl font-black text-[#F5921F]">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Current Order Status
                </span>
                <span className="text-xs font-black uppercase text-slate-900">
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'shipped')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px]"
                >
                  Ship
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px]"
                >
                  Deliver
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-extrabold text-slate-900">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone Number:</span>
                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${selectedOrder.customer_phone}`}
                    className="font-extrabold text-[#F5921F] hover:underline"
                  >
                    {selectedOrder.customer_phone}
                  </a>
                  <a
                    href={`https://wa.me/88${selectedOrder.customer_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Full Address:</span>
                <span className="font-bold text-slate-900 text-right max-w-xs">
                  {selectedOrder.shipping_address}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-black uppercase text-slate-900">
                  {selectedOrder.payment_method}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Delivery Charge:</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(selectedOrder.delivery_charge || 70)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="text-[#F5921F] text-base">
                  {formatPrice(selectedOrder.total_amount)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
