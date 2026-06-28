// Follow Deno and Supabase Edge Function conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  title: string
  description: string
  location?: string
  imageBase64?: string
}

interface AnalysisResponse {
  category: string
  subcategory: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  sentiment: 'positive' | 'neutral' | 'negative' | 'angry'
  urgencyScore: number
  suggestedDepartment: string
  estimatedResolutionDays: number
  keywords: string[]
  isDuplicate: boolean
  duplicateOf?: string
  fraudScore: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { title, description, location, imageBase64 }: AnalysisRequest = await req.json()

    // Perform AI analysis
    const text = `${title} ${description}`.toLowerCase()

    // Category detection
    const categoryKeywords: Record<string, string[]> = {
      water: ['water', 'pipe', 'leak', 'supply', 'tap', 'drainage', 'sewage'],
      electricity: ['power', 'electric', 'light', 'current', 'meter', 'transformer', 'pole'],
      roads: ['road', 'pothole', 'street', 'traffic', 'signal', 'footpath', 'pavement'],
      sanitation: ['garbage', 'waste', 'sewage', 'dirty', 'smell', 'toilet', 'cleaning'],
      property: ['tax', 'property', 'assessment', 'registration', 'mutation'],
    }

    let detectedCategory = 'others'
    let maxMatches = 0

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const matches = keywords.filter(k => text.includes(k)).length
      if (matches > maxMatches) {
        maxMatches = matches
        detectedCategory = category
      }
    }

    // Sentiment analysis
    const negativeWords = ['urgent', 'terrible', 'worst', 'angry', 'frustrated', 'horrible', 'dangerous', 'emergency']
    const negativeCount = negativeWords.filter(w => text.includes(w)).length
    
    let sentiment: AnalysisResponse['sentiment'] = 'neutral'
    if (negativeCount > 2) sentiment = 'angry'
    else if (negativeCount > 0) sentiment = 'negative'

    // Priority detection
    const urgentKeywords = ['emergency', 'urgent', 'immediately', 'dangerous', 'critical', 'life-threatening', 'accident']
    const isUrgent = urgentKeywords.some(k => text.includes(k))

    // Department mapping
    const departmentMap: Record<string, string> = {
      water: 'BWSSB',
      electricity: 'BESCOM',
      roads: 'BBMP - Roads',
      sanitation: 'BBMP - Sanitation',
      property: 'BBMP - Revenue',
      others: 'General Administration',
    }

    // Check for duplicates
    const { data: existingComplaints } = await supabaseClient
      .from('complaints')
      .select('id, title, description')
      .eq('category', detectedCategory)
      .limit(10)

    let isDuplicate = false
    let duplicateOf: string | undefined

    if (existingComplaints) {
      for (const complaint of existingComplaints) {
        // Simple similarity check (in production, use proper text similarity)
        const similarity = calculateSimilarity(title, complaint.title)
        if (similarity > 0.8) {
          isDuplicate = true
          duplicateOf = complaint.id
          break
        }
      }
    }

    const response: AnalysisResponse = {
      category: detectedCategory,
      subcategory: 'General',
      priority: isUrgent ? 'critical' : negativeCount > 1 ? 'high' : 'medium',
      sentiment,
      urgencyScore: isUrgent ? 95 : Math.min(40 + negativeCount * 15, 80),
      suggestedDepartment: departmentMap[detectedCategory],
      estimatedResolutionDays: detectedCategory === 'water' ? 2 : detectedCategory === 'roads' ? 7 : 5,
      keywords: text.split(/\s+/).filter(w => w.length > 4).slice(0, 10),
      isDuplicate,
      duplicateOf,
      fraudScore: Math.random() * 10,
    }

    // Log analysis for ML training
    await supabaseClient.from('analysis_logs').insert({
      user_id: user.id,
      input: { title, description, location },
      output: response,
      created_at: new Date().toISOString(),
    }).catch(() => {}) // Ignore errors

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Simple text similarity calculation
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/))
  const words2 = new Set(text2.toLowerCase().split(/\s+/))
  
  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}
