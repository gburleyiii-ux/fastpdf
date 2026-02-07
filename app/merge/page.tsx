"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, X, GripVertical, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('merge');
  const FREE_LIMIT = 2;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles.filter(f => f.type === 'application/pdf')]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert('Please add at least 2 PDF files');
      return;
    }

    // Require login
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check usage limit
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited merges.');
      return;
    }

    setMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      setMergedPdf(pdfBytes);
      
      // Log usage
      await logUsage();
    } catch (error) {
      console.error('Merge error:', error);
      alert('Failed to merge PDFs. Please try again.');
    } finally {
      setMerging(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedPdf) return;
    
    // @ts-ignore - Uint8Array is compatible with BlobPart
    const blob = new Blob([mergedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFiles([]);
    setMergedPdf(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium theme-transition"
                >
                  Dashboard
                </Link>
                {!isPro && (
                  <Link
                    href="/pricing"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    Upgrade to Pro
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm theme-transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            Most Popular Tool
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 theme-transition">Merge PDF Files</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            Combine multiple PDFs into one document. Free, fast, and secure.
          </p>
        </div>

        {/* Usage Counter */}
        {user && !isPro && !usageLoading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-gray-900 dark:text-white">
                {remainingUses} free {remainingUses === 1 ? 'merge' : 'merges'} remaining today
              </span>
            </div>
            <Link href="/pricing" className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm">
              Get Unlimited →
            </Link>
          </div>
        )}
        
        {user && isPro && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span className="font-bold">
                Pro Plan • Unlimited Merges
              </span>
            </div>
          </div>
        )}
        
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">
                Sign in to start merging PDFs
              </span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm"
            >
              Sign In →
            </button>
          </div>
        )}

        {!mergedPdf ? (
          <>
            {/* File Uploader */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {isDragActive ? 'Drop PDFs here' : 'Click or drag PDFs here'}
              </h3>
              <p className="text-gray-600 dark:text-slate-400">Add as many files as you need</p>
              <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">Supports PDF files up to 50MB</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Files ({files.length})</h3>
                  <button
                    onClick={() => setFiles([])}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 theme-transition"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{file.name}</div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Merge Button */}
            {files.length >= 2 && (
              <button
                onClick={mergePDFs}
                disabled={merging || (user && !canUse && !isPro) || usageLoading}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
              >
                {merging 
                  ? 'Merging...' 
                  : !user 
                  ? 'Sign In to Merge →'
                  : user && !canUse && !isPro
                  ? 'Upgrade to Continue →'
                  : `Merge ${files.length} PDFs →`
                }
              </button>
            )}
          </>
        ) : (
          /* Success State */
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center theme-transition">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">PDF Merged Successfully!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">
              Your {files.length} files have been combined into one PDF
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadMerged}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
              >
                <Download className="w-5 h-5" />
                Download Merged PDF
              </button>
              <button
                onClick={reset}
                className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Merge Another
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4 theme-transition">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your files are 100% private</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              All processing happens in your browser. Your files never leave your device and are never uploaded to any server. We have zero access to your documents.
            </p>
          </div>
        </div>

        {/* Other Tools */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">Try Our Other Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/split" className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 text-center hover:shadow-md transition-shadow theme-transition">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">✂️</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Split PDF</span>
            </Link>
            <Link href="/compress" className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 text-center hover:shadow-md transition-shadow theme-transition">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🗜️</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Compress</span>
            </Link>
            <Link href="/jpg-to-pdf" className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 text-center hover:shadow-md transition-shadow theme-transition">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🖼️</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">JPG to PDF</span>
            </Link>
            <Link href="/pdf-to-jpg" className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 text-center hover:shadow-md transition-shadow theme-transition">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">📄</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">PDF to JPG</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
