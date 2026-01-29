import { FileText, Mail, Twitter, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
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
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Support */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Support</h3>
            <p className="text-gray-600 mb-6">
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
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">General</h3>
            <p className="text-gray-600 mb-6">
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
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Feedback</h3>
            <p className="text-gray-600 mb-6">
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
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Twitter className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Social</h3>
            <p className="text-gray-600 mb-6">
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
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-gray-700">
            <strong>Average Response Time:</strong> Within 24 hours on weekdays
          </p>
          <p className="text-sm text-gray-600 mt-2">
            For urgent issues, please use support@fastpdf.app
          </p>
        </div>
      </div>
    </div>
  );
}
