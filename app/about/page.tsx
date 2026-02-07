import { FileText } from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function AboutPage() {
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
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-8 theme-transition">About FastPDF</h1>
        
        <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 theme-transition">
          We built FastPDF because we were tired of slow, complicated PDF tools that don't respect your privacy.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Our Mission</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          Make PDF editing fast, simple, and private. No bloated software. No sketchy uploads. Just tools that work.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">How It Works</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          All PDF processing happens directly in your browser using cutting-edge JavaScript libraries. Your files never touch our servers. We literally can't see your documents - they never leave your device.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Why FastPDF?</h2>
        <ul className="text-gray-600 dark:text-slate-300 space-y-2 theme-transition">
          <li><strong>Privacy First:</strong> Client-side processing means your files stay on your device</li>
          <li><strong>Lightning Fast:</strong> No upload time, no waiting in queues, instant results</li>
          <li><strong>Honest Pricing:</strong> $5/month for unlimited use. No tricks, no hidden fees</li>
          <li><strong>No Installation:</strong> Works in any modern browser on any device</li>
          <li><strong>Always Improving:</strong> New features added regularly based on user feedback</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Built By Makers</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          FastPDF is built by a small team who believes software should be fast, simple, and respect users. We're not a massive corporation - we're just people who wanted better PDF tools.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-4 theme-transition">Contact Us</h2>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          Have questions, feedback, or feature requests? We'd love to hear from you.
        </p>
        <p className="text-gray-600 dark:text-slate-300 theme-transition">
          Email: <a href="mailto:hello@fastpdf.app" className="text-blue-600 dark:text-blue-400 hover:underline">hello@fastpdf.app</a>
        </p>
      </div>
    </div>
  );
}
