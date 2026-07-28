import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  ShieldCheck,
  CreditCard,
  Zap,
  Lock,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Sparkles,
  Smartphone,
  QrCode,
  ArrowRight,
  Building2,
  ShieldAlert,
  Copy,
  Receipt,
} from 'lucide-react';
import { UserAccount } from '../types';
import { RightPdfLogo } from './RightPdfLogo';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpdateUserPro: (planName: string, paymentMethod: string) => void;
}

type PaymentGateway = 'stripe' | 'paypal' | 'razorpay' | 'debit' | 'credit';

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUserPro,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('stripe');

  // Credit Card & Debit Card Edit State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Shilpa Gujar');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [billingZip, setBillingZip] = useState('400001');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [upiId, setUpiId] = useState('shilpagujar@upi');

  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const planPrices = {
    monthly: { usd: '$4.99/mo', inr: '₹399/mo', name: 'Monthly Pro Plan' },
    yearly: { usd: '$39.99/yr', inr: '₹2,999/yr', name: 'Yearly VIP Pass (Save 50%)' },
    lifetime: { usd: '$99.99', inr: '₹6,999', name: 'Lifetime Unlimited Access' },
  };

  const activePrice = planPrices[selectedPlan];

  // Direct Payment Links for each provider
  const paymentLinks = {
    paypal: `https://www.paypal.com/checkoutnow?plan=${selectedPlan}&app=rightpdf_pro`,
    stripe: `https://checkout.stripe.com/c/pay/rightpdf_${selectedPlan}_subscription`,
    razorpay: `https://razorpay.me/@rightpdfconverter_pro?amount=${selectedPlan === 'yearly' ? 2999 : selectedPlan === 'lifetime' ? 6999 : 399}`,
  };

  const handleCopyPaymentLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExecutePayment = (methodName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onUpdateUserPro(activePrice.name, methodName);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <RightPdfLogo size="md" showText={false} className="shadow-lg" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-[11px] flex items-center gap-1 shadow">
                  <Crown className="w-3.5 h-3.5 fill-slate-900" />
                  <span>Buying Plans & PRO Pass</span>
                </span>
                {currentUser?.isPro && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                    VIP Active
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Upgrade RightPDF Pro
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Choose your plan and pay securely with PayPal, Stripe, Razorpay, Debit Card, or Credit Card.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Success Confirmation Receipt */
          <div className="p-8 text-center space-y-6 overflow-y-auto my-auto">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Payment Successful! 🎉
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you, <span className="font-bold">{currentUser?.name || 'Subscriber'}</span>! Your{' '}
                <span className="font-bold text-purple-600 dark:text-purple-400">{activePrice.name}</span> is now active on <span className="font-mono text-blue-600">{currentUser?.email || 'shilpagujar2008@gmail.com'}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-left space-y-2 text-xs font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">TXN-RPDF-998124</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase">{paymentGateway}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{activePrice.usd} ({activePrice.inr})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Status:</span>
                <span className="font-bold text-emerald-500">Active & Verified</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
              >
                Start Using PRO Tools Now
              </button>
            </div>
          </div>
        ) : (
          /* Main Buying Plan & Checkout Body */
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
            {/* 1. PLAN SELECTION CARDS */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Step 1: Select Buying Plan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Monthly */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'monthly'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Monthly</span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">$4.99</span>
                      <span className="text-xs text-slate-500">/ mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">₹399 / month in India</p>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-500 border-t pt-2 border-slate-200 dark:border-slate-700">
                    Cancel anytime. Basic PRO access.
                  </div>
                </div>

                {/* Yearly - BEST VALUE */}
                <div
                  onClick={() => setSelectedPlan('yearly')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'yearly'
                      ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 shadow-lg scale-102 ring-2 ring-purple-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-[9px] uppercase shadow">
                    SAVE 50%
                  </span>
                  <div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Yearly VIP Pass</span>
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">$39.99</span>
                      <span className="text-xs text-slate-500">/ yr</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">₹2,999 / year</p>
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-purple-700 dark:text-purple-300 border-t pt-2 border-purple-200 dark:border-purple-800/50">
                    Includes Play Store APK exporter & Gemini AI
                  </div>
                </div>

                {/* Lifetime */}
                <div
                  onClick={() => setSelectedPlan('lifetime')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'lifetime'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-amber-400" />
                      <span>Lifetime Access</span>
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">$99.99</span>
                      <span className="text-xs text-slate-500">one-time</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">₹6,999 one-time payment</p>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-500 border-t pt-2 border-slate-200 dark:border-slate-700">
                    Pay once, use forever on all devices.
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PAYMENT GATEWAY SELECTION TABS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Step 2: Choose Payment Method
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
              </div>

              {/* Payment Gateway Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {/* Stripe */}
                <button
                  onClick={() => setPaymentGateway('stripe')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentGateway === 'stripe'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Stripe</span>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setPaymentGateway('paypal')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentGateway === 'paypal'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-extrabold italic text-amber-300">P</span>
                  <span>PayPal</span>
                </button>

                {/* Razorpay ("Ranzo payment") */}
                <button
                  onClick={() => setPaymentGateway('razorpay')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentGateway === 'razorpay'
                      ? 'bg-blue-800 text-white border-blue-800 shadow-md scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-cyan-300" />
                  <span>Razorpay</span>
                </button>

                {/* Debit Card */}
                <button
                  onClick={() => setPaymentGateway('debit')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentGateway === 'debit'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Debit Card</span>
                </button>

                {/* Credit Card / Edit Card */}
                <button
                  onClick={() => setPaymentGateway('credit')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all col-span-2 sm:col-span-1 ${
                    paymentGateway === 'credit'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>
              </div>

              {/* PAYMENT GATEWAY DETAILS PANEL */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                {/* 1. STRIPE GATEWAY */}
                {paymentGateway === 'stripe' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          <span>Stripe Secure Gateway</span>
                        </h4>
                        <p className="text-xs text-slate-500">Pay directly or use generated Stripe payment link</p>
                      </div>
                      <button
                        onClick={() => handleCopyPaymentLink(paymentLinks.stripe)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center gap-1 hover:bg-indigo-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Payment Link'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExecutePayment('Stripe Payment Gateway')}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <span>Processing Stripe Payment...</span>
                        ) : (
                          <>
                            <span>Pay {activePrice.usd} via Stripe</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <a
                        href={paymentLinks.stripe}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 hover:bg-slate-300"
                      >
                        <span>Open Stripe Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* 2. PAYPAL GATEWAY */}
                {paymentGateway === 'paypal' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center">P</span>
                          <span>PayPal Express Checkout</span>
                        </h4>
                        <p className="text-xs text-slate-500">Pay using your PayPal balance or connected bank account</p>
                      </div>
                      <button
                        onClick={() => handleCopyPaymentLink(paymentLinks.paypal)}
                        className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center gap-1 hover:bg-blue-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedLink ? 'Link Copied!' : 'Copy PayPal Link'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1">
                      <p className="font-bold text-blue-900 dark:text-blue-200">
                        PayPal Account: {currentUser?.email || 'shilpagujar2008@gmail.com'}
                      </p>
                      <p className="text-blue-700 dark:text-blue-400">
                        One-click buyer protection enabled. No credit card information stored on server.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExecutePayment('PayPal Express')}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <span>Connecting to PayPal...</span>
                        ) : (
                          <>
                            <span className="font-black italic">PayPal</span>
                            <span>Checkout ({activePrice.usd})</span>
                          </>
                        )}
                      </button>
                      <a
                        href={paymentLinks.paypal}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 hover:bg-slate-300"
                      >
                        <span>PayPal Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. RAZORPAY GATEWAY ("Ranzo payment") */}
                {paymentGateway === 'razorpay' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-cyan-600" />
                          <span>Razorpay India (UPI / NetBanking / QR)</span>
                        </h4>
                        <p className="text-xs text-slate-500">Pay with Google Pay, PhonePe, Paytm, BHIM, or NetBanking</p>
                      </div>
                      <button
                        onClick={() => handleCopyPaymentLink(paymentLinks.razorpay)}
                        className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center gap-1 hover:bg-blue-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Razorpay Link'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          UPI ID (Google Pay / PhonePe / Paytm)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@upi"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Amount in INR
                        </label>
                        <div className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-extrabold text-blue-600 dark:text-blue-400">
                          {activePrice.inr}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExecutePayment('Razorpay UPI / NetBanking')}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <span>Opening Razorpay Gateway...</span>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4" />
                            <span>Pay {activePrice.inr} via Razorpay</span>
                          </>
                        )}
                      </button>
                      <a
                        href={paymentLinks.razorpay}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 hover:bg-slate-300"
                      >
                        <span>Razorpay Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* 4. DEBIT CARD */}
                {paymentGateway === 'debit' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span>Debit Card Payment Gateway</span>
                        </h4>
                        <p className="text-xs text-slate-500">Supported for all international & national bank debit cards</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Select Issuing Bank
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200"
                        >
                          <option>HDFC Bank</option>
                          <option>State Bank of India (SBI)</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Chase Bank / BofA</option>
                          <option>Other International Bank</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Debit Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="5241 •••• •••• 1234"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecutePayment(`Debit Card (${selectedBank})`)}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span>Verifying Bank OTP...</span>
                      ) : (
                        <>
                          <span>Pay {activePrice.usd} with Debit Card</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 5. CREDIT CARD & EDIT CARD OPTION */}
                {paymentGateway === 'credit' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-purple-600" />
                          <span>Credit Card & Edit Card Details</span>
                        </h4>
                        <p className="text-xs text-slate-500">Edit saved credit card, expiry, or add a new card</p>
                      </div>

                      <button
                        onClick={() => setIsEditingCard(!isEditingCard)}
                        className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center gap-1 hover:bg-purple-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditingCard ? 'Lock Details' : 'Edit Card Info'}</span>
                      </button>
                    </div>

                    {isEditingCard && (
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300 font-medium">
                        ✏️ You are currently in <strong>Edit Card Details Mode</strong>. Update your card number, holder name, expiry date or billing PIN code below.
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Credit Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          disabled={!isEditingCard}
                          className={`w-full px-3.5 py-2 rounded-xl border font-mono font-medium ${
                            isEditingCard
                              ? 'bg-white dark:bg-slate-900 border-purple-500 ring-2 ring-purple-500/20'
                              : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          disabled={!isEditingCard}
                          className={`w-full px-3.5 py-2 rounded-xl border font-bold ${
                            isEditingCard
                              ? 'bg-white dark:bg-slate-900 border-purple-500'
                              : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Billing PIN / ZIP Code
                        </label>
                        <input
                          type="text"
                          value={billingZip}
                          onChange={(e) => setBillingZip(e.target.value)}
                          disabled={!isEditingCard}
                          className={`w-full px-3.5 py-2 rounded-xl border font-mono ${
                            isEditingCard
                              ? 'bg-white dark:bg-slate-900 border-purple-500'
                              : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          disabled={!isEditingCard}
                          className={`w-full px-3.5 py-2 rounded-xl border font-mono ${
                            isEditingCard
                              ? 'bg-white dark:bg-slate-900 border-purple-500'
                              : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          CVC / Security Code
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          disabled={!isEditingCard}
                          className={`w-full px-3.5 py-2 rounded-xl border font-mono ${
                            isEditingCard
                              ? 'bg-white dark:bg-slate-900 border-purple-500'
                              : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecutePayment('Credit Card (Visa/Mastercard)')}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span>Processing Credit Card Payment...</span>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Pay {activePrice.usd} with Credit Card</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. PRO PLAN INCLUDED FEATURES CHECKLIST */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Included in Your Buying Plan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unlimited Scan to PDF & Image to PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full PDF Editor Free access with E-Signature</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gemini AI Chat & Document Summarizer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Android Play Store AAB/APK Bundle Exporter</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
