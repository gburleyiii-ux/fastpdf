"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, X, Image, Zap, Lock, CheckSquare, Square, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";

// Set up PDF.js worker - use local worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

interface PagePreview {
  pageNumber: number;
  dataUrl: string;
  selected: boolean;
}

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [jpgImages, setJpgImages] = useState<{ pageNumber: number; dataUrl: string; blob: Blob }[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scale, setScale] = useState(2); // Higher scale for better quality
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('pdf_to_jpg');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile);
      setConverted(false);
      setJpgImages([]);
      await loadPdfPreviews(pdfFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  });

  const loadPdfPreviews = async (pdfFile: File) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      const previews: PagePreview[] = [];
      
      // Load first 6 pages as previews (to avoid performance issues with large PDFs)
      const pagesToPreview = Math.min(numPages, 6);
      
      for (let i = 1; i <= pagesToPreview; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Small scale for preview
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport }).promise;
        
        previews.push({
          pageNumber: i,
          dataUrl: canvas.toDataURL('image/jpeg', 0.7),
          selected: true
        });
      }

      // Add remaining pages as unpreviewed but selectable
      for (let i = pagesToPreview + 1; i <= numPages; i++) {
        previews.push({
          pageNumber: i,
          dataUrl: '',
          selected: true
        });
      }

      setPagePreviews(previews);
    } catch (error) {
      console.error('Error loading PDF previews:', error);
      alert('Failed to load PDF. Please try again.');
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    setPagePreviews(prev => 
      prev.map(p => 
        p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const toggleAllPages = () => {
    const allSelected = pagePreviews.every(p => p.selected);
    setPagePreviews(prev => 
      prev.map(p => ({ ...p, selected: !allSelected }))
    );
  };

  const getSelectedPages = () => {
    return pagePreviews.filter(p => p.selected).map(p => p.pageNumber);
  };

  const convertToJpg = async () => {
    const selectedPages = getSelectedPages();
    if (selectedPages.length === 0) {
      alert('Please select at least one page to convert');
      return;
    }

    // Require login
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check usage limit
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited conversions.');
      return;
    }

    setConverting(true);

    try {
      if (!file) return;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const images: { pageNumber: number; dataUrl: string; blob: Blob }[] = [];

      for (const pageNum of selectedPages) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Fill white background (in case of transparent PDF)
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        await page.render({ canvasContext: context, viewport }).promise;
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        // Convert dataUrl to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        images.push({
          pageNumber: pageNum,
          dataUrl,
          blob
        });
      }

      setJpgImages(images);
      setConverted(true);
      
      // Log usage
      await logUsage();
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert PDF. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const downloadImage = (pageNumber: number) => {
    const image = jpgImages.find(img => img.pageNumber === pageNumber);
    if (!image) return;
    
    const url = URL.createObjectURL(image.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_page_${pageNumber}.jpg` : `page_${pageNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    if (jpgImages.length === 0) return;
    
    const zip = new JSZip();
    const baseName = file ? file.name.replace('.pdf', '') : 'pdf_pages';
    
    jpgImages.forEach(img => {
      zip.file(`${baseName}_page_${img.pageNumber}.jpg`, img.blob);
    });
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_images.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setTotalPages(0);
    setPagePreviews([]);
    setConverted(false);
    setJpgImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-pink-600" />
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
                    className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
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
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">PDF to JPG</h1>
          <p className="text-xl text-gray-600">
            Convert PDF pages to high-quality JPG images. Free, fast, and secure.
          </p>
        </div>

        {/* Usage Counter */}
        {user && !isPro && !usageLoading && (
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-pink-600" />
              <span className="font-bold text-gray-900">
                {remainingUses} free {remainingUses === 1 ? 'conversion' : 'conversions'} remaining today
              </span>
            </div>
            <Link href="/pricing" className="text-pink-600 font-bold hover:underline text-sm">
              Get Unlimited →
            </Link>
          </div>
        )}
        
        {user && isPro && (
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span className="font-bold">
                Pro Plan • Unlimited Conversions
              </span>
            </div>
          </div>
        )}
        
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600" />
              <span className="font-bold text-gray-900">
                Sign in to convert PDFs
              </span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-pink-600 font-bold hover:underline text-sm"
            >
              Sign In →
            </button>
          </div>
        )}

        {!converted ? (
          <>
            {/* File Uploader */}
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
                }`}
              >
                <input {...getInputProps()} />
                <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isDragActive ? 'Drop PDF here' : 'Click or drag PDF here'}
                </h3>
                <p className="text-gray-600">Select pages to convert to JPG</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="bg-white border rounded-xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="w-12 h-12 text-pink-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">{file.name}</h3>
                      <p className="text-gray-600">{totalPages} pages total</p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Page Selection */}
                <div className="bg-white border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Select Pages to Convert</h3>
                    <button
                      onClick={toggleAllPages}
                      className="text-pink-600 font-bold text-sm hover:underline"
                    >
                      {pagePreviews.every(p => p.selected) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {pagePreviews.map((page) => (
                      <div
                        key={page.pageNumber}
                        onClick={() => togglePageSelection(page.pageNumber)}
                        className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          page.selected ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 opacity-60'
                        }`}
                      >
                        {page.dataUrl ? (
                          <img
                            src={page.dataUrl}
                            alt={`Page ${page.pageNumber}`}
                            className="w-full aspect-[3/4] object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 font-bold">{page.pageNumber}</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          {page.selected ? (
                            <CheckSquare className="w-5 h-5 text-pink-600 bg-white rounded" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 bg-white rounded" />
                          )}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-1">
                          <span className="text-xs font-bold">{page.pageNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {pagePreviews.length > 6 && totalPages > 6 && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Showing first 6 page previews. {totalPages - 6} more pages available for selection.
                    </p>
                  )}
                </div>

                {/* Quality Setting */}
                <div className="bg-white border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-900">Image Quality</label>
                    <select
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="border rounded-lg px-4 py-2"
                    >
                      <option value={1}>Standard (1x)</option>
                      <option value={2}>High (2x)</option>
                      <option value={3}>Ultra (3x)</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Higher quality produces larger files with sharper images.
                  </p>
                </div>

                {/* Convert Button */}
                <button
                  onClick={convertToJpg}
                  disabled={converting || getSelectedPages().length === 0 || (user && !canUse && !isPro) || usageLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {converting 
                    ? 'Converting...' 
                    : !user 
                    ? 'Sign In to Convert →'
                    : user && !canUse && !isPro
                    ? 'Upgrade to Continue →'
                    : `Convert ${getSelectedPages().length} Page${getSelectedPages().length !== 1 ? 's' : ''} to JPG →`
                  }
                </button>
              </div>
            )}
          </>
        ) : (
          /* Success State */
          <div className="bg-white border rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-pink-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Conversion Complete!</h2>
              <p className="text-gray-600">{jpgImages.length} page{jpgImages.length !== 1 ? 's' : ''} converted successfully</p>
            </div>

            {/* Image Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {jpgImages.map((img) => (
                <div key={img.pageNumber} className="border rounded-lg overflow-hidden">
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.pageNumber}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">Page {img.pageNumber}</span>
                    </div>
                    <button
                      onClick={() => downloadImage(img.pageNumber)}
                      className="w-full bg-pink-100 text-pink-700 py-2 rounded-lg font-bold text-sm hover:bg-pink-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadAllAsZip}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download All as ZIP
              </button>
              <button
                onClick={reset}
                className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Convert Another
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
