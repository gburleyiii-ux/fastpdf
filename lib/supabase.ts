import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Client-side supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// Server-side client with service role - lazy initialization
let _supabaseAdmin: SupabaseClient | null = null

export const getSupabaseAdmin = (): SupabaseClient => {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseAdmin should only be called on the server')
  }
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations')
  }
  
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(supabaseUrl || '', serviceRoleKey)
  }
  
  return _supabaseAdmin
}

// Export for backwards compatibility - will throw at runtime if used without env vars
export const supabaseAdmin = (() => {
  // Return a proxy-like object that lazily delegates to getSupabaseAdmin()
  const handler: ProxyHandler<SupabaseClient> = {
    get(_target, prop) {
      const admin = getSupabaseAdmin()
      return admin[prop as keyof SupabaseClient]
    }
  }
  return new Proxy({} as SupabaseClient, handler)
})()
