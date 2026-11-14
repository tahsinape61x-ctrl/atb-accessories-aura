'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Trash2,
  AlertCircle,
  Check,
  ExternalLink,
} from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category, Brand, Product } from '@/lib/supabase/types';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    brand_id: '',
    price: '',
    discount_price: '',
    stock_quantity: '50',
    sku: '',
    model_no: '',
    description: '',
    is_featured: true,
    is_new_arrival: false,
    is_active: true,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadProductAndMeta() {
      if (!productId) return;
      setLoading(true);

      const [c, b, prod] = await Promise.all([
        dataService.getCategories(),
        dataService.getBrands(),
        dataService.getProductById(productId),
      ]);

      setCategories(c);
      setBrands(b);

      if (prod) {
        setFormData({
          title: prod.title || '',
          slug: prod.slug || '',
          category_id: prod.category_id || (c.length > 0 ? c[0].id : ''),
          brand_id: prod.brand_id || (b.length > 0 ? b[0].id : ''),
          price: prod.price ? prod.price.toString() : '',
          discount_price: prod.discount_price ? prod.discount_price.toString() : '',
          stock_quantity: prod.stock_quantity ? prod.stock_quantity.toString() : '50',
          sku: prod.sku || '',
          model_no: prod.model_no || '',
          description: prod.description || '',
          is_featured: prod.is_featured ?? true,
          is_new_arrival: prod.is_new_arrival ?? false,
          is_active: prod.is_active ?? true,
        });
        setUploadedImages(prod.images && prod.images.length > 0 ? prod.images : []);
      }

      setLoading(false);
    }

    loadProductAndMeta();
  }, [productId]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 900;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, WEBP)');
        continue;
      }
      try {
        const compressedBase64 = await compressImage(file);
        setUploadedImages((prev) => [...prev, compressedBase64]);
      } catch (err) {
        console.error('Compression error:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setUploadedImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Product title is required');
      return;
    }
    if (!formData.price) {
      setErrorMsg('Product price is required');
      return;
    }
    if (uploadedImages.length === 0) {
      setErrorMsg('Please upload at least 1 product image');
      return;
    }

    setSaving(true);
    try {
      await dataService.saveProduct({
        id: productId,
        title: formData.title,
        slug: formData.slug || `product-${Date.now()}`,
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        stock_quantity: parseInt(formData.stock_quantity) || 10,
        sku: formData.sku,
        model_no: formData.model_no,
        description: formData.description,
        images: uploadedImages,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
      });

      setSuccessMsg('Product updated successfully! Live changes saved.');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (err) {
      console.error('Failed to update product:', err);
      setErrorMsg('Error updating product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent mb-2"></div>
        <p className="text-xs text-slate-500">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/admin/products" className="hover:text-[#F5921F] flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Products</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900">Edit Product</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Edit Product</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify price, discount, gallery photos, and live availability
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/product/${formData.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#F5921F] bg-orange-50 border border-orange-200 hover:bg-orange-100 flex items-center space-x-1"
          >
            <span>View on Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 bg-[#F5921F] hover:bg-[#d97d13] text-white px-6 py-2 rounded-xl font-extrabold text-xs shadow-md transition-all transform hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              General Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">SKU (Code)</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description & Specs</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] leading-relaxed"
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Regular Price (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Offer / Discount Price (৳)
                </label>
                <input
                  type="number"
                  value={formData.discount_price}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                  placeholder="Optional"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Stock Units</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                />
              </div>
            </div>
          </div>

          {/* Gallery & Photo Upload */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Product Images (Gallery)</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Add more pictures or click the red trash icon to delete
                </p>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Upload from PC/Phone
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageTab === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Image Link (URL)
                </button>
              </div>
            </div>

            {imageTab === 'upload' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#F5921F] bg-[#F7F8FA] hover:bg-orange-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 text-[#F5921F] border border-slate-200">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select more photos from device
                </p>
              </div>
            )}

            {imageTab === 'url' && (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-grow text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="bg-[#F5921F] text-white px-4 py-2.5 rounded-xl text-xs font-bold shrink-0"
                >
                  Add Image
                </button>
              </div>
            )}

            {/* Existing Images Thumbnails */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                {uploadedImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-xs"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-[#F5921F] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                        Main Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-lg transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Category, Brand & Status */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Category & Brand
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] bg-white font-bold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] bg-white font-bold"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Model Number</label>
              <input
                type="text"
                value={formData.model_no}
                onChange={(e) => setFormData({ ...formData, model_no: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
          </div>

          {/* Visibility Badges */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Badges & Status
            </h2>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-[#F5921F] focus:ring-[#F5921F] w-4 h-4"
                />
                <span>Active & Published on Website</span>
              </label>

              <label className="flex items-center space-x-3 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-[#F5921F] focus:ring-[#F5921F] w-4 h-4"
                />
                <span>Show in Trending / Featured</span>
              </label>

              <label className="flex items-center space-x-3 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new_arrival}
                  onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                  className="rounded text-[#F5921F] focus:ring-[#F5921F] w-4 h-4"
                />
                <span>Show &quot;NEW&quot; Arrival Badge</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#F5921F] hover:bg-[#d97d13] text-white py-3.5 rounded-2xl font-black text-sm shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save & Update Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
