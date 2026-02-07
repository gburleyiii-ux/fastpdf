"use client";

import { Check, Zap, Shield, FileText, Building2, Clock } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      alert('Please sign in first');
      return;
    }

    setLoading(priceId);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, priceId }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Link href="/merge" className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium theme-transition">
              Try Free
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            Simple, Honest Pricing
          </div>
          <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-6 theme-transition">
            Choose Your Plan
          </h1>
          <p className="text-2xl text-gray-600 dark:text-slate-300">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-slate-700 theme-transition hover:border-gray-300 dark:hover:border-slate-600">
            <div className="text-sm font-bold text-gray-600 dark:text-slate-400 mb-4">FREE</div>
            <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">$0</div>
            <div className="text-gray-600 dark:text-slate-400 mb-8">/forever</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="2 files per day" />
              <Feature text="All tools included" />
              <Feature text="No watermarks" />
              <Feature text="100% private processing" />
            </ul>

            <Link
              href="/merge"
              className="block w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white py-3 rounded-xl font-bold text-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Monthly */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white transform scale-105 shadow-2xl shadow-blue-200 dark:shadow-blue-900/30 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold">PRO</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                MONTHLY
              </div>
            </div>
            <div className="text-5xl font-black mb-2">$5</div>
            <div className="opacity-90 mb-8">/month</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="Unlimited files" light />
              <Feature text="All tools included" light />
              <Feature text="No watermarks" light />
              <Feature text="Priority support" light />
              <Feature text="100% private processing" light />
              <Feature text="Cancel anytime" light />
            </ul>

            <button 
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || '')}
              disabled={loading !== null}
              className="w-full bg-white text-blue-600 py-3 rounded-xl font-black hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY ? 'Loading...' : 'Get Pro Monthly →'}
            </button>
            <p className="text-xs opacity-75 text-center mt-3">{user ? 'Secure checkout with Stripe' : 'Sign in to subscribe'}</p>
          </div>

          {/* Pro Yearly */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-purple-200 dark:border-purple-800 theme-transition hover:border-purple-300 dark:hover:border-purple-700">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-purple-600 dark:text-purple-400">PRO YEARLY</div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                SAVE 20%
              </div>
            </div>
            <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">$4</div>
            <div className="text-gray-600 dark:text-slate-400 mb-1">/month</div>
            <div className="text-sm text-gray-500 dark:text-slate-500 mb-8">Billed $48 annually</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="Everything in Pro Monthly" />
              <Feature text="Save $12 per year" />
              <Feature text="Lock in this price forever" />
              <Feature text="Priority support" />
            </ul>

            <button 
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY || '')}
              disabled={loading !== null}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-black hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY ? 'Loading...' : 'Get Pro Yearly →'}
            </button>
          </div>
        </div>

        {/* Enterprise */}
        <div className="max-w-3xl mx-auto mt-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl p-8 relative overflow-hidden theme-transition">
          <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Coming Soon
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Enterprise</h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Custom solutions for teams and businesses
                </p>
                <ul className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500 dark:text-slate-400">
                  <li className="flex items-center gap-1">
                    <Shield className="w-4 h-4" /> SSO
                  </li>
                  <li className="flex items-center gap-1">
                    <Zap className="w-4 h-4" /> API Access
                  </li>
                  <li className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> Dedicated Support
                  </li>
                </ul>
              </div>
            </div>
            <button
              disabled
              className="bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-slate-400 px-8 py-3 rounded-xl font-bold cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-3xl mx-auto mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Secure Stripe Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>30-Day Money Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>Instant Access</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-12 theme-transition">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <FAQ
              question="Is FastPDF really free?"
              answer="Yes! You can process 2 PDFs per day for free, forever. No credit card, no tricks."
            />
            <FAQ
              question="Are my files private?"
              answer="Absolutely. All processing happens in your browser. Your files never leave your device and are never uploaded to our servers."
            />
            <FAQ
              question="Can I cancel anytime?"
              answer="Yes. Cancel your subscription anytime from your account settings. No questions asked."
            />
            <FAQ
              question="Do you offer refunds?"
              answer="Yes. If you're not satisfied within the first 30 days, we'll refund you 100%."
            />
            <FAQ
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, Amex) via Stripe. All payments are secure and encrypted."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-800 py-12 theme-transition">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-black text-gray-900 dark:text-white">FastPDF</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Professional PDF tools that actually work. Built for speed and privacy.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ text, light }: { text: string; light?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <Check className={`w-5 h-5 flex-shrink-0 ${light ? 'text-white' : 'text-green-600 dark:text-green-400'}`} />
      <span className={light ? 'text-white' : 'text-gray-700 dark:text-slate-300'}>{text}</span>
    </li>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 theme-transition">
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{question}</h3>
      <p className="text-gray-600 dark:text-slate-400">{answer}</p>
    </div>
  );
}
