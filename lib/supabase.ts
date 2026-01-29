import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Log for debugging (will show in browser console)
if (typeof window !== 'undefined') {
  console.log('Supabase URL loaded:', supabaseUrl ? 'Yes' : 'No')
  console.log('Supabase Key loaded:', supabaseAnonKey ? 'Yes' : 'No')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey })
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// Server-side client with service role
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
export const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null as any
