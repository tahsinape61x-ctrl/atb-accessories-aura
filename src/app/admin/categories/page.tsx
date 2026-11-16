'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Layers,
  Pencil,
  Upload,
  Link as LinkIcon,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FolderTree,
} from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category, Product } from '@/lib/supabase/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    const [cats, prods] = await Promise.all([
      dataService.getCategories(),
      dataService.getProducts(),
    ]);
    setCategories(cats);
    setProducts(prods);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-slug generator when typing name (if adding or user hasn't explicitly customized slug)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  // Image File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Image is too large! Maximum allowed file size is 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setStatusMessage({ type: 'success', text: 'Image uploaded successfully from your device!' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Switch to Edit Mode
  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImageUrl(cat.image_url || '');
    setStatusMessage(null);

    // Scroll form into view
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Cancel Edit Mode
  const cancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setImageUrl('');
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save Category (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a category name.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const categoryData: Partial<Category> = {
        name: name.trim(),
        slug: slug.trim() || `cat-${Date.now()}`,
        image_url:
          imageUrl ||
          'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
        display_order: editingCategory ? editingCategory.display_order : categories.length + 1,
      };

      if (editingCategory) {
        categoryData.id = editingCategory.id;
      }

      await dataService.saveCategory(categoryData);
      await loadData();

      const wasEditing = !!editingCategory;
      cancelEdit();
      setStatusMessage({
        type: 'success',
        text: wasEditing ? 'Category updated successfully!' : 'New category created successfully!',
      });
    } catch (err) {
      console.error('Error saving category:', err);
      setStatusMessage({ type: 'error', text: 'Failed to save category. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Delete Category
  const handleDelete = async (id: string, catName: string) => {
    const productCount = products.filter((p) => p.category_id === id || p.category?.slug === id).length;
    const confirmText = productCount > 0
      ? `Category "${catName}" has ${productCount} assigned products. Are you sure you want to delete it?`
      : `Delete category "${catName}"?`;

    if (confirm(confirmText)) {
      await dataService.deleteCategory(id);
      if (editingCategory?.id === id) {
        cancelEdit();
      }
      await loadData();
      setStatusMessage({ type: 'success', text: `Category "${catName}" deleted.` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Categories Management</span>
            <span className="text-xs bg-orange-100 text-[#F5921F] font-black px-2.5 py-0.5 rounded-full border border-orange-200">
              Live Catalog
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, organize and upload custom thumbnail images for your accessory categories
          </p>
        </div>

        <button
          onClick={cancelEdit}
          className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Add / Edit Form Card */}
        <div
          ref={formRef}
          className={`lg:col-span-5 bg-white border rounded-3xl p-5 sm:p-6 shadow-sm transition-all ${
            editingCategory ? 'border-[#F5921F] ring-2 ring-orange-200 shadow-md' : 'border-slate-200'
          }`}
        >
          {/* Form Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  editingCategory ? 'bg-orange-100 text-[#F5921F]' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {editingCategory ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-none">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                {editingCategory && (
                  <p className="text-[11px] text-[#F5921F] font-bold mt-1">
                    Editing: {editingCategory.name}
                  </p>
                )}
              </div>
            </div>

            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSaveCategory} className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smart Watch, AirPods, Chargers"
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] focus:ring-2 focus:ring-orange-100 transition-all"
                required
              />
            </div>

            {/* Category Slug */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                URL Slug <span className="text-slate-400 font-normal">(Auto-generated)</span>
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50 focus-within:border-[#F5921F] focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100">
                <span className="text-[11px] font-mono text-slate-400 pl-3 pr-1 select-none">/category/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="smart-watch"
                  className="w-full text-xs font-mono px-1 py-2.5 bg-transparent focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Category Image Upload / URL Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Category Thumbnail Image</label>
                <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      imageInputMode === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      imageInputMode === 'url' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {/* Upload Input Option */}
              {imageInputMode === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="category-image-file"
                  />
                  <label
                    htmlFor="category-image-file"
                    className="border-2 border-dashed border-slate-300 hover:border-[#F5921F] bg-slate-50/60 hover:bg-orange-50/30 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                      <Upload className="w-5 h-5 text-[#F5921F]" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Click to choose image from device
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      JPG, PNG, WEBP (Max 5MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                    />
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              )}

              {/* Live Preview Box */}
              {imageUrl && (
                <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Circle icon preview (exact match to homepage category style) */}
                    <div className="w-14 h-14 relative rounded-full overflow-hidden bg-white border-2 border-[#F5921F] shadow-sm shrink-0">
                      <img src={imageUrl} alt="Category preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Category Icon Preview</span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready to display on Homepage</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#F5921F] hover:bg-[#d97d13] text-white py-3 rounded-xl font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : editingCategory ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Existing Categories List Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center text-[#F5921F]">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-black text-slate-900">Current Categories</h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full">
              {categories.length} total
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const productCount = products.filter(
                (p) => p.category_id === cat.id || p.category?.slug === cat.slug
              ).length;
              const isCurrentlyEditing = editingCategory?.id === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`py-3.5 px-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                    isCurrentlyEditing
                      ? 'bg-orange-50/70 border border-[#F5921F]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Category Info & Image */}
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 border-2 border-slate-200 shadow-2xs">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-slate-400 text-sm">
                          {cat.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-black text-slate-900 truncate">{cat.name}</h3>
                        {isCurrentlyEditing && (
                          <span className="text-[9px] bg-[#F5921F] text-white px-1.5 py-0.5 rounded font-black uppercase">
                            Editing
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        /category/{cat.slug}
                      </p>
                      <span className="inline-block text-[10px] text-slate-500 font-bold mt-0.5">
                        {productCount} {productCount === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete Buttons */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(cat)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                        isCurrentlyEditing
                          ? 'bg-[#F5921F] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                      }`}
                      title="Edit Category & Image"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
