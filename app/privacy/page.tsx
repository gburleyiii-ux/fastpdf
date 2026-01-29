import { FileText } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="text-5xl font-black text-gray-900 mb-8">Privacy Policy</h1>
        
        <p className="text-sm text-gray-500 mb-8">Last updated: January 29, 2026</p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">The Short Version</h2>
        <p className="text-gray-600">
          <strong>We don't see your files.</strong> All PDF processing happens in your browser. Your documents never leave your device. We don't store, process, or have access to your files. Ever.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Information We Collect</h2>
        
        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Account Information</h3>
        <p className="text-gray-600">
          When you create an account, we collect:
        </p>
        <ul className="text-gray-600">
          <li>Email address (for login and notifications)</li>
          <li>Password (encrypted, we can't see it)</li>
          <li>Payment information (processed by Stripe, we never see your card details)</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Usage Information</h3>
        <p className="text-gray-600">
          We track basic usage to prevent abuse:
        </p>
        <ul className="text-gray-600">
          <li>Number of files processed per day (for free tier limits)</li>
          <li>Browser and device type (for compatibility)</li>
          <li>General location (country-level, for performance)</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">What We DON'T Collect</h3>
        <ul className="text-gray-600">
          <li><strong>Your PDF files</strong> - They never leave your browser</li>
          <li><strong>File contents</strong> - We can't see what's in your documents</li>
          <li><strong>File names</strong> - We don't track what you're processing</li>
          <li><strong>Browsing history</strong> - We don't use tracking cookies</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">How We Use Your Information</h2>
        <ul className="text-gray-600">
          <li>Provide and improve our service</li>
          <li>Process payments (via Stripe)</li>
          <li>Send important account notifications</li>
          <li>Prevent abuse and enforce usage limits</li>
          <li>Respond to support requests</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Data Storage & Security</h2>
        <p className="text-gray-600">
          Your account data is stored securely with industry-standard encryption. Payment information is handled entirely by Stripe (PCI compliant). We use Supabase for authentication and database storage.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Third-Party Services</h2>
        <ul className="text-gray-600">
          <li><strong>Stripe:</strong> Payment processing (see Stripe's privacy policy)</li>
          <li><strong>Netlify:</strong> Hosting and CDN</li>
          <li><strong>Supabase:</strong> Authentication and database</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Your Rights</h2>
        <p className="text-gray-600">You have the right to:</p>
        <ul className="text-gray-600">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and data</li>
          <li>Export your data</li>
          <li>Opt-out of marketing emails</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Cookie Policy</h2>
        <p className="text-gray-600">
          We use essential cookies only for:
        </p>
        <ul className="text-gray-600">
          <li>Keeping you logged in</li>
          <li>Remembering your preferences</li>
          <li>Security and fraud prevention</li>
        </ul>
        <p className="text-gray-600">
          We don't use tracking or advertising cookies.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Children's Privacy</h2>
        <p className="text-gray-600">
          FastPDF is not intended for children under 13. We don't knowingly collect information from children.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this policy occasionally. We'll notify you of significant changes via email.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Contact Us</h2>
        <p className="text-gray-600">
          Questions about privacy? Email us at:{" "}
          <a href="mailto:privacy@fastpdf.app" className="text-blue-600 hover:underline">
            privacy@fastpdf.app
          </a>
        </p>
      </div>
    </div>
  );
}
