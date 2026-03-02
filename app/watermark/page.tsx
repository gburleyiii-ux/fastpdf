"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, X, Zap, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

const POSITIONS = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
type Position = typeof POSITIONS[number];

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(60);
  const [position, setPosition] = useState<Position>('center');
  const [diagonal, setDiagonal] = useState(true);
  const [adding, setAdding] = useState(false);
  const [resultPdf, setResultPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('watermark');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResultPdf(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const addWatermark = async () => {
    if (!file || !text.trim()) return;
    if (!user) { setShowAuthModal(true); return; }
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited use.');
      return;
    }

    setAdding(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x: number;
        let y: number;
        const padding = 40;

        switch (position) {
          case 'top-left':     x = padding; y = height - textHeight - padding; break;
          case 'top-right':    x = width - textWidth - padding; y = height - textHeight - padding; break;
          case 'bottom-left':  x = padding; y = padding; break;
          case 'bottom-right': x = width - textWidth - padding; y = padding; break;
          default:             x = (width - textWidth) / 2; y = (height - textHeight) / 2;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: diagonal ? degrees(45) : degrees(0),
        });
      }

      const pdfBytes = await pdf.save();
      setResultPdf(pdfBytes);
      await logUsage();
    } catch (error) {
      console.error('Watermark error:', error);
      alert('Failed to add watermark. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const download = () => {
    if (!resultPdf) return;
    const blob = new Blob([resultPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_watermarked.pdf` : 'watermarked.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResultPdf(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
                {!isPro && (
                  <Link href="/pricing" className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                    Upgrade to Pro
                  </Link>
                )}
                <button onClick={signOut} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <span className="text-sm">💧</span>
            PDF Watermark
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Add Watermark</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">Stamp a text watermark on every page of your PDF.</p>
        </div>

        {/* Banners */}
        {user && !isPro && !usageLoading && (
          <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              <span className="font-bold text-gray-900 dark:text-white">{remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} remaining today</span>
            </div>
            <Link href="/pricing" className="text-violet-600 dark:text-violet-400 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}
        {user && isPro && (
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl p-4 mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6" /><span className="font-bold">Pro Plan • Unlimited Use</span>
          </div>
        )}
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">Sign in to add watermarks</span>
            </div>
            <button onClick={() => setShowAuthModal(true)} className="text-violet-600 dark:text-violet-400 font-bold hover:underline text-sm">Sign In →</button>
          </div>
        )}

        {!resultPdf ? (
          <div className="space-y-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">💧</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isDragActive ? 'Drop PDF here' : 'Click or drag PDF here'}</h3>
                <p className="text-gray-600 dark:text-slate-400">Choose the PDF to watermark</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 flex items-center justify-between theme-transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{file.name}</h3>
                    <p className="text-gray-600 dark:text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <button onClick={reset} className="text-gray-400 hover:text-red-600 transition-colors"><X className="w-6 h-6" /></button>
              </div>
            )}

            {file && (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 space-y-5 theme-transition">
                <h3 className="font-bold text-gray-900 dark:text-white">Watermark Settings</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Watermark Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Opacity: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range" min="5" max="80" value={Math.round(opacity * 100)}
                    onChange={e => setOpacity(Number(e.target.value) / 100)}
                    className="w-full accent-violet-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Font Size: {fontSize}pt
                  </label>
                  <input
                    type="range" min="20" max="120" value={fontSize}
                    onChange={e => setFontSize(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Position</label>
                  <select
                    value={position}
                    onChange={e => setPosition(e.target.value as Position)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={diagonal}
                    onChange={e => setDiagonal(e.target.checked)}
                    className="w-5 h-5 rounded accent-violet-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Diagonal (45° angle)</span>
                </label>

                <button
                  onClick={addWatermark}
                  disabled={adding || !text.trim() || (!!user && !canUse && !isPro) || usageLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                >
                  {adding ? 'Adding watermark...' : !user ? 'Sign In to Continue →' : user && !canUse && !isPro ? 'Upgrade to Continue →' : 'Add Watermark →'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center theme-transition">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Watermark Added!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">"{text}" has been stamped on every page.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={download}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
              >
                <Download className="w-5 h-5" />
                Download Watermarked PDF
              </button>
              <button onClick={reset} className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                Watermark Another
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4 theme-transition">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your files are 100% private</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">All processing happens in your browser. Your files never leave your device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
