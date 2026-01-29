"use client";

import { Check, Zap, Shield, FileText } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-black text-gray-900">FastPDF</span>
          </Link>
          <Link href="/merge" className="text-gray-600 hover:text-gray-900 font-medium">
            Try Free
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 mb-6">
            Simple, Honest Pricing
          </h1>
          <p className="text-2xl text-gray-600">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="text-sm font-bold text-gray-600 mb-4">FREE</div>
            <div className="text-5xl font-black text-gray-900 mb-2">$0</div>
            <div className="text-gray-600 mb-8">/forever</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="2 files per day" />
              <Feature text="All tools included" />
              <Feature text="No watermarks" />
              <Feature text="Files deleted after 1 hour" />
            </ul>

            <Link
              href="/merge"
              className="block w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold text-center hover:bg-gray-200 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Monthly */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white transform scale-105 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold">PRO</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
            </div>
            <div className="text-5xl font-black mb-2">$5</div>
            <div className="opacity-90 mb-8">/month</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="Unlimited files" light />
              <Feature text="All tools included" light />
              <Feature text="No watermarks" light />
              <Feature text="Priority support" light />
              <Feature text="Files deleted after 1 hour" light />
              <Feature text="Cancel anytime" light />
            </ul>

            <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-black hover:scale-105 transition-transform">
              Start Free Trial →
            </button>
            <p className="text-xs opacity-75 text-center mt-3">No credit card required</p>
          </div>

          {/* Pro Yearly */}
          <div className="bg-white rounded-3xl p-8 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-gray-600">PRO YEARLY</div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                SAVE 20%
              </div>
            </div>
            <div className="text-5xl font-black text-gray-900 mb-2">$4</div>
            <div className="text-gray-600 mb-1">/month</div>
            <div className="text-sm text-gray-500 mb-8">Billed $48 annually</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="Everything in Pro" />
              <Feature text="Save $12 per year" />
              <Feature text="Lock in this price forever" />
              <Feature text="Priority support" />
            </ul>

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-black hover:scale-105 transition-transform">
              Start Free Trial →
            </button>
          </div>
        </div>

        {/* Enterprise */}
        <div className="max-w-3xl mx-auto mt-16 bg-white border-2 border-gray-200 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600">
                Custom solutions for teams and businesses
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <FAQ
              question="Is FastPDF really free?"
              answer="Yes! You can merge 2 PDFs per day for free, forever. No credit card, no tricks."
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
    </div>
  );
}

function Feature({ text, light }: { text: string; light?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <Check className={`w-5 h-5 flex-shrink-0 ${light ? 'text-white' : 'text-green-600'}`} />
      <span className={light ? 'text-white' : 'text-gray-700'}>{text}</span>
    </li>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
