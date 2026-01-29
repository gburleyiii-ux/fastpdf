import { FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-black text-gray-900">FastPDF</span>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-24 prose prose-lg">
        <h1 className="text-5xl font-black text-gray-900 mb-8">Terms of Service</h1>
        
        <p className="text-sm text-gray-500 mb-8">Last updated: January 29, 2026</p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Agreement to Terms</h2>
        <p className="text-gray-600">
          By accessing FastPDF, you agree to these Terms of Service. If you don't agree, please don't use our service.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Description of Service</h2>
        <p className="text-gray-600">
          FastPDF provides online PDF processing tools including merging, splitting, compressing, and converting PDF files. All processing happens client-side in your browser.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Account Registration</h2>
        <ul className="text-gray-600">
          <li>You must provide accurate information when creating an account</li>
          <li>You're responsible for maintaining account security</li>
          <li>You must be at least 13 years old to use FastPDF</li>
          <li>One person or entity per account</li>
          <li>You're responsible for all activity under your account</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Acceptable Use</h2>
        <p className="text-gray-600"><strong>You may:</strong></p>
        <ul className="text-gray-600">
          <li>Use FastPDF for personal or business purposes</li>
          <li>Process any PDF files you have rights to</li>
          <li>Share processed files as you wish</li>
        </ul>

        <p className="text-gray-600 mt-6"><strong>You may NOT:</strong></p>
        <ul className="text-gray-600">
          <li>Abuse or attempt to abuse the service</li>
          <li>Reverse engineer or copy our technology</li>
          <li>Use automated tools to access the service at scale</li>
          <li>Process illegal content</li>
          <li>Share your account with others</li>
          <li>Circumvent usage limits or payment requirements</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Free and Paid Plans</h2>
        
        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Free Tier</h3>
        <ul className="text-gray-600">
          <li>2 files per day limit</li>
          <li>All tools included</li>
          <li>No watermarks</li>
          <li>Files deleted after processing</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Pro Plan ($5/month or $48/year)</h3>
        <ul className="text-gray-600">
          <li>Unlimited file processing</li>
          <li>All features unlocked</li>
          <li>Priority support</li>
          <li>Cancel anytime</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Payment Terms</h2>
        <ul className="text-gray-600">
          <li>Payments processed securely through Stripe</li>
          <li>Subscriptions renew automatically</li>
          <li>Cancel anytime - no questions asked</li>
          <li>Refunds available within 30 days of initial purchase</li>
          <li>We reserve the right to change pricing with 30 days notice</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Cancellation & Refunds</h2>
        <p className="text-gray-600">
          You can cancel your subscription at any time from your account dashboard. You'll retain access until the end of your billing period. Refunds are provided within 30 days of initial purchase.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Intellectual Property</h2>
        <p className="text-gray-600">
          FastPDF and all related trademarks, logos, and service marks are our property. Your files remain yours - we claim no rights to content you process.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Disclaimer of Warranties</h2>
        <p className="text-gray-600">
          FastPDF is provided "as is" without warranties of any kind. We don't guarantee:
        </p>
        <ul className="text-gray-600">
          <li>Uninterrupted service availability</li>
          <li>Error-free operation</li>
          <li>Specific results or quality</li>
          <li>Compatibility with all browsers or devices</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Limitation of Liability</h2>
        <p className="text-gray-600">
          We're not liable for any damages arising from use of FastPDF, including lost data, lost profits, or other indirect damages. Maximum liability is limited to the amount you paid us in the last 12 months.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Data Loss</h2>
        <p className="text-gray-600">
          Since all processing happens in your browser, we're not responsible for any data loss. Always keep backups of important files.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Service Modifications</h2>
        <p className="text-gray-600">
          We reserve the right to:
        </p>
        <ul className="text-gray-600">
          <li>Modify or discontinue features</li>
          <li>Change pricing with notice</li>
          <li>Update these terms (with notification)</li>
          <li>Suspend or terminate accounts that violate terms</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Termination</h2>
        <p className="text-gray-600">
          We may terminate or suspend your account if you violate these terms. You can delete your account at any time.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Governing Law</h2>
        <p className="text-gray-600">
          These terms are governed by the laws of the United States. Disputes will be resolved in the courts of [Your State/Country].
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Changes to Terms</h2>
        <p className="text-gray-600">
          We may update these terms occasionally. Continued use after changes means you accept the new terms. We'll notify you of significant changes.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Contact</h2>
        <p className="text-gray-600">
          Questions about these terms? Contact us at:{" "}
          <a href="mailto:legal@fastpdf.app" className="text-blue-600 hover:underline">
            legal@fastpdf.app
          </a>
        </p>
      </div>
    </div>
  );
}
