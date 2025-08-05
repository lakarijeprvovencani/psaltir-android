import { createClient } from '@supabase/supabase-js'

// Environment variables with fallback for Expo
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

// Debug logging for Expo - safe check for development mode
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.log('Supabase configuration loaded:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
}

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Better for mobile
    autoRefreshToken: false, // Prevent auto refresh in production
  },
  global: {
    headers: {
      'X-Client-Info': 'expo-mobile',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 2, // Limit realtime events
    },
  },
}) : null

// Validate Supabase configuration on startup
if (!supabase) {
  console.warn('Supabase client not initialized. Check environment variables.');
}

// Test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase client not available for connection test');
    return false;
  }

  try {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('kathismas')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('Supabase connection test successful');
    return true;
  } catch (networkError) {
    console.error('Supabase network error during connection test:', networkError);
    return false;
  }
}

// Types for our data
export interface Kathisma {
  id: number
  title: string
  psalms_range: string
  description: string
  psalm_numbers: number[]
  created_at?: string
}

export interface Psalm {
  id: number
  title: string
  subtitle: string
  content: string[]
  kathisma_id: number
  note?: string
  created_at?: string
}

// Database functions with enhanced error handling
export async function getKathismas(): Promise<Kathisma[]> {
  if (!supabase) {
    console.warn('Supabase client not available for getKathismas');
    return []
  }

  try {
    const { data, error } = await supabase
      .from('kathismas')
      .select('*')
      .order('id')

    if (error) {
      console.error('Supabase error in getKathismas:', error);
      return []
    }

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`Loaded ${data?.length || 0} kathismas from Supabase`);
    }
    return data || []
  } catch (networkError) {
    console.error('Network error in getKathismas:', networkError);
    return []
  }
}

export async function getPsalmsByKathisma(kathismaId: number): Promise<Psalm[]> {
  if (!supabase) {
    console.warn('Supabase client not available for getPsalmsByKathisma');
    return []
  }

  try {
    const { data, error } = await supabase
      .from('psalms')
      .select('*')
      .eq('kathisma_id', kathismaId)
      .order('id')

    if (error) {
      console.error('Supabase error in getPsalmsByKathisma:', error);
      return []
    }

    return data || []
  } catch (networkError) {
    console.error('Network error in getPsalmsByKathisma:', networkError);
    return []
  }
}

export async function getPsalmById(psalmId: number): Promise<Psalm | null> {
  if (!supabase) {
    console.warn('Supabase client not available for getPsalmById');
    return null
  }

  try {
    const { data, error } = await supabase
      .from('psalms')
      .select('*')
      .eq('id', psalmId)
      .single()

    if (error) {
      console.error('Supabase error in getPsalmById:', error);
      return null
    }

    return data
  } catch (networkError) {
    console.error('Network error in getPsalmById:', networkError);
    return null
  }
}

export async function getAllPsalms(): Promise<Psalm[]> {
  if (!supabase) {
    return []
  }
  
  const { data, error } = await supabase
    .from('psalms')
    .select('*')
    .order('id')
  
  if (error) {
    return []
  }
  
  return data || []
}

export async function searchPsalms(query: string): Promise<Psalm[]> {
  if (!supabase) {
    return []
  }
  
  const { data, error } = await supabase
    .from('psalms')
    .select('*')
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,id.eq.${parseInt(query) || 0}`)
    .order('id')
  
  if (error) {
    return []
  }
  
  return data || []
}

// Background music functions
export interface BackgroundMusic {
  id: string
  title: string
  file_url: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getAllBackgroundMusic(): Promise<BackgroundMusic[]> {
  if (!supabase) {
    return []
  }
  
  const { data, error } = await supabase
    .from('background_music')
    .select('*')
    .order('title')
  
  if (error) {
    return []
  }
  
  return data || []
}

export async function getActiveBackgroundMusic(): Promise<BackgroundMusic | null> {
  if (!supabase) {
    return null
  }
  
  const { data, error } = await supabase
    .from('background_music')
    .select('*')
    .eq('is_active', true)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

// Donations functions
export interface Donation {
  id: string
  amount: number
  currency: 'RSD' | 'EUR'
  created_at?: string
}

export async function submitDonation(amount: number, currency: 'RSD' | 'EUR'): Promise<boolean> {
  // Attempting to submit donation
  
  if (!supabase) {
    return false
  }
  
  // Validate inputs
  if (!amount || amount <= 0) {
    return false
  }
  
  if (!['RSD', 'EUR'].includes(currency)) {
    return false
  }
  
  try {
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('donations')
      .select('count')
      .limit(1)
    
    if (testError) {
      return false
    }
    
    // Connection test passed
    
    // Submit donation
  const { error } = await supabase
    .from('donations')
    .insert({
      amount,
      currency
    })
  
  if (error) {
    return false
  }
  
    // Donation submitted successfully
  return true
  } catch (networkError) {
    return false
  }
}

// Akatist functions
export interface Akatist {
  id: number
  title: string
  subtitle: string
  content: string[]
  category: string
  feast_day?: string
  note?: string
  created_at?: string
}

export async function getAkatistById(akatistId: number): Promise<Akatist | null> {
  if (!supabase) {
    return null
  }
  
  const { data, error } = await supabase
    .from('akatist')
    .select('*')
    .eq('id', akatistId)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function getAllAkatisti(): Promise<Akatist[]> {
  if (!supabase) {
    return []
  }
  
  const { data, error } = await supabase
    .from('akatist')
    .select('*')
    .order('id')
  
  if (error) {
    return []
  }
  
  return data || []
}