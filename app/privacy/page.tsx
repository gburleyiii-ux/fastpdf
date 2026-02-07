import { FileText } from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white theme-transition">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Link href="/" className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium theme-transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-24 prose prose-lg dark:prose-invert">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-8 theme-transition">Privacy Policy</h1>
        
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 theme-transition">Last updated: January 29, 2026</p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">The Short Version</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          <strong>We don't see your files.</strong> All PDF processing happens in your browser. Your documents never leave your device. We don't store, process, or have access to your files. Ever.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Information We Collect</h2>
        
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-3 theme-transition">Account Information</h3>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          When you create an account, we collect:
        </p>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>Email address (for login and notifications)</li>
          <li>Password (encrypted, we can't see it)</li>
          <li>Payment information (processed by Stripe, we never see your card details)</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-3 theme-transition">Usage Information</h3>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          We track basic usage to prevent abuse:
        </p>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>Number of files processed per day (for free tier limits)</li>
          <li>Browser and device type (for compatibility)</li>
          <li>General location (country-level, for performance)</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-3 theme-transition">What We DON'T Collect</h3>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li><strong>Your PDF files</strong> - They never leave your browser</li>
          <li><strong>File contents</strong> - We can't see what's in your documents</li>
          <li><strong>File names</strong> - We don't track what you're processing</li>
          <li><strong>Browsing history</strong> - We don't use tracking cookies</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">How We Use Your Information</h2>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>To provide and maintain our service</li>
          <li>To process your subscription payments</li>
          <li>To send you important updates (billing, security)</li>
          <li>To prevent abuse and enforce usage limits</li>
          <li>To improve our service based on usage patterns</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Data Security</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          We use industry-standard encryption and security practices. All data is stored in secure, SOC 2 compliant data centers. We regularly review and update our security measures.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Your Rights</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          You have the right to:
        </p>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and data</li>
          <li>Export your data</li>
          <li>Opt out of non-essential communications</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Contact Us</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          If you have questions about this Privacy Policy, contact us at:
        </p>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          Email: <a href="mailto:privacy@fastpdf.app" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@fastpdf.app</a>
        </p>
      </div>
    </div>
  );
}
