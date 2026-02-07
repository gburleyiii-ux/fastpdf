"use client";

import { FileText, Merge, Scissors, Minimize2, Image, Download, Shield, Zap, Check } from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </div>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Link href="/pricing" className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium theme-transition">
              Pricing
            </Link>
            <Link
              href="/merge"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-8 theme-transition">
          ⚡ Fast, secure PDF processing in your browser
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight theme-transition">
          PDF Tools That<br />Actually Work
        </h1>
        
        <p className="text-2xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 theme-transition">
          Merge, split, compress, and convert PDFs in seconds. Simple, fast, and 100% private.
        </p>

        {/* Tool Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
          <ToolCard icon={<Merge />} title="Merge PDF" href="/merge" color="blue" />
          <ToolCard icon={<Scissors />} title="Split PDF" href="/split" color="purple" />
          <ToolCard icon={<Minimize2 />} title="Compress PDF" href="/compress" color="green" />
          <ToolCard icon={<Image />} title="JPG to PDF" href="/jpg-to-pdf" color="orange" />
          <ToolCard icon={<FileText />} title="PDF to JPG" href="/pdf-to-jpg" color="pink" />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>100% private - files never leave your device</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>Client-side processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>Free tier available</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black text-center mb-16 text-gray-900 dark:text-white theme-transition">
          Why FastPDF?
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon="⚡"
            title="Lightning Fast"
            description="Process PDFs in your browser. No upload time, no waiting. Instant results."
          />
          <FeatureCard
            icon="🔒"
            title="Completely Private"
            description="Your files never leave your device. We don't store anything. Period."
          />
          <FeatureCard
            icon="💎"
            title="Professional Quality"
            description="Output PDFs that look perfect. No compression artifacts or quality loss."
          />
          <FeatureCard
            icon="📱"
            title="Works Everywhere"
            description="Desktop, mobile, tablet. Any device, any browser. Just works."
          />
          <FeatureCard
            icon="🎯"
            title="No BS Pricing"
            description="Free for daily use. $5/mo for unlimited. No hidden fees or tricks."
          />
          <FeatureCard
            icon="🚀"
            title="Always Improving"
            description="New tools added monthly. Your feedback shapes the product."
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-4">Ready to Go Unlimited?</h2>
          <p className="text-xl mb-8 opacity-90">
            Process unlimited PDFs, no watermarks, priority support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-black mb-2">$5</div>
              <div className="text-lg opacity-90">/month</div>
              <div className="text-sm opacity-75 mt-2">Billed monthly</div>
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-white">
              <div className="text-sm font-bold mb-2">🔥 BEST VALUE</div>
              <div className="text-5xl font-black mb-2">$4</div>
              <div className="text-lg opacity-90">/month</div>
              <div className="text-sm opacity-75 mt-2">Billed yearly ($48)</div>
            </div>
          </div>
          <Link
            href="/merge"
            className="inline-block bg-white text-blue-600 px-12 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform"
          >
            Try It Free →
          </Link>
          <p className="text-sm opacity-75 mt-4">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-6 py-24 prose prose-lg dark:prose-invert">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">The Best PDF Tools Online</h2>
        <p className="text-gray-600 dark:text-slate-300">
          FastPDF is the fastest, easiest way to work with PDF files online. Whether you need to merge multiple PDFs into one document, split a large PDF into separate pages, compress a PDF to reduce file size, or convert between PDF and image formats, FastPDF has you covered.
        </p>
        <p className="text-gray-600 dark:text-slate-300">
          Unlike other PDF tools that require expensive software downloads or sketchy online converters, FastPDF works entirely in your browser. Your files are processed locally on your device, which means they never leave your computer. This makes FastPDF the most secure and private way to handle sensitive documents.
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free PDF Merger</h3>
        <p className="text-gray-600 dark:text-slate-300">
          Combine multiple PDF files into a single document with our free PDF merger. Simply drag and drop your files, arrange them in the order you want, and download the merged PDF instantly. Perfect for combining invoices, contracts, or reports.
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Splitter & Extractor</h3>
        <p className="text-gray-600 dark:text-slate-300">
          Split large PDFs into individual pages or extract specific pages you need. Our PDF splitter tool is perfect for extracting important sections from lengthy documents or breaking down large files for easier sharing.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-slate-800 py-12 theme-transition">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="font-black text-gray-900 dark:text-white">FastPDF</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Professional PDF tools that actually work. Built for speed and privacy.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><Link href="/merge" className="hover:text-blue-600 dark:hover:text-blue-400">Merge PDF</Link></li>
                <li><Link href="/split" className="hover:text-blue-600 dark:hover:text-blue-400">Split PDF</Link></li>
                <li><Link href="/compress" className="hover:text-blue-600 dark:hover:text-blue-400">Compress PDF</Link></li>
                <li><Link href="/jpg-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400">JPG to PDF</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><Link href="/help" className="hover:text-blue-600 dark:hover:text-blue-400">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link></li>
                <li><a href="https://twitter.com/fastpdf" className="hover:text-blue-600 dark:hover:text-blue-400">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t dark:border-slate-700 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-slate-400">
            © 2026 FastPDF. Built with ❤️ for people who hate slow PDF tools.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ToolCard({ icon, title, href, color }: { icon: React.ReactNode; title: string; href: string; color: string }) {
  const colors = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200 dark:shadow-blue-900/30",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-200 dark:shadow-purple-900/30",
    green: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-200 dark:shadow-green-900/30",
    orange: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-200 dark:shadow-orange-900/30",
    pink: "bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-200 dark:shadow-pink-900/30",
  };

  return (
    <Link
      href={href}
      className={`${colors[color as keyof typeof colors]} text-white p-6 rounded-2xl hover:scale-105 transition-all shadow-lg dark:shadow-lg`}
    >
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
    </Link>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 theme-transition">{title}</h3>
      <p className="text-gray-600 dark:text-slate-400 theme-transition">{description}</p>
    </div>
  );
}
