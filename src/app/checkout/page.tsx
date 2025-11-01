'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useCartStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { cart, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Shipping
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.email || !formData.firstName || !formData.address) {
      toast.error('Required Fields', 'Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'card') {
      try {
        setIsProcessing(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        const res = await fetch(`${backendUrl}/payments/stripe/create-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ amountInPaise: Math.round(cart.total * 100), currency: 'inr' }),
        });
        if (!res.ok) throw new Error('Failed to create payment');
        const data = await res.json();
        // For now, just confirm creation; full Stripe Elements integration can be added next
        toast.success('Payment Intent Created', 'Complete payment in the next step');
        // Simulate order placement after payment intent in test mode
        clearCart();
        router.push('/orders');
      } catch (e: any) {
        toast.error('Payment Error', e?.message || 'Could not start payment');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (formData.paymentMethod === 'cod') {
      try {
        setIsProcessing(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        const payload = {
          items: cart.items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.price,
            variantId: i.variantId,
          })),
          shippingAddress: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address1: formData.address,
            address2: formData.apartment,
            city: formData.city,
            state: formData.state,
            postalCode: formData.pincode,
            country: 'India',
          },
          totals: {
            subtotal: cart.subtotal,
            tax: cart.tax,
            shipping: cart.shipping,
            discount: cart.discount,
            total: cart.total,
          },
        };
        const res = await fetch(`${backendUrl}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to place order');
        toast.success('Order Placed!', 'Your COD order has been placed');
        clearCart();
        router.push('/orders');
      } catch (e: any) {
        toast.error('Order Error', e?.message || 'Could not place order');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      toast.success('Order Placed!', 'Your order has been placed successfully');
      router.push('/orders');
    }, 2000);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-orange-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-24 h-1 ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 max-w-md mx-auto">
            <span className="text-sm font-medium">Shipping</span>
            <span className="text-sm font-medium">Payment</span>
            <span className="text-sm font-medium">Review</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TruckIcon className="w-6 h-6 text-orange-600" />
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                    <input type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                  <input type="text" name="address" placeholder="Address *" value={formData.address} onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                  <input type="text" name="apartment" placeholder="Apartment, suite, etc." value={formData.apartment} onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                  <div className="grid md:grid-cols-3 gap-4">
                    <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                    <input type="text" name="state" placeholder="State *" value={formData.state} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                    <input type="text" name="pincode" placeholder="PIN Code *" value={formData.pincode} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <button onClick={() => setStep(2)} className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700">
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Payment Method */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCardIcon className="w-6 h-6 text-orange-600" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {['card', 'upi', 'cod'].map((method) => (
                      <label key={method} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                        formData.paymentMethod === method ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                      }`}>
                        <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method}
                          onChange={handleInputChange} className="w-4 h-4 text-orange-600" />
                        <span className="ml-3 font-medium">{method === 'card' ? 'Credit/Debit Card' : method === 'upi' ? 'UPI' : 'Cash on Delivery'}</span>
                      </label>
                    ))}
                  </div>
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 mt-4">
                      <input type="text" name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                      <input type="text" name="cardName" placeholder="Cardholder Name" value={formData.cardName} onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleInputChange}
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                        <input type="text" name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleInputChange}
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700">
                      Review Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Review Order */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                    <p className="text-gray-600">{formData.address}</p>
                    <p className="text-gray-600">{formData.city}, {formData.state} {formData.pincode}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">
                      Back
                    </button>
                    <button onClick={handlePlaceOrder} disabled={isProcessing}
                      className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2">
                      {isProcessing ? 'Processing...' : 'Place Order'}
                      <LockClosedIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.product.images[0]?.url} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{cart.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{cart.shipping === 0 ? 'Free' : `₹${cart.shipping}`}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>₹{cart.tax.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span><span className="text-orange-600">₹{cart.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
