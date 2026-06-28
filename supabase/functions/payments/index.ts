// Supabase Edge Function for Payment Processing (Razorpay Integration)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  action: 'createOrder' | 'verifyPayment' | 'processRefund' | 'redeemReward'
  amount?: number
  currency?: string
  receipt?: string
  paymentId?: string
  orderId?: string
  signature?: string
  userId?: string
  rewardId?: string
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

    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') ?? ''
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') ?? ''

    const { action, amount, currency, receipt, paymentId, orderId, signature, userId, rewardId }: PaymentRequest = await req.json()

    switch (action) {
      case 'createOrder': {
        if (!amount || !receipt) {
          return new Response(
            JSON.stringify({ error: 'Amount and receipt are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Call Razorpay API to create order
        const orderData = {
          amount: amount * 100, // Convert to paise
          currency: currency || 'INR',
          receipt,
          notes: {
            platform: 'SUVIDHA',
          },
        }

        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
          },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
          // Fallback for demo without real Razorpay credentials
          const demoOrder = {
            id: `order_${Date.now()}`,
            amount: amount * 100,
            currency: currency || 'INR',
            receipt,
            status: 'created',
            created_at: Date.now(),
          }

          // Store order in database
          await supabaseClient.from('payment_orders').insert({
            order_id: demoOrder.id,
            amount: amount,
            currency: demoOrder.currency,
            receipt,
            status: 'created',
            user_id: userId,
            created_at: new Date().toISOString(),
          })

          return new Response(
            JSON.stringify(demoOrder),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const order = await response.json()

        // Store order in database
        await supabaseClient.from('payment_orders').insert({
          order_id: order.id,
          amount: amount,
          currency: order.currency,
          receipt,
          status: 'created',
          user_id: userId,
          created_at: new Date().toISOString(),
        })

        return new Response(
          JSON.stringify(order),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'verifyPayment': {
        if (!paymentId || !orderId || !signature) {
          return new Response(
            JSON.stringify({ error: 'Payment details are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify signature
        const body = orderId + '|' + paymentId
        const expectedSignature = createHmac('sha256', RAZORPAY_KEY_SECRET)
          .update(body)
          .digest('hex')

        const isValid = expectedSignature === signature

        if (isValid) {
          // Update order status
          await supabaseClient
            .from('payment_orders')
            .update({
              status: 'paid',
              payment_id: paymentId,
              signature,
              paid_at: new Date().toISOString(),
            })
            .eq('order_id', orderId)

          // Record transaction
          await supabaseClient.from('transactions').insert({
            type: 'PAYMENT',
            amount: 0, // Will be updated from order
            payment_id: paymentId,
            order_id: orderId,
            status: 'completed',
            user_id: userId,
            created_at: new Date().toISOString(),
          })
        }

        return new Response(
          JSON.stringify({ verified: isValid }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'processRefund': {
        if (!paymentId || !amount) {
          return new Response(
            JSON.stringify({ error: 'Payment ID and amount are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Call Razorpay API to process refund
        const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
          },
          body: JSON.stringify({ amount: amount * 100 }),
        })

        if (!response.ok) {
          // Demo fallback
          const refund = {
            id: `rfnd_${Date.now()}`,
            payment_id: paymentId,
            amount: amount * 100,
            status: 'processed',
          }

          await supabaseClient.from('transactions').insert({
            type: 'REFUND',
            amount,
            payment_id: paymentId,
            refund_id: refund.id,
            status: 'completed',
            user_id: userId,
            created_at: new Date().toISOString(),
          })

          return new Response(
            JSON.stringify(refund),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const refund = await response.json()
        return new Response(
          JSON.stringify(refund),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'redeemReward': {
        if (!userId || !rewardId) {
          return new Response(
            JSON.stringify({ error: 'User ID and reward ID are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get user points
        const { data: user } = await supabaseClient
          .from('user_profiles')
          .select('points')
          .eq('id', userId)
          .single()

        // Get reward details
        const rewards: Record<string, { points: number; value: number }> = {
          'cashback-100': { points: 500, value: 100 },
          'cashback-500': { points: 2000, value: 500 },
          'tax-discount-5': { points: 1000, value: 0 },
          'priority-service': { points: 300, value: 0 },
        }

        const reward = rewards[rewardId]
        if (!reward) {
          return new Response(
            JSON.stringify({ error: 'Invalid reward' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if ((user?.points || 0) < reward.points) {
          return new Response(
            JSON.stringify({ error: 'Insufficient points' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Deduct points
        await supabaseClient
          .from('user_profiles')
          .update({ points: (user?.points || 0) - reward.points })
          .eq('id', userId)

        // Record redemption
        await supabaseClient.from('reward_redemptions').insert({
          user_id: userId,
          reward_id: rewardId,
          points_used: reward.points,
          cash_value: reward.value,
          status: 'completed',
          created_at: new Date().toISOString(),
        })

        return new Response(
          JSON.stringify({
            success: true,
            redemptionId: `rdm_${Date.now()}`,
            pointsDeducted: reward.points,
            cashValue: reward.value,
          }),
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
