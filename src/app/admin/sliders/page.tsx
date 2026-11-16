'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Slider } from '@/lib/supabase/types';

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBadge, setFormBadge] = useState('Official Stock 2026');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLink, setFormLink] = useState('/category/airpods-bluetooth');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSliders();
  }, []);

  async function loadSliders() {
    setLoading(true);
    const data = await dataService.getSliders();
    // Sort by display order
    data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    setSliders(data);
    setLoading(false);
  }

  const handleOpenAdd = () => {
    setEditingSlider(null);
    setFormTitle('Original Apple AirPods & Accessories');
    setFormSubtitle('100% authentic Apple 20W chargers, AirPods Pro 2 & MagSafe gear at best prices.');
    setFormBadge('Official Stock 2026');
    setFormImageUrl('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600&auto=format&fit=crop&q=80');
    setFormLink('/category/airpods-bluetooth');
    setFormOrder(sliders.length + 1);
    setFormIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (slide: Slider) => {
    setEditingSlider(slide);
    setFormTitle(slide.title || '');
    setFormSubtitle(slide.subtitle || '');
    setFormBadge((slide as any).badge_text || 'Official Stock 2026');
    setFormImageUrl(slide.image_url || '');
    setFormLink(slide.link || '/category/charger');
    setFormOrder(slide.display_order || 1);
    setFormIsActive(slide.is_active ?? true);
    setModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl.trim()) {
      alert('Please provide or upload a banner image.');
      return;
    }

    setSaving(true);
    try {
      await dataService.saveSlider({
        id: editingSlider ? editingSlider.id : undefined,
        title: formTitle,
        subtitle: formSubtitle,
        badge_text: formBadge,
        image_url: formImageUrl,
        link: formLink,
        display_order: Number(formOrder) || 1,
        is_active: formIsActive,
      } as any);

      setSuccessMsg(
        editingSlider
          ? 'Hero Banner slide updated successfully! Live homepage is now synchronized.'
          : 'New Hero Banner slide created and published live!'
      );
      setTimeout(() => setSuccessMsg(''), 4000);
      setModalOpen(false);
      await loadSliders();
    } catch (err) {
      console.error('Error saving slider:', err);
      alert('Failed to save slider. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner slide?')) return;
    await dataService.deleteSlider(id);
    setSuccessMsg('Banner slide deleted successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
    await loadSliders();
  };

  const handleToggleActive = async (slide: Slider) => {
    await dataService.saveSlider({
      ...slide,
      is_active: !slide.is_active,
    });
    await loadSliders();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900">Sliders / Banners</h1>
            <span className="bg-orange-100 text-[#F5921F] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Live Home Editor
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit homepage hero banners, promotional posters, titles, links, and background photos instantly.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Homepage</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 bg-[#F5921F] hover:bg-[#d97d13] text-white px-4 py-2 rounded-xl font-extrabold text-xs shadow-sm transition-all transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-2xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sliders Grid & Cards */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-16 text-center bg-white border border-slate-200 rounded-3xl">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent"></div>
            <p className="text-xs text-slate-500 mt-2 font-bold">Loading banner slides...</p>
          </div>
        ) : sliders.length === 0 ? (
          <div className="p-16 text-center bg-white border border-slate-200 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F5921F] flex items-center justify-center mx-auto">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No Hero Banners Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first homepage slider banner to showcase featured products, discounts, and accessories.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-1.5 bg-[#F5921F] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Banner</span>
            </button>
          </div>
        ) : (
          sliders.map((slide, idx) => (
            <div
              key={slide.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-orange-200 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Preview Thumbnail */}
              <div className="relative w-full lg:w-80 h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0 shadow-inner group">
                <img
                  src={slide.image_url}
                  alt={slide.title || 'Slide'}
                  className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] font-extrabold bg-[#F5921F] text-slate-950 px-2 py-0.5 rounded-full w-max shadow-xs">
                    {(slide as any).badge_text || 'Official Stock 2026'}
                  </span>
                  <p className="text-xs font-black truncate mt-1 text-white">{slide.title}</p>
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                    Slide #{slide.display_order || idx + 1}
                  </span>
                </div>
              </div>

              {/* Slide Details */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                    {slide.title}
                  </h3>
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                      slide.is_active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {slide.is_active ? 'Active & Live' : 'Hidden'}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {slide.subtitle || 'No subtitle specified'}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-slate-700">Link:</span>
                    <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">
                      {slide.link || '/category/charger'}
                    </code>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-slate-700">Display Order:</span>
                    <span className="font-bold text-[#F5921F]">{slide.display_order}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col lg:flex-row items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  onClick={() => handleOpenEdit(slide)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-[#F5921F] hover:bg-[#d97d13] text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Slide</span>
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {editingSlider ? 'Edit Homepage Hero Banner' : 'Create New Hero Banner Slide'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changes update the live homepage banner slider immediately.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Slide Title */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  Banner Headline / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Original Apple AirPods & Accessories"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F5921F] focus:ring-1 focus:ring-[#F5921F]"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  Banner Subtitle / Description
                </label>
                <textarea
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  rows={2}
                  placeholder="e.g. 100% authentic Apple 20W chargers, AirPods Pro 2 & MagSafe gear at best prices."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F5921F] focus:ring-1 focus:ring-[#F5921F]"
                />
              </div>

              {/* Badge & Target Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Top Highlight Badge
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Official Stock 2026"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F5921F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Button Target Link
                  </label>
                  <input
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="/category/airpods-bluetooth"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F5921F]"
                  />
                </div>
              </div>

              {/* Banner Image Upload & URL */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800">
                  Banner Image <span className="text-rose-500">*</span>
                </label>

                {/* Upload Button */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-orange-50 hover:bg-orange-100 text-[#F5921F] border border-orange-200 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-400 font-bold hidden sm:inline">or paste direct image URL</span>
                </div>

                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or data:image/..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F5921F]"
                  required
                />

                {/* Live Preview of the Image */}
                {formImageUrl && (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 mt-2 shadow-inner">
                    <img
                      src={formImageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent flex flex-col justify-center px-6 text-white">
                      <span className="text-[10px] font-black uppercase bg-[#F5921F] text-slate-950 px-2.5 py-0.5 rounded-full w-max">
                        {formBadge || 'Preview Badge'}
                      </span>
                      <h4 className="text-base font-black text-white mt-1 drop-shadow">
                        {formTitle || 'Sample Headline'}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-sm line-clamp-1 drop-shadow">
                        {formSubtitle || 'Sample subtitle description'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order & Active Status */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F5921F]"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="sliderActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#F5921F] focus:ring-[#F5921F] border-slate-300"
                  />
                  <label htmlFor="sliderActive" className="text-xs font-extrabold text-slate-800 cursor-pointer">
                    Publish on Homepage (Active)
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
