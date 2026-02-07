import { FileText, HelpCircle, Mail } from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function HelpPage() {
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
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 theme-transition">Help Center</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300 theme-transition">Common questions and answers</p>
        </div>

        <div className="space-y-6">
          <HelpItem
            q="How do I merge PDFs?"
            a="Go to the Merge PDF page, drag and drop your PDF files, arrange them in order, then click 'Merge PDFs'. Your merged file will download automatically."
          />
          <HelpItem
            q="Are my files private?"
            a="Yes! All processing happens in your browser. Your files never leave your device. We literally can't see your documents."
          />
          <HelpItem
            q="How many files can I process for free?"
            a="Free users can process 2 files per day. Pro users get unlimited processing for $5/month."
          />
          <HelpItem
            q="Can I cancel my subscription?"
            a="Yes, anytime from your dashboard. No questions asked. You'll retain access until the end of your billing period."
          />
          <HelpItem
            q="Do you offer refunds?"
            a="Yes, we offer full refunds within 30 days of initial purchase."
          />
          <HelpItem
            q="What file formats do you support?"
            a="We currently support PDF files. More formats coming soon!"
          />
          <HelpItem
            q="Is there a file size limit?"
            a="Free users: 50MB per file. Pro users: 500MB per file."
          />
          <HelpItem
            q="Do you work on mobile?"
            a="Yes! FastPDF works on any device with a modern browser - desktop, tablet, or mobile."
          />
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-lg theme-transition">
          <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 theme-transition">Still need help?</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6 theme-transition">
            Can't find what you're looking for? We're here to help!
          </p>
          <a
            href="mailto:support@fastpdf.app"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}

function HelpItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 theme-transition">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 theme-transition">{q}</h3>
      <p className="text-gray-600 dark:text-slate-300 theme-transition">{a}</p>
    </div>
  );
}
