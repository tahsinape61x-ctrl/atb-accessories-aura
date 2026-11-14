'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Layers } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category } from '@/lib/supabase/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    const data = await dataService.getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await dataService.saveCategory({
        name,
        slug: slug || `cat-${Date.now()}`,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
        display_order: categories.length + 1,
      });
      setName('');
      setSlug('');
      setImageUrl('');
      await loadCategories();
    } catch (err) {
      console.error('Error adding category:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`Delete category "${catName}"?`)) {
      await dataService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Categories Management</h1>
        <p className="text-xs text-slate-500 mt-1">Organize your accessories and product catalog navigation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Add Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-[#F5921F]" />
            <span>Add New Category</span>
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smart Watch"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="smart-watch"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#F5921F] hover:bg-[#d97d13] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              {saving ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Existing List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#F5921F]" />
              <span>Current Categories</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">{categories.length} total</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div key={cat.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    {cat.image_url ? (
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">/category/{cat.slug}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
