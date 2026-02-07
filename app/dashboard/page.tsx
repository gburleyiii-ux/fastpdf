'use client'

import { useUser } from '@/hooks/useUser'
import { useUsage } from '@/hooks/useUsage'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FileText, Merge, Scissors, Minimize2, Zap, Crown } from 'lucide-react'
import Link from 'next/link'
import DarkModeToggle from '@/components/DarkModeToggle'

export default function Dashboard() {
  const { user, profile, loading: userLoading, signOut } = useUser()
  const { todayCount, remainingUses, isPro } = useUsage('merge')
  const router = useRouter()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/')
    }
  }, [user, userLoading, router])

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 theme-transition">
        <div className="text-lg text-gray-600 dark:text-slate-300">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const handleManageSubscription = async () => {
    try {
      // Create portal session (we'll need to add this API route)
      const response = await fetch('/api/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating portal session:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 theme-transition">
      <nav className="bg-white dark:bg-slate-800 shadow-sm theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
            </Link>
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white theme-transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Account Info */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 theme-transition">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Account</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600 dark:text-slate-400">Email:</span>{' '}
                <span className="text-gray-900 dark:text-slate-200">{user.email}</span>
              </p>
              <p>
                <span className="text-gray-600 dark:text-slate-400">Plan:</span>{' '}
                <span className={`font-semibold ${isPro ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-slate-200'}`}>
                  {profile?.subscription_status === 'pro' ? 'Pro' : 'Free'}
                </span>
              </p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 theme-transition">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Today's Usage</h2>
            {isPro ? (
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">∞</div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">Unlimited usage</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-slate-400">PDF Operations</span>
                    <span className="font-semibold text-gray-900 dark:text-slate-200">{todayCount} / 2</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(todayCount / 2) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  {remainingUses} {remainingUses === 1 ? 'operation' : 'operations'} remaining today
                </p>
              </div>
            )}
          </div>

          {/* Subscription Management */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 theme-transition">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Subscription</h2>
            {isPro ? (
              <button
                onClick={handleManageSubscription}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 theme-transition"
              >
                Manage Subscription
              </button>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                  Upgrade to Pro for unlimited access to all tools
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Merge PDF - Always Available */}
            <button
              onClick={() => router.push('/merge')}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow text-left group theme-transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Merge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Zap className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Merge PDFs</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">Combine multiple PDF files into one</p>
            </button>
            
            {/* Split PDF - Upgrade for Free Users */}
            <button
              onClick={() => isPro ? router.push('/split') : router.push('/pricing')}
              className={`p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left group theme-transition ${
                isPro 
                  ? 'bg-white dark:bg-slate-800' 
                  : 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isPro 
                    ? 'bg-purple-100 dark:bg-purple-900/30' 
                    : 'bg-purple-200 dark:bg-purple-800/30'
                }`}>
                  <Scissors className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                {!isPro && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-200 dark:bg-purple-800/50 px-2 py-1 rounded-full">
                    <Crown className="w-3 h-3" /> Pro
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Split PDF</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {isPro ? 'Extract pages from your PDFs' : 'Upgrade to access this feature'}
              </p>
              {!isPro && (
                <span className="inline-block mt-3 text-sm font-bold text-purple-700 dark:text-purple-300">
                  Upgrade →
                </span>
              )}
            </button>
            
            {/* Compress PDF - Upgrade for Free Users */}
            <button
              onClick={() => isPro ? router.push('/compress') : router.push('/pricing')}
              className={`p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left group theme-transition ${
                isPro 
                  ? 'bg-white dark:bg-slate-800' 
                  : 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isPro 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-green-200 dark:bg-green-800/30'
                }`}>
                  <Minimize2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                {!isPro && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-300 bg-green-200 dark:bg-green-800/50 px-2 py-1 rounded-full">
                    <Crown className="w-3 h-3" /> Pro
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Compress PDF</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {isPro ? 'Reduce your PDF file size' : 'Upgrade to access this feature'}
              </p>
              {!isPro && (
                <span className="inline-block mt-3 text-sm font-bold text-green-700 dark:text-green-300">
                  Upgrade →
                </span>
              )}
            </button>
          </div>
        </div>

        {/* More Tools */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">More Tools</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/jpg-to-pdf"
              className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4 theme-transition"
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">JPG to PDF</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Convert images to PDF</p>
              </div>
            </Link>
            
            <Link
              href="/pdf-to-jpg"
              className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4 theme-transition"
            >
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">PDF to JPG</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Convert PDF pages to images</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
