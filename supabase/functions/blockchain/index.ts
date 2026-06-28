// Supabase Edge Function for Blockchain Operations
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlockchainRequest {
  action: 'record' | 'verify' | 'getHistory' | 'mintCertificate'
  complaintId: string
  data?: Record<string, any>
}

interface BlockchainTransaction {
  txHash: string
  blockNumber: number
  timestamp: number
  complaintId: string
  action: string
  actor: string
  details: string
  previousHash: string
}

// Simple hash function for demo
async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, complaintId, data }: BlockchainRequest = await req.json()

    switch (action) {
      case 'record': {
        // Get last block
        const { data: lastBlock } = await supabaseClient
          .from('blockchain_transactions')
          .select('*')
          .order('block_number', { ascending: false })
          .limit(1)
          .single()

        const previousHash = lastBlock?.tx_hash || '0'.repeat(64)
        const blockNumber = (lastBlock?.block_number || 0) + 1

        const blockData = {
          complaintId,
          action: data?.action || 'UPDATED',
          actor: data?.actor || 'SYSTEM',
          details: data?.details || '',
          blockNumber,
          previousHash,
          timestamp: Date.now(),
        }

        const txHash = await generateHash(JSON.stringify(blockData))

        const transaction: BlockchainTransaction = {
          txHash,
          blockNumber,
          timestamp: blockData.timestamp,
          complaintId,
          action: blockData.action,
          actor: blockData.actor,
          details: blockData.details,
          previousHash,
        }

        // Store in database
        await supabaseClient.from('blockchain_transactions').insert({
          tx_hash: txHash,
          block_number: blockNumber,
          complaint_id: complaintId,
          action: blockData.action,
          actor: blockData.actor,
          details: blockData.details,
          previous_hash: previousHash,
          timestamp: new Date(blockData.timestamp).toISOString(),
        })

        return new Response(
          JSON.stringify({ success: true, transaction }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'verify': {
        const { data: transactions } = await supabaseClient
          .from('blockchain_transactions')
          .select('*')
          .eq('complaint_id', complaintId)
          .order('block_number', { ascending: true })

        if (!transactions || transactions.length === 0) {
          return new Response(
            JSON.stringify({
              isValid: false,
              transactionCount: 0,
              integrityScore: 0,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify chain integrity
        let isValid = true
        for (let i = 1; i < transactions.length; i++) {
          if (transactions[i].previous_hash !== transactions[i - 1].tx_hash) {
            isValid = false
            break
          }
        }

        return new Response(
          JSON.stringify({
            isValid,
            transactionCount: transactions.length,
            integrityScore: isValid ? 100 : 50,
            lastBlock: transactions[transactions.length - 1],
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'getHistory': {
        const { data: transactions } = await supabaseClient
          .from('blockchain_transactions')
          .select('*')
          .eq('complaint_id', complaintId)
          .order('block_number', { ascending: true })

        return new Response(
          JSON.stringify({ transactions: transactions || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'mintCertificate': {
        const tokenId = `SUVIDHA-NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        const certificate = {
          tokenId,
          complaintId,
          citizenId: data?.citizenId,
          departmentId: data?.departmentId,
          resolvedAt: Date.now(),
          rating: data?.rating || 5,
          metadata: data?.metadata || {},
        }

        // Record NFT minting on chain
        const txHash = await generateHash(JSON.stringify(certificate))

        await supabaseClient.from('nft_certificates').insert({
          token_id: tokenId,
          complaint_id: complaintId,
          citizen_id: data?.citizenId,
          department_id: data?.departmentId,
          tx_hash: txHash,
          metadata: certificate.metadata,
          created_at: new Date().toISOString(),
        })

        // Also record on blockchain
        await supabaseClient.from('blockchain_transactions').insert({
          tx_hash: txHash,
          block_number: Date.now(),
          complaint_id: complaintId,
          action: 'NFT_MINTED',
          actor: 'SYSTEM',
          details: `Resolution certificate: ${tokenId}`,
          previous_hash: '0'.repeat(64),
          timestamp: new Date().toISOString(),
        })

        return new Response(
          JSON.stringify({ success: true, certificate, txHash }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
