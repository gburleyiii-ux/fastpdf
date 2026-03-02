"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, X, Zap, Lock, CheckCircle2, Unlock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function UnlockPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockedPdf, setUnlockedPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState('');

  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('unlock');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setUnlockedPdf(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const unlock = async () => {
    if (!file) return;
    if (!user) { setShowAuthModal(true); return; }
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited use.');
      return;
    }

    setUnlocking(true);
    setError('');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { password });
      // Re-save without password
      const pdfBytes = await pdf.save();
      setUnlockedPdf(pdfBytes);
      await logUsage();
    } catch (err: any) {
      if (err.message?.includes('password') || err.message?.includes('Password') || err.message?.includes('encrypted')) {
        setError('Incorrect password. Please try again.');
      } else if (err.message?.includes('not encrypted')) {
        setError('This PDF is not password protected.');
      } else {
        setError('Failed to unlock PDF. Please check your password and try again.');
      }
      console.error('Unlock error:', err);
    } finally {
      setUnlocking(false);
    }
  };

  const download = () => {
    if (!unlockedPdf) return;
    const blob = new Blob([unlockedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_unlocked.pdf` : 'unlocked.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setUnlockedPdf(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
                {!isPro && (
                  <Link href="/pricing" className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                    Upgrade to Pro
                  </Link>
                )}
                <button onClick={signOut} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Unlock className="w-4 h-4" />
            PDF Security
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Unlock PDF</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">Remove password protection from your PDF. You must know the current password.</p>
        </div>

        {/* Banners */}
        {user && !isPro && !usageLoading && (
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <span className="font-bold text-gray-900 dark:text-white">{remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} remaining today</span>
            </div>
            <Link href="/pricing" className="text-teal-600 dark:text-teal-400 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}
        {user && isPro && (
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl p-4 mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6" /><span className="font-bold">Pro Plan • Unlimited Use</span>
          </div>
        )}
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">Sign in to unlock PDFs</span>
            </div>
            <button onClick={() => setShowAuthModal(true)} className="text-teal-600 dark:text-teal-400 font-bold hover:underline text-sm">Sign In →</button>
          </div>
        )}

        {!unlockedPdf ? (
          <div className="space-y-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Unlock className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isDragActive ? 'Drop PDF here' : 'Click or drag PDF here'}</h3>
                <p className="text-gray-600 dark:text-slate-400">Select the password-protected PDF</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 flex items-center justify-between theme-transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
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
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 space-y-4 theme-transition">
                <h3 className="font-bold text-gray-900 dark:text-white">Enter Current Password</h3>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter the PDF password"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white pr-12 focus:ring-2 focus:ring-teal-500 outline-none"
                    onKeyDown={e => e.key === 'Enter' && unlock()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>
                )}

                <button
                  onClick={unlock}
                  disabled={unlocking || !password || (!!user && !canUse && !isPro) || usageLoading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-200 dark:shadow-teal-900/30"
                >
                  {unlocking ? 'Unlocking...' : !user ? 'Sign In to Unlock →' : user && !canUse && !isPro ? 'Upgrade to Continue →' : 'Remove Password →'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center theme-transition">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">PDF Unlocked!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Password protection has been removed from your PDF.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={download}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-teal-200 dark:shadow-teal-900/30"
              >
                <Download className="w-5 h-5" />
                Download Unlocked PDF
              </button>
              <button onClick={reset} className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                Unlock Another
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4 theme-transition">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your files are 100% private</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              All processing happens in your browser. Your files and passwords never leave your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
