'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category, Brand } from '@/lib/supabase/types';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    brand_id: '',
    price: '',
    discount_price: '',
    stock_quantity: '50',
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    model_no: '',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      const [c, b] = await Promise.all([dataService.getCategories(), dataService.getBrands()]);
      setCategories(c);
      setBrands(b);
      if (c.length > 0) {
        setFormData((prev) => ({ ...prev, category_id: c[0].id }));
      }
      if (b.length > 0) {
        setFormData((prev) => ({ ...prev, brand_id: b[0].id }));
      }
    }
    loadMeta();
  }, []);

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, title: val, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please enter product title and price');
      return;
    }

    setSaving(true);
    try {
      await dataService.saveProduct({
        title: formData.title,
        slug: formData.slug || `prod-${Date.now()}`,
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        stock_quantity: parseInt(formData.stock_quantity) || 10,
        sku: formData.sku,
        model_no: formData.model_no,
        description: formData.description,
        images: [formData.image_url],
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
      });

      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      alert('Error creating product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/products" className="text-slate-500 hover:text-slate-900 flex items-center text-xs font-bold">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">Add New Product</h1>
        <p className="text-xs text-slate-500 mt-1">Publish a new gadget or accessory into your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Anker 737 Power Bank (PowerCore 24K)"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
            <select
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] bg-white"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Regular Price (৳) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 1500"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Offer / Discount Price (৳)</label>
            <input
              type="number"
              value={formData.discount_price}
              onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
              placeholder="Optional, e.g. 1250"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Model Number</label>
            <input
              type="text"
              value={formData.model_no}
              onChange={(e) => setFormData({ ...formData, model_no: e.target.value })}
              placeholder="e.g. A1289"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Main Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product features, specifications, and warranty details..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
            />
          </div>
        </div>

        {/* Badges / Checkboxes */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-[#F5921F] focus:ring-[#F5921F]"
            />
            <span>Featured Product</span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_new_arrival}
              onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
              className="rounded text-[#F5921F] focus:ring-[#F5921F]"
            />
            <span>New Arrival Badge</span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-[#F5921F] focus:ring-[#F5921F]"
            />
            <span>Active & Published</span>
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white px-8 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Product...' : 'Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
