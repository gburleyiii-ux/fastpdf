'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        // Use production URL for email redirect to ensure auth works correctly
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${appUrl}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setMessage('Signed in successfully!')
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 1000)
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 theme-transition">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white theme-transition">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 text-2xl theme-transition"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300 theme-transition">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white theme-transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300 theme-transition">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white theme-transition"
              required
              minLength={6}
            />
          </div>

          {message && (
            <div className={`text-sm p-3 rounded ${
              message.includes('success') || message.includes('email')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {mode === 'signin' ? (
            <p className="text-gray-600 dark:text-slate-400 theme-transition">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-gray-600 dark:text-slate-400 theme-transition">
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
