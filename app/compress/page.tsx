"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, X, Minimize2, Zap, Lock, ArrowDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressing, setCompressing] = useState(false);
  const [compressedPdf, setCompressedPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('compress');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const calculateSavings = (): { amount: string; percent: number } => {
    if (!originalSize || !compressedSize) return { amount: '0 KB', percent: 0 };
    const saved = originalSize - compressedSize;
    const percent = Math.round((saved / originalSize) * 100);
    return { amount: formatFileSize(saved), percent };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile);
      setOriginalSize(pdfFile.size);
      setCompressedPdf(null);
      setCompressedSize(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  });

  const compressPDF = async () => {
    if (!file) return;

    // Require login
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check usage limit
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited compressions.');
      return;
    }

    setCompressing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      
      // Create a new PDF document
      const newPdf = await PDFDocument.create();
      
      // Copy all pages from source to new document
      const pageCount = sourcePdf.getPageCount();
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));

      // Save with optimization options
      // pdf-lib's save() method with options can help reduce file size
      const pdfBytes = await newPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      setCompressedPdf(pdfBytes);
      setCompressedSize(pdfBytes.length);
      
      // Log usage
      await logUsage();
    } catch (error) {
      console.error('Compression error:', error);
      alert('Failed to compress PDF. Please try again.');
    } finally {
      setCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedPdf) return;
    
    // @ts-ignore - Uint8Array is compatible with BlobPart
    const blob = new Blob([compressedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_compressed.pdf` : 'compressed.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedPdf(null);
  };

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-black text-gray-900">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                {!isPro && (
                  <Link
                    href="/pricing"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    Upgrade to Pro
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
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
          <h1 className="text-5xl font-black text-gray-900 mb-4">Compress PDF</h1>
          <p className="text-xl text-gray-600">
            Reduce your PDF file size without losing quality. Free, fast, and secure.
          </p>
        </div>

        {/* Usage Counter */}
        {user && !isPro && !usageLoading && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-green-600" />
              <span className="font-bold text-gray-900">
                {remainingUses} free {remainingUses === 1 ? 'compression' : 'compressions'} remaining today
              </span>
            </div>
            <Link href="/pricing" className="text-green-600 font-bold hover:underline text-sm">
              Get Unlimited →
            </Link>
          </div>
        )}
        
        {user && isPro && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span className="font-bold">
                Pro Plan • Unlimited Compressions
              </span>
            </div>
          </div>
        )}
        
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600" />
              <span className="font-bold text-gray-900">
                Sign in to compress PDFs
              </span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-green-600 font-bold hover:underline text-sm"
            >
              Sign In →
            </button>
          </div>
        )}

        {!compressedPdf ? (
          <>
            {/* File Uploader */}
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <input {...getInputProps()} />
                <Minimize2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isDragActive ? 'Drop PDF here' : 'Click or drag PDF here'}
                </h3>
                <p className="text-gray-600">We'll compress it instantly</p>
              </div>
            ) : (
              <div className="bg-white border rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FileText className="w-16 h-16 text-green-600" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{file.name}</h3>
                    <p className="text-gray-600">Original size: {formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={reset}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <button
                  onClick={compressPDF}
                  disabled={compressing || (user && !canUse && !isPro) || usageLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {compressing 
                    ? 'Compressing...' 
                    : !user 
                    ? 'Sign In to Compress →'
                    : user && !canUse && !isPro
                    ? 'Upgrade to Continue →'
                    : 'Compress PDF →'
                  }
                </button>
              </div>
            )}
          </>
        ) : (
          /* Success State */
          <div className="bg-white border rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">PDF Compressed Successfully!</h2>
            
            {/* Size Comparison */}
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Original</div>
                  <div className="text-2xl font-bold text-gray-900">{formatFileSize(originalSize)}</div>
                </div>
                <ArrowDown className="w-6 h-6 text-green-600" />
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Compressed</div>
                  <div className="text-2xl font-bold text-green-600">{formatFileSize(compressedSize)}</div>
                </div>
              </div>
              <div className="text-center">
                <span className="inline-block bg-green-200 text-green-800 px-4 py-2 rounded-full font-bold">
                  Saved {savings.amount} ({savings.percent}%)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadCompressed}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Compressed PDF
              </button>
              <button
                onClick={reset}
                className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Compress Another
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-start gap-4">
          <Lock className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Your files are 100% private</h4>
            <p className="text-sm text-gray-600">
              All processing happens in your browser. Your files never leave your device and are never uploaded to any server. We have zero access to your documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
