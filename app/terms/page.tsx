import { FileText } from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function TermsPage() {
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
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-8 theme-transition">Terms of Service</h1>
        
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 theme-transition">Last updated: January 29, 2026</p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Agreement to Terms</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          By accessing FastPDF, you agree to these Terms of Service. If you don't agree, please don't use our service.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Description of Service</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          FastPDF provides online PDF processing tools including merging, splitting, compressing, and converting PDF files. All processing happens client-side in your browser.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Account Registration</h2>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>You must provide accurate information when creating an account</li>
          <li>You're responsible for maintaining account security</li>
          <li>You must be at least 13 years old to use FastPDF</li>
          <li>One person or entity per account</li>
          <li>You're responsible for all activity under your account</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Acceptable Use</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition"><strong>You may:</strong></p>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>Use FastPDF for personal or business purposes</li>
          <li>Process any PDF files you have rights to</li>
          <li>Share processed files as you wish</li>
        </ul>

        <p className="text-gray-600 dark:text-slate-300 mt-6 theme-transition"><strong>You may NOT:</strong></p>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>Abuse or attempt to abuse the service</li>
          <li>Reverse engineer or copy our technology</li>
          <li>Use automated tools to access the service at scale</li>
          <li>Process illegal content</li>
          <li>Share your account with others</li>
          <li>Circumvent usage limits or payment requirements</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Payments and Refunds</h2>
        <ul className="text-gray-600 dark:text-slate-300 theme-transition">
          <li>Pro subscriptions are billed monthly or annually</li>
          <li>You can cancel anytime from your dashboard</li>
          <li>Refunds available within 30 days of initial purchase</li>
          <li>Prices may change with 30 days notice</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Limitation of Liability</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          FastPDF is provided "as is" without warranties of any kind. We're not liable for any damages arising from your use of the service.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Changes to Terms</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          We may update these terms at any time. Continued use after changes means you accept the new terms.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Contact</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          Questions about these terms? Contact us at <a href="mailto:legal@fastpdf.app" className="text-blue-600 dark:text-blue-400 hover:underline">legal@fastpdf.app</a>
        </p>
      </div>
    </div>
  );
}
