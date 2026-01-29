import { FileText, HelpCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
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
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">Common questions and answers</p>
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
        <div className="mt-16 bg-white rounded-2xl p-12 text-center shadow-lg">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{q}</h3>
      <p className="text-gray-600">{a}</p>
    </div>
  );
}
