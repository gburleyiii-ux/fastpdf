"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Image as ImageIcon, Zap, Lock, Download, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [convertedPdf, setConvertedPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('jpg_to_pdf');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles.filter(f => f.type === 'image/jpeg' || f.type === 'image/png')]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convert = async () => {
    if (files.length === 0) return;
    if (!user) { setShowAuthModal(true); return; }
    if (!canUse && !isPro) { alert('Upgrade to Pro for unlimited usage.'); return; }

    setConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          image = await pdfDoc.embedPng(imageBytes);
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await pdfDoc.save();
      setConvertedPdf(pdfBytes);
      await logUsage();
    } catch (error) {
      console.error('Convert error:', error);
      alert('Failed to convert. Ensure files are valid JPGs/PNGs.');
    } finally {
      setConverting(false);
    }
  };

  const download = () => {
    if (!convertedPdf) return;
    const blob = new Blob([convertedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFiles([]);
    setConvertedPdf(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
                <button onClick={signOut} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <ImageIcon className="w-4 h-4" />
            Image Converter
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">JPG to PDF</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">Convert your images into a PDF document. Fast, easy, and secure.</p>
        </div>

        {/* Usage Counter */}
        {user && !isPro && !usageLoading && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="font-bold text-gray-900 dark:text-white">{remainingUses} free uses remaining today</span>
            </div>
            <Link href="/pricing" className="text-orange-600 dark:text-orange-400 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}

        {user && isPro && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span className="font-bold">Pro Plan • Unlimited Conversions</span>
            </div>
          </div>
        )}

        {!convertedPdf ? (
          <>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : 'border-gray-300 dark:border-slate-600 hover:border-orange-400 dark:hover:border-orange-500'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isDragActive ? 'Drop images here' : 'Drop JPG/PNG images here'}</h3>
              <p className="text-gray-600 dark:text-slate-400">Click to browse or drag and drop</p>
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Images ({files.length})</h3>
                  <button onClick={() => setFiles([])} className="text-sm text-red-600 hover:underline">Clear all</button>
                </div>
                {files.map((file, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{file.name}</div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {files.length > 0 && (
              <button 
                onClick={convert} 
                disabled={converting || (user && !canUse && !isPro) || usageLoading}
                className="w-full mt-8 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200 dark:shadow-orange-900/30"
              >
                {converting 
                  ? 'Converting...' 
                  : !user 
                  ? 'Sign In to Convert →'
                  : user && !canUse && !isPro
                  ? 'Upgrade to Continue →'
                  : `Convert ${files.length} Image${files.length !== 1 ? 's' : ''} to PDF →`
                }
              </button>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Conversion Complete!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Your images have been converted to PDF</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={download} className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button onClick={reset} className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                Convert Another
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
