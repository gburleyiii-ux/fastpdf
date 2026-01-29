import Link from "next/link";
import { FileText, Wrench } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-xl p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <Link href="/" className="text-2xl font-black text-gray-900">FastPDF</Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-xl text-gray-600 mb-8">
            We're putting the finishing touches on this tool. It will be available in the next update!
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
