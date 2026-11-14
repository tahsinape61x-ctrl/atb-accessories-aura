'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Trash2, Edit, Search, Check, X } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Product } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    const data = await dataService.getProducts({ includeInactive: true });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await dataService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Products Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage all products, stock, prices, and discounts</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">Total: {filtered.length} Products</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No products found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Regular Price</th>
                  <th className="py-3 px-4">Offer Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 bg-slate-100 rounded-lg shrink-0 overflow-hidden border border-slate-200">
                          {prod.images?.[0] && (
                            <Image src={prod.images[0]} alt="" fill className="object-cover" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900 line-clamp-1 max-w-xs">{prod.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{prod.sku}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{formatPrice(prod.price)}</td>
                    <td className="py-3 px-4 font-extrabold text-[#F5921F]">
                      {prod.discount_price ? formatPrice(prod.discount_price) : '—'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{prod.stock_quantity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          prod.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {prod.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(prod.id, prod.title)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
