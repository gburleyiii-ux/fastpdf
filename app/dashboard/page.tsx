'use client'

import { useUser } from '@/hooks/useUser'
import { useUsage } from '@/hooks/useUsage'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">FastPDF Dashboard</h1>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Account Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Account</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Email:</span> {user.email}</p>
              <p>
                <span className="text-gray-600">Plan:</span>{' '}
                <span className={`font-semibold ${isPro ? 'text-blue-600' : 'text-gray-900'}`}>
                  {profile?.subscription_status === 'pro' ? 'Pro' : 'Free'}
                </span>
              </p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Usage</h2>
            {isPro ? (
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-blue-600">∞</div>
                <p className="text-sm text-gray-600 mt-2">Unlimited usage</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>PDF Merges</span>
                    <span className="font-semibold">{todayCount} / 2</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(todayCount / 2) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {remainingUses} {remainingUses === 1 ? 'merge' : 'merges'} remaining today
                </p>
              </div>
            )}
          </div>

          {/* Subscription Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Subscription</h2>
            {isPro ? (
              <button
                onClick={handleManageSubscription}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Manage Subscription
              </button>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Upgrade to Pro for unlimited access
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => router.push('/merge')}
              className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <h3 className="font-semibold mb-2">Merge PDFs</h3>
              <p className="text-sm text-gray-600">Combine multiple PDF files into one</p>
            </button>
            
            <div className="p-6 bg-gray-100 rounded-lg text-left opacity-50">
              <h3 className="font-semibold mb-2">Split PDF</h3>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
            
            <div className="p-6 bg-gray-100 rounded-lg text-left opacity-50">
              <h3 className="font-semibold mb-2">Compress PDF</h3>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
