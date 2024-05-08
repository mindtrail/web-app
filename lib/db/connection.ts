import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

declare global {
  var prisma: PrismaClient | undefined
  var supabase: ReturnType<typeof createClient> | undefined
}

const prisma = global.prisma || new PrismaClient()
const supabase = global.supabase || createClient(supabaseUrl, supabaseKey)

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
  global.supabase = supabase
}

export { prisma, supabase }
