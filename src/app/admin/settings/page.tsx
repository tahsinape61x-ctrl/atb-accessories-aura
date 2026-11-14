'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { StoreSettings } from '@/lib/supabase/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await dataService.getStoreSettings();
      setSettings(data);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      await dataService.updateStoreSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Store Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure contact numbers, delivery charges, and banking accounts</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Store Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hotline / WhatsApp</label>
              <input
                type="text"
                value={settings.hotline_phone}
                onChange={(e) => setSettings({ ...settings, hotline_phone: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.support_email}
              onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Delivery Charges (BDT)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Inside Dhaka (৳)</label>
              <input
                type="number"
                value={settings.delivery_charge_inside_dhaka}
                onChange={(e) =>
                  setSettings({ ...settings, delivery_charge_inside_dhaka: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Outside Dhaka (৳)</label>
              <input
                type="number"
                value={settings.delivery_charge_outside_dhaka}
                onChange={(e) =>
                  setSettings({ ...settings, delivery_charge_outside_dhaka: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Mobile Banking Account Numbers (Send Money)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">bKash (Personal)</label>
              <input
                type="text"
                value={settings.bkash_number}
                onChange={(e) => setSettings({ ...settings, bkash_number: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nagad (Personal)</label>
              <input
                type="text"
                value={settings.nagad_number}
                onChange={(e) => setSettings({ ...settings, nagad_number: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rocket (Personal)</label>
              <input
                type="text"
                value={settings.rocket_number}
                onChange={(e) => setSettings({ ...settings, rocket_number: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white px-8 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
