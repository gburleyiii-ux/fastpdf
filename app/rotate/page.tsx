"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, X, Zap, Lock, CheckCircle2, RotateCw } from "lucide-react";
import Link from "next/link";
import { PDFDocument, degrees } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

type Rotation = 0 | 90 | 180 | 270;

interface PageRotation {
  pageNumber: number;
  rotation: Rotation;
}

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRotations, setPageRotations] = useState<PageRotation[]>([]);
  const [rotating, setRotating] = useState(false);
  const [rotatedPdf, setRotatedPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('rotate');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (!pdfFile || pdfFile.type !== 'application/pdf') return;
    setFile(pdfFile);
    setRotatedPdf(null);
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const count = pdf.getPageCount();
    setPageCount(count);
    setPageRotations(Array.from({ length: count }, (_, i) => ({ pageNumber: i + 1, rotation: 0 })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const rotatePage = (pageNumber: number, delta: 90 | -90) => {
    setPageRotations(prev =>
      prev.map(p => {
        if (p.pageNumber !== pageNumber) return p;
        const newRot = ((p.rotation + delta + 360) % 360) as Rotation;
        return { ...p, rotation: newRot };
      })
    );
  };

  const rotateAll = (delta: 90 | -90) => {
    setPageRotations(prev =>
      prev.map(p => ({ ...p, rotation: ((p.rotation + delta + 360) % 360) as Rotation }))
    );
  };

  const applyRotations = async () => {
    if (!file) return;
    if (!user) { setShowAuthModal(true); return; }
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited use.');
      return;
    }

    setRotating(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      pageRotations.forEach(({ pageNumber, rotation }) => {
        if (rotation === 0) return;
        const page = pdf.getPage(pageNumber - 1);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotation) % 360));
      });
      const pdfBytes = await pdf.save();
      setRotatedPdf(pdfBytes);
      await logUsage();
    } catch (error) {
      console.error('Rotate error:', error);
      alert('Failed to rotate PDF. Please try again.');
    } finally {
      setRotating(false);
    }
  };

  const download = () => {
    if (!rotatedPdf) return;
    const blob = new Blob([rotatedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_rotated.pdf` : 'rotated.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setPageRotations([]);
    setRotatedPdf(null);
  };

  const hasRotations = pageRotations.some(p => p.rotation !== 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
                {!isPro && (
                  <Link href="/pricing" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                    Upgrade to Pro
                  </Link>
                )}
                <button onClick={signOut} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <RotateCw className="w-4 h-4" />
            Page Rotation
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Rotate PDF</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">Rotate individual pages or the entire document. Free, fast, and secure.</p>
        </div>

        {/* Banners */}
        {user && !isPro && !usageLoading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">{remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} remaining today</span>
            </div>
            <Link href="/pricing" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}
        {user && isPro && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6" /><span className="font-bold">Pro Plan • Unlimited Rotations</span>
          </div>
        )}
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">Sign in to rotate PDFs</span>
            </div>
            <button onClick={() => setShowAuthModal(true)} className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline text-sm">Sign In →</button>
          </div>
        )}

        {!rotatedPdf ? (
          <>
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-300 dark:border-slate-600 hover:border-yellow-400 dark:hover:border-yellow-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <RotateCw className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isDragActive ? 'Drop PDF here' : 'Click or drag PDF here'}</h3>
                <p className="text-gray-600 dark:text-slate-400">Select pages to rotate</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File info + bulk controls */}
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 flex items-center justify-between theme-transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{file.name}</h3>
                      <p className="text-gray-600 dark:text-slate-400">{pageCount} pages</p>
                    </div>
                  </div>
                  <button onClick={reset} className="text-gray-400 hover:text-red-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>

                {/* Bulk rotate */}
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 flex items-center justify-between theme-transition">
                  <span className="font-semibold text-gray-900 dark:text-white">Rotate all pages</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => rotateAll(-90)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg font-bold hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-colors"
                    >
                      <RotateCw className="w-4 h-4 scale-x-[-1]" /> −90°
                    </button>
                    <button
                      onClick={() => rotateAll(90)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg font-bold hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-colors"
                    >
                      <RotateCw className="w-4 h-4" /> +90°
                    </button>
                  </div>
                </div>

                {/* Per-page controls */}
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 theme-transition">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Per-page rotation</h3>
                  <div className="space-y-3">
                    {pageRotations.map(({ pageNumber, rotation }) => (
                      <div key={pageNumber} className="flex items-center justify-between py-2 border-b dark:border-slate-700 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-500 dark:text-slate-400 w-16">Page {pageNumber}</span>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded ${rotation !== 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                            {rotation === 0 ? 'No change' : `+${rotation}°`}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => rotatePage(pageNumber, -90)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-gray-600 dark:text-slate-300 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
                            title="Rotate left"
                          >
                            <RotateCw className="w-4 h-4 scale-x-[-1]" />
                          </button>
                          <button
                            onClick={() => rotatePage(pageNumber, 90)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-gray-600 dark:text-slate-300 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
                            title="Rotate right"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={applyRotations}
                  disabled={rotating || !hasRotations || (!!user && !canUse && !isPro) || usageLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-200 dark:shadow-yellow-900/30"
                >
                  {rotating
                    ? 'Applying rotations...'
                    : !user
                    ? 'Sign In to Rotate →'
                    : !hasRotations
                    ? 'Select rotations above →'
                    : user && !canUse && !isPro
                    ? 'Upgrade to Continue →'
                    : 'Apply Rotations & Download →'
                  }
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center theme-transition">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">PDF Rotated Successfully!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Your rotations have been applied</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={download}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/30"
              >
                <Download className="w-5 h-5" />
                Download Rotated PDF
              </button>
              <button onClick={reset} className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                Rotate Another
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4 theme-transition">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your files are 100% private</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              All processing happens in your browser. Your files never leave your device and are never uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
