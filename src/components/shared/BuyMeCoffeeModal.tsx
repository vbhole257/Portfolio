'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSound } from '@/components/providers/SoundProvider';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import Lenis from '@studio-freight/lenis';
import { FiX, FiCoffee, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiHeart } from 'react-icons/fi';
import { MIN_AMOUNT_INR, MAX_AMOUNT_INR } from '@/lib/razorpay';
import type { RazorpayOptions, RazorpaySuccessResponse, RazorpayErrorResponse } from '@/types/razorpay';

interface BuyMeCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentState =
  | 'idle'
  | 'loading'
  | 'checkout_opened'
  | 'verifying'
  | 'cancelled'
  | 'failed'
  | 'verification_failed'
  | 'success';

const PRESET_AMOUNTS = [
  { amount: 50, label: '1 Coffee ☕' },
  { amount: 100, label: '2 Coffees ☕☕' },
  { amount: 200, label: 'Super Coffee 🚀' },
  { amount: 500, label: 'Mega Fuel ⚡' },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BuyMeCoffeeModal({ isOpen, onClose }: BuyMeCoffeeModalProps) {
  const { playClickSound, playHoverSound, playSuccessSound } = useSound();
  const lenisRef = useLenis() as React.RefObject<Lenis | null> | null;
  const lenis = lenisRef?.current;

  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [supporterMessage, setSupporterMessage] = useState<string>('');

  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [completedPaymentId, setCompletedPaymentId] = useState<string>('');
  const activeOrderIdRef = useRef<string>('');

  // Lock smooth scroll and body overflow when modal is open
  useEffect(() => {
    if (!lenis) return;
    if (isOpen) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis.start();
      document.body.style.overflow = '';
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    };
  }, [isOpen, lenis]);

  const handleModalClose = useCallback(() => {
    playClickSound();
    onClose();
    // Delay resetting state slightly so closing animation remains clean
    setTimeout(() => {
      setPaymentState('idle');
      setErrorMessage('');
    }, 300);
  }, [playClickSound, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && paymentState !== 'loading' && paymentState !== 'verifying') {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, paymentState, handleModalClose]);

  if (!isOpen) return null;

  const getEffectiveAmount = (): number => {
    if (isCustom) {
      const parsed = parseInt(customAmountInput, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return selectedAmount;
  };

  const handlePresetSelect = (amount: number) => {
    playClickSound();
    setIsCustom(false);
    setSelectedAmount(amount);
    setErrorMessage('');
  };

  const handleCustomSelect = () => {
    playClickSound();
    setIsCustom(true);
    setErrorMessage('');
  };

  const handleInitiatePayment = async () => {
    playClickSound();
    const amount = getEffectiveAmount();

    if (amount < MIN_AMOUNT_INR || amount > MAX_AMOUNT_INR) {
      setErrorMessage(`Please enter an amount between ₹${MIN_AMOUNT_INR} and ₹${MAX_AMOUNT_INR.toLocaleString('en-IN')}.`);
      return;
    }

    setErrorMessage('');
    setPaymentState('loading');

    // 1. Ensure Razorpay Checkout script is loaded
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded || !window.Razorpay) {
      setPaymentState('failed');
      setErrorMessage('Could not load Razorpay payment gateway SDK. Please check your internet connection.');
      return;
    }

    // 2. Create order on server
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          name: supporterName,
          message: supporterMessage,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        setPaymentState('failed');
        setErrorMessage(orderData.error || 'Failed to create payment order. Please try again.');
        return;
      }

      const { orderId, keyId } = orderData;
      activeOrderIdRef.current = orderId;

      // 3. Open Razorpay Checkout options
      const options: RazorpayOptions = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: 'INR',
        name: 'Vaibhav Bhole',
        description: `Support Coffee - ₹${amount}`,
        order_id: orderId,
        prefill: {
          name: supporterName || undefined,
        },
        notes: {
          supporter_name: supporterName || 'Anonymous',
          message: supporterMessage || 'Bought a coffee ☕',
        },
        theme: {
          color: '#C45D3E', // Portfolio accent color
          backdrop_color: 'rgba(15, 14, 12, 0.85)',
        },
        modal: {
          ondismiss: () => {
            setPaymentState('cancelled');
          },
          escape: true,
          backdropclose: false,
        },
        handler: async (response: RazorpaySuccessResponse) => {
          // Verify returned order matches current active order session
          if (response.razorpay_order_id !== activeOrderIdRef.current) {
            setPaymentState('verification_failed');
            setErrorMessage('Order mismatch detected between local checkout session and Razorpay response.');
            return;
          }

          setPaymentState('verifying');

          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                expected_order_id: activeOrderIdRef.current,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setCompletedPaymentId(response.razorpay_payment_id);
              setPaymentState('success');
              playSuccessSound();
            } else {
              setPaymentState('verification_failed');
              setErrorMessage(
                verifyData.error || 'Payment signature verification failed. Please contact me if money was debited.'
              );
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setPaymentState('verification_failed');
            setErrorMessage('Network error while verifying payment. Please check your bank statement.');
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', (failResponse: RazorpayErrorResponse) => {
        console.error('Payment failed event:', failResponse);
        setPaymentState('failed');
        setErrorMessage(
          failResponse.description || 'Payment was declined or failed. You can try a different UPI app or card.'
        );
      });

      setPaymentState('checkout_opened');
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Order creation exception:', err);
      setPaymentState('failed');
      setErrorMessage(err?.message || 'Something went wrong while connecting to the payment server.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={handleModalClose} />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg max-h-[90dvh] bg-cream dark:bg-ink border border-charcoal/20 dark:border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto overscroll-contain touch-pan-y text-charcoal dark:text-cream z-10"
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <FiCoffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-sm sm:text-base font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>Buy Me a Coffee</span>
                <span className="text-accent">☕</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-soft font-mono">
                Direct & secure support via Razorpay
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            onMouseEnter={playHoverSound}
            disabled={paymentState === 'loading' || paymentState === 'verifying'}
            className="p-2 rounded-full hover:bg-charcoal/10 dark:hover:bg-white/10 transition-colors text-charcoal dark:text-cream disabled:opacity-40"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Body based on State */}
        {paymentState === 'success' ? (
          /* SUCCESS STATE */
          <div className="py-8 px-2 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-bounce">
              <FiCheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-black text-accent uppercase tracking-tight">
                ☕✨ Thanks for the test coffee!
              </h3>
              <p className="font-sans text-xs sm:text-sm text-charcoal/80 dark:text-cream/80 max-w-sm mx-auto leading-relaxed">
                Your test payment went through successfully! Live bank settlements are being finalized and real payments will be active soon.
              </p>
            </div>

            {completedPaymentId && (
              <div className="inline-block px-3 py-1.5 rounded-lg bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 font-mono text-[11px] text-gray-soft">
                Payment Ref: <span className="text-accent font-semibold">{completedPaymentId}</span>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleModalClose}
                onMouseEnter={playHoverSound}
                className="px-6 py-2.5 rounded-xl bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM & INTERACTIVE STATES */
          <div className="mt-5 space-y-5">
            {/* Status Feedback Banner if Cancelled / Failed / Verification Failed */}
            {paymentState === 'cancelled' && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-amber-600 dark:text-amber-400 text-xs font-mono">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>Payment checkout was cancelled. You can change the amount or try again anytime.</span>
              </div>
            )}

            {(paymentState === 'failed' || paymentState === 'verification_failed') && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-500 text-xs font-mono">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {paymentState === 'verification_failed' ? 'Verification Alert: ' : 'Payment Failed: '}
                  </span>
                  <span>{errorMessage || 'Payment could not be completed.'}</span>
                </div>
              </div>
            )}

            {/* Test Mode Notification Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                <span>🧪 Notice: Payment Gateway in Test Mode</span>
              </div>
              <p className="text-gray-soft text-[11px] leading-relaxed">
                Thank you so much for wanting to support! Razorpay is currently in <strong className="text-cream">Sandbox/Test Mode</strong> while bank settlements are being finalized. Real money will not be deducted. We will update to live payments soon!
              </p>
              <div className="pt-0.5 text-[10px] text-amber-400">
                <span>💡 You can test simulation via UPI: </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-cream font-bold select-all underline">success@razorpay</span>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-gray-soft mb-2.5">
                Choose Coffee Size
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_AMOUNTS.map((preset) => {
                  const isSelected = !isCustom && selectedAmount === preset.amount;
                  return (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => handlePresetSelect(preset.amount)}
                      onMouseEnter={playHoverSound}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-accent bg-accent/15 text-accent shadow-md shadow-accent/10 scale-[1.02]'
                          : 'border-charcoal/10 dark:border-white/10 bg-charcoal/5 dark:bg-white/5 hover:border-accent/40'
                      }`}
                    >
                      <span className="font-mono text-xs text-gray-soft">{preset.label}</span>
                      <span className="font-mono text-lg font-black mt-1">₹{preset.amount}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Button */}
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleCustomSelect}
                  onMouseEnter={playHoverSound}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isCustom
                      ? 'border-accent bg-accent/15 text-accent shadow-md shadow-accent/10'
                      : 'border-charcoal/10 dark:border-white/10 bg-charcoal/5 dark:bg-white/5 hover:border-accent/40'
                  }`}
                >
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                    Custom Amount
                  </span>
                  <span className="font-mono text-xs text-gray-soft">
                    ₹{MIN_AMOUNT_INR} – ₹{MAX_AMOUNT_INR.toLocaleString('en-IN')}
                  </span>
                </button>
              </div>

              {/* Custom Amount Input */}
              {isCustom && (
                <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-charcoal/5 dark:bg-surface-mid border border-accent/40">
                  <span className="font-mono text-base font-bold text-accent px-2">₹</span>
                  <input
                    type="number"
                    min={MIN_AMOUNT_INR}
                    max={MAX_AMOUNT_INR}
                    step={1}
                    value={customAmountInput}
                    onChange={(e) => {
                      setCustomAmountInput(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder={`Enter amount (e.g. 250)`}
                    className="w-full bg-transparent font-mono text-sm sm:text-base outline-none text-charcoal dark:text-cream placeholder-gray-soft"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Supporter Details (Optional) */}
            <div className="space-y-3 pt-1 border-t border-charcoal/10 dark:border-white/10">
              <div className="space-y-1">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-gray-soft">
                  Your Name <span className="text-[10px] text-gray-soft/70">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  placeholder="Anonymous or your name / handle"
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-charcoal/5 dark:bg-surface-mid border border-charcoal/10 dark:border-white/10 focus:border-accent outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-gray-soft">
                  Message / Shoutout <span className="text-[10px] text-gray-soft/70">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={200}
                  value={supporterMessage}
                  onChange={(e) => setSupporterMessage(e.target.value)}
                  placeholder="Say something nice or recommend a coffee bean..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-charcoal/5 dark:bg-surface-mid border border-charcoal/10 dark:border-white/10 focus:border-accent outline-none transition-colors"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-soft pt-1">
              <span className="flex items-center gap-1">
                <FiHeart className="w-3.5 h-3.5 text-accent" />
                <span>100% direct developer support</span>
              </span>
              <span>UPI / Cards / NetBanking</span>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleInitiatePayment}
                onMouseEnter={playHoverSound}
                disabled={
                  paymentState === 'loading' ||
                  paymentState === 'checkout_opened' ||
                  paymentState === 'verifying' ||
                  getEffectiveAmount() < MIN_AMOUNT_INR ||
                  getEffectiveAmount() > MAX_AMOUNT_INR
                }
                className="w-full py-3.5 px-4 rounded-xl bg-accent text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {paymentState === 'loading' && (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    <span>Preparing Razorpay Order...</span>
                  </>
                )}

                {paymentState === 'checkout_opened' && (
                  <>
                    <FiCoffee className="w-4 h-4 animate-pulse text-cream" />
                    <span>Checkout Opened in Razorpay...</span>
                  </>
                )}

                {paymentState === 'verifying' && (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Payment Signature...</span>
                  </>
                )}

                {(paymentState === 'idle' || paymentState === 'cancelled' || paymentState === 'failed' || paymentState === 'verification_failed') && (
                  <>
                    <FiCoffee className="w-4 h-4" />
                    <span>Buy a Coffee ☕ (Test Mode 🧪 · ₹{getEffectiveAmount() > 0 ? getEffectiveAmount() : '--'})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
