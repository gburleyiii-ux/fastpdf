"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, X, Scissors, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitting, setSplitting] = useState(false);
  const [splitPdfs, setSplitPdfs] = useState<{ name: string; data: Uint8Array }[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('split');
  const FREE_LIMIT = 2; // Share limit with merge for simplicity

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setFile(file);
      // Load to count pages
      const arrayBuffer = await file.arrayBuffer();
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

    // Require login
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check usage limit
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited usage.');
      return;
    }

    setSplitting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdfs = [];

      // Simple split: Extract every page as a separate PDF
      // (For MVP simplicity. V2 could allow range selection)
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
      
      // Log usage
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
      // @ts-ignore
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-black text-gray-900">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
                <button onClick={signOut} className="text-gray-600 hover:text-gray-900 text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">Split PDF Files</h1>
          <p className="text-xl text-gray-600">Extract pages from your PDF documents.</p>
        </div>

        {/* Usage Counter */}
        {user && !isPro && !usageLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">{remainingUses} free uses remaining today</span>
            </div>
            <Link href="/pricing" className="text-blue-600 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}

        {splitPdfs.length === 0 ? (
          <>
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                <Scissors className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drop a PDF here to split</h3>
              </div>
            ) : (
              <div className="bg-white border rounded-xl p-8 text-center">
                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{file.name}</h3>
                <p className="text-gray-600 mb-6">{pageCount} pages found</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={splitPDF} disabled={splitting} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700">
                    {splitting ? 'Splitting...' : 'Extract All Pages'}
                  </button>
                  <button onClick={reset} className="text-gray-500 hover:text-gray-700">Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-4">PDF Split Successfully!</h2>
            <p className="text-gray-600 mb-8">Created {splitPdfs.length} separate files</p>
            <div className="flex gap-4 justify-center">
              <button onClick={downloadAll} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700">
                Download All Files
              </button>
              <button onClick={reset} className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold">
                Split Another
              </button>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
