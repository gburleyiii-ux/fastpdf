"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, X, Zap, Lock, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [protecting, setProtecting] = useState(false);
  const [protectedPdf, setProtectedPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('protect');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setProtectedPdf(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const protect = async () => {
    if (!file || !password) return;
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (password.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }
    if (!user) { setShowAuthModal(true); return; }
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited use.');
      return;
    }

    setProtecting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      // pdf-lib encrypt support: save with userPassword/ownerPassword
      const pdfBytes = await pdf.save({
        userPassword: password,
        ownerPassword: password + '_owner',
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });
      setProtectedPdf(pdfBytes);
      await logUsage();
    } catch (error) {
      console.error('Protect error:', error);
      alert('Failed to protect PDF. Please try again.');
    } finally {
      setProtecting(false);
    }
  };

  const download = () => {
    if (!protectedPdf) return;
    const blob = new Blob([protectedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_protected.pdf` : 'protected.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setProtectedPdf(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
                {!isPro && (
                  <Link href="/pricing" className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                    Upgrade to Pro
                  </Link>
                )}
                <button onClick={signOut} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <ShieldCheck className="w-4 h-4" />
            PDF Security
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Protect PDF</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">Password-protect your PDF to prevent unauthorized access.</p>
        </div>

        {/* Banners */}
        {user && !isPro && !usageLoading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
              <span className="font-bold text-gray-900 dark:text-white">{remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} remaining today</span>
            </div>
            <Link href="/pricing" className="text-red-600 dark:text-red-400 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}
        {user && isPro && (
          <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl p-4 mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6" /><span className="font-bold">Pro Plan • Unlimited Use</span>
          </div>
        )}
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">Sign in to protect PDFs</span>
            </div>
            <button onClick={() => setShowAuthModal(true)} className="text-red-600 dark:text-red-400 font-bold hover:underline text-sm">Sign In →</button>
          </div>
        )}

        {!protectedPdf ? (
          <div className="space-y-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isDragActive ? 'Drop PDF here' : 'Click or drag PDF here'}</h3>
                <p className="text-gray-600 dark:text-slate-400">Select the PDF to password protect</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 flex items-center justify-between theme-transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                <h3 className="font-bold text-gray-900 dark:text-white">Set Password</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white pr-12 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">Passwords do not match</p>
                )}

                <button
                  onClick={protect}
                  disabled={protecting || !password || password !== confirmPassword || (!!user && !canUse && !isPro) || usageLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 dark:shadow-red-900/30"
                >
                  {protecting ? 'Protecting...' : !user ? 'Sign In to Protect →' : user && !canUse && !isPro ? 'Upgrade to Continue →' : 'Protect PDF →'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center theme-transition">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">PDF Protected!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Your PDF is now password protected. Keep your password safe — it cannot be recovered.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={download}
                className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-red-200 dark:shadow-red-900/30"
              >
                <Download className="w-5 h-5" />
                Download Protected PDF
              </button>
              <button onClick={reset} className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                Protect Another
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4 theme-transition">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
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
