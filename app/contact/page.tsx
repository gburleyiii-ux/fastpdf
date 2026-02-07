import { FileText, Mail, Twitter, MessageCircle } from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function ContactPage() {
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
          <MessageCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 theme-transition">Get in Touch</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300 theme-transition">We'd love to hear from you!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Support */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center theme-transition">
            <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 theme-transition">Support</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6 theme-transition">
              Need help? Have a question? We typically respond within 24 hours.
            </p>
            <a
              href="mailto:support@fastpdf.app"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              support@fastpdf.app
            </a>
          </div>

          {/* General Inquiries */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center theme-transition">
            <Mail className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 theme-transition">General</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6 theme-transition">
              General inquiries, partnerships, or business questions.
            </p>
            <a
              href="mailto:hello@fastpdf.app"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              hello@fastpdf.app
            </a>
          </div>

          {/* Feedback */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center theme-transition">
            <MessageCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 theme-transition">Feedback</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6 theme-transition">
              Feature requests, suggestions, or things you'd like to see.
            </p>
            <a
              href="mailto:feedback@fastpdf.app"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              feedback@fastpdf.app
            </a>
          </div>

          {/* Social */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center theme-transition">
            <Twitter className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 theme-transition">Social</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6 theme-transition">
              Follow us for updates, tips, and new features.
            </p>
            <a
              href="https://twitter.com/fastpdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-500 transition-colors"
            >
              @fastpdf
            </a>
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center theme-transition">
          <p className="text-gray-700 dark:text-slate-300 theme-transition">
            <strong>Average Response Time:</strong> Within 24 hours on weekdays
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 theme-transition">
            For urgent issues, please use support@fastpdf.app
          </p>
        </div>
      </div>
    </div>
  );
}
