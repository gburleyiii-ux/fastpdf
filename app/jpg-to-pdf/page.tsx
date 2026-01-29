"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Image as ImageIcon, Zap } from "lucide-react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";

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
    // @ts-ignore
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-black text-gray-900">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="font-medium">Dashboard</Link>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold">Sign In</button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">JPG to PDF</h1>
          <p className="text-xl text-gray-600">Convert your images into a PDF document.</p>
        </div>

        {!convertedPdf ? (
          <>
            <div {...getRootProps()} className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-2xl p-16 text-center cursor-pointer hover:bg-orange-100 transition-colors">
              <input {...getInputProps()} />
              <ImageIcon className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Drop JPG/PNG images here</h3>
            </div>
            
            {files.length > 0 && (
              <div className="mt-8">
                <p className="mb-4 font-bold">{files.length} images selected</p>
                <button onClick={convert} disabled={converting} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-700">
                  {converting ? 'Converting...' : 'Convert to PDF'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-white p-12 rounded-2xl border">
            <h2 className="text-3xl font-bold mb-6">Conversion Complete!</h2>
            <button onClick={download} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold">Download PDF</button>
            <button onClick={() => { setFiles([]); setConvertedPdf(null); }} className="block mx-auto mt-4 text-gray-500">Convert Another</button>
          </div>
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
