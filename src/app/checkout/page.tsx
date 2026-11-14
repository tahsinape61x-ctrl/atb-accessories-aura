'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, CreditCard, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { dataService } from '@/lib/services/dataService';
import { formatPrice } from '@/lib/utils';
import * as fpixel from '@/lib/fpixel';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, cartCount, clearCart } = useCart();

  const [shippingArea, setShippingArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket'>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryCharge = shippingArea === 'inside_dhaka' ? 70 : 130;
  const grandTotal = subtotal + deliveryCharge;

  // Track InitiateCheckout on page mount
  useEffect(() => {
    if (cart.length > 0) {
      fpixel.event('InitiateCheckout', {
        content_ids: cart.map((i) => i.product.id),
        num_items: cartCount,
        value: subtotal,
        currency: 'BDT',
      });
    }
  }, [cart, cartCount, subtotal]);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No items in your cart to checkout</h2>
        <p className="text-sm text-slate-500 mb-6">Please add some products to your cart first.</p>
        <Link
          href="/"
          className="inline-block bg-[#F5921F] text-white px-6 py-2.5 rounded-full font-bold text-sm"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 11) {
      setErrorMsg('Please enter a valid 11-digit phone number');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Please enter your full delivery address');
      return;
    }

    if (paymentMethod !== 'cod') {
      if (!senderNumber.trim() || senderNumber.trim().length < 11) {
        setErrorMsg(`Please enter the ${paymentMethod.toUpperCase()} sender phone number`);
        return;
      }
      if (!trxId.trim()) {
        setErrorMsg(`Please enter the ${paymentMethod.toUpperCase()} Transaction ID (TrxID)`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        shipping_address: formData.address,
        shipping_area: shippingArea,
        delivery_charge: deliveryCharge,
        subtotal: subtotal,
        total_amount: grandTotal,
        payment_method: paymentMethod,
        sender_number: senderNumber,
        trx_id: trxId,
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_title: item.product.title,
          price: item.product.discount_price || item.product.price,
          quantity: item.quantity,
          total: (item.product.discount_price || item.product.price) * item.quantity,
        })),
      };

      const createdOrder = await dataService.createOrder(orderPayload);

      // Save order items in session/localStorage so the thank you page can read and trigger Meta Pixel Purchase
      try {
        localStorage.setItem(`order_${createdOrder.order_number}`, JSON.stringify(createdOrder));
      } catch (err) {
        console.error('Storage error', err);
      }

      // Clear cart
      clearCart();

      // Redirect to Order Success Page
      router.push(`/order-success/${createdOrder.order_number}`);
    } catch (err: any) {
      console.error('Error placing order:', err);
      setErrorMsg('Failed to place order. Please try again or call our hotline: 01706-312594.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="mb-6 flex items-center space-x-2">
        <Link href="/cart" className="text-slate-500 hover:text-slate-900 flex items-center text-xs sm:text-sm font-semibold">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Complete your delivery & payment information</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Customer Information & Shipping */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact & Shipping Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#F5921F]" />
              <span>1. Delivery Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] focus:ring-1 focus:ring-[#F5921F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] focus:ring-1 focus:ring-[#F5921F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="yourname@gmail.com"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] focus:ring-1 focus:ring-[#F5921F]"
              />
            </div>

            {/* Delivery Area Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Delivery Area <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setShippingArea('inside_dhaka')}
                  className={`cursor-pointer border rounded-xl p-3.5 flex items-center justify-between transition-all ${
                    shippingArea === 'inside_dhaka'
                      ? 'border-[#F5921F] bg-orange-50/40 ring-1 ring-[#F5921F]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">Inside Dhaka</p>
                    <p className="text-[11px] text-slate-500">24-48 Hours Delivery</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#F5921F]">৳70</span>
                </div>

                <div
                  onClick={() => setShippingArea('outside_dhaka')}
                  className={`cursor-pointer border rounded-xl p-3.5 flex items-center justify-between transition-all ${
                    shippingArea === 'outside_dhaka'
                      ? 'border-[#F5921F] bg-orange-50/40 ring-1 ring-[#F5921F]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">Outside Dhaka</p>
                    <p className="text-[11px] text-slate-500">2-4 Days Delivery</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#F5921F]">৳130</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="House, Road, Area, Thana, District"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F] focus:ring-1 focus:ring-[#F5921F]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#F5921F]" />
              <span>2. Payment Method</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#F5921F] bg-orange-50/40 ring-1 ring-[#F5921F] font-bold text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Cash on Delivery</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pay upon arrival</div>
              </button>

              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-[#E2136E] bg-pink-50 ring-1 ring-[#E2136E] font-bold text-[#E2136E]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-[#E2136E]">bKash</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Send Money</div>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-[#F7941D] bg-orange-50 ring-1 ring-[#F7941D] font-bold text-[#F7941D]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-[#F7941D]">Nagad</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Send Money</div>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setPaymentMethod('rocket')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'rocket'
                    ? 'border-[#8C3494] bg-purple-50 ring-1 ring-[#8C3494] font-bold text-[#8C3494]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-[#8C3494]">Rocket</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Send Money</div>
              </button>
            </div>

            {/* Mobile Banking Instructions */}
            {paymentMethod !== 'cod' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 mt-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    How to pay via {paymentMethod.toUpperCase()} (Personal):
                  </span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside pl-1 leading-relaxed">
                  <li>Open your {paymentMethod.toUpperCase()} App or dial USSD code.</li>
                  <li>
                    Select <strong>Send Money</strong> to Personal Account:{' '}
                    <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                      01706-312594
                    </span>
                  </li>
                  <li>
                    Enter Amount: <strong>{formatPrice(grandTotal)}</strong>
                  </li>
                  <li>Complete transaction and enter the details below:</li>
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {paymentMethod.toUpperCase()} Sender Phone No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Transaction ID (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9J3K8L2M"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F5921F]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Review & Submit Column */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Review ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h2>

            {/* Items Summary */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const price = item.product.discount_price || item.product.price;
                return (
                  <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                    <div className="relative w-12 h-12 bg-slate-50 rounded-lg shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.product.title}</p>
                      <p className="text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Costs Calculation */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge ({shippingArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span className="font-semibold text-slate-900">{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-extrabold text-slate-900 text-base">
                <span>Total Payable</span>
                <span className="text-[#F5921F] text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Guarantee note */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official Warranty Stock & Safe Checkout Guaranteed</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#F5921F] hover:bg-[#d97d13] transform hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <span>Placing Your Order...</span>
              ) : (
                <span>Confirm Order — {formatPrice(grandTotal)}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
