'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from './useUser'

const FREE_DAILY_LIMIT = 2

export function useUsage(action: string) {
  const { user, isPro } = useUser()
  const [todayCount, setTodayCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [canUse, setCanUse] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setCanUse(false)
      return
    }

    if (isPro) {
      setCanUse(true)
      setLoading(false)
      return
    }

    // Check usage for free users
    loadTodayUsage()
  }, [user, isPro])

  const loadTodayUsage = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.rpc('get_today_usage_count', {
        user_uuid: user.id,
        action_type: action,
      })

      if (error) throw error

      setTodayCount(data || 0)
      setCanUse((data || 0) < FREE_DAILY_LIMIT)
    } catch (error) {
      console.error('Error loading usage:', error)
      setCanUse(false)
    } finally {
      setLoading(false)
    }
  }

  const logUsage = async () => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('usage_logs')
        .insert([{ user_id: user.id, action }])

      if (error) throw error

      setTodayCount((prev) => prev + 1)
      setCanUse(todayCount + 1 < FREE_DAILY_LIMIT)
      
      return true
    } catch (error) {
      console.error('Error logging usage:', error)
      return false
    }
  }

  return {
    todayCount,
    canUse,
    loading,
    logUsage,
    isPro,
    remainingUses: isPro ? Infinity : Math.max(0, FREE_DAILY_LIMIT - todayCount),
  }
}
