"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, X, Scissors, Zap, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitting, setSplitting] = useState(false);
  const [splitPdfs, setSplitPdfs] = useState<{ name: string; data: Uint8Array }[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('split');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile);
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  });

  const splitPDF = async () => {
    if (!file) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited usage.');
      return;
    }

    setSplitting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdfs = [];

      for (let i = 0; i < sourcePdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        newPdfs.push({
          name: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`,
          data: pdfBytes
        });
      }

      setSplitPdfs(newPdfs);
      await logUsage();
    } catch (error) {
      console.error('Split error:', error);
      alert('Failed to split PDF. Please try again.');
    } finally {
      setSplitting(false);
    }
  };

  const downloadAll = () => {
    splitPdfs.forEach(pdf => {
      const blob = new Blob([pdf.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdf.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const reset = () => {
    setFile(null);
    setSplitPdfs([]);
    setPageCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
                {!isPro && (
                  <Link
                    href="/pricing"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    Upgrade to Pro
                  </Link>
                )}
                <button onClick={signOut} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Scissors className="w-4 h-4" />
            PDF Extractor
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Split PDF Files</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">Extract pages from your PDF documents. Fast, easy, and secure.</p>
        </div>

        {/* Usage Counter */}
        {user && !isPro && !usageLoading && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-gray-900 dark:text-white">{remainingUses} free uses remaining today</span>
            </div>
            <Link href="/pricing" className="text-purple-600 dark:text-purple-400 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}

        {user && isPro && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span className="font-bold">Pro Plan • Unlimited Splits</span>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">
                Sign in to start splitting PDFs
              </span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline text-sm"
            >
              Sign In →
            </button>
          </div>
        )}

        {splitPdfs.length === 0 ? (
          <>
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isDragActive ? 'Drop PDF here' : 'Drop a PDF here to split'}</h3>
                <p className="text-gray-600 dark:text-slate-400">Extract every page as a separate PDF</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{file.name}</h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">{pageCount} pages found</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={splitPDF} 
                    disabled={splitting || (user && !canUse && !isPro) || usageLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
                  >
                    {splitting 
                      ? 'Splitting...' 
                      : !user 
                      ? 'Sign In to Split →'
                      : user && !canUse && !isPro
                      ? 'Upgrade to Continue →'
                      : 'Extract All Pages →'
                    }
                  </button>
                  <button onClick={reset} className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">PDF Split Successfully!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Created {splitPdfs.length} separate files</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={downloadAll} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
              >
                <Download className="w-5 h-5" />
                Download All Files
              </button>
              <button 
                onClick={reset} 
                className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Split Another
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your files are 100% private</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              All processing happens in your browser. Your files never leave your device and are never uploaded to any server.
            </p>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
