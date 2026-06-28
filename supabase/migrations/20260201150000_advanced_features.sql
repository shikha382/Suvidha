-- Blockchain Transactions Table
-- Stores immutable records of all complaint-related actions

CREATE TABLE IF NOT EXISTS public.blockchain_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tx_hash TEXT UNIQUE NOT NULL,
    block_number INTEGER NOT NULL,
    previous_hash TEXT NOT NULL,
    nonce INTEGER NOT NULL,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('CREATED', 'UPDATED', 'ASSIGNED', 'RESOLVED', 'ESCALATED', 'VERIFIED', 'CLOSED', 'REOPENED')),
    actor TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NFT Resolution Certificates
CREATE TABLE IF NOT EXISTS public.nft_certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token_id TEXT UNIQUE NOT NULL,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES auth.users(id),
    department_id UUID,
    tx_hash TEXT REFERENCES public.blockchain_transactions(tx_hash),
    resolution_time_hours INTEGER,
    rating DECIMAL(3,2),
    metadata JSONB DEFAULT '{}'::jsonb,
    issued_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Orders Table (for Razorpay integration)
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    amount INTEGER NOT NULL, -- Amount in paise
    currency TEXT DEFAULT 'INR',
    receipt TEXT NOT NULL,
    payment_type TEXT NOT NULL,
    status TEXT DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'refunded')),
    payment_id TEXT,
    razorpay_signature TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction History
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    order_id UUID REFERENCES public.payment_orders(id),
    type TEXT NOT NULL CHECK (type IN ('payment', 'refund', 'reward_redemption', 'reward_earn')),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    reference_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reward Points Ledger
CREATE TABLE IF NOT EXISTS public.reward_points_ledger (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    points INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'expire', 'bonus')),
    source TEXT NOT NULL, -- payment, complaint_resolved, daily_login, referral, etc.
    reference_id TEXT,
    description TEXT,
    balance_after INTEGER NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reward Redemptions
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    reward_id TEXT NOT NULL,
    reward_name TEXT NOT NULL,
    points_used INTEGER NOT NULL,
    cash_value INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    delivery_method TEXT, -- cashback, voucher, service
    delivery_details JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Reward Balances (materialized view concept)
CREATE TABLE IF NOT EXISTS public.user_reward_balances (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    total_earned INTEGER DEFAULT 0,
    total_redeemed INTEGER DEFAULT 0,
    current_balance INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analysis Logs
CREATE TABLE IF NOT EXISTS public.ai_analysis_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('complaint', 'image', 'sentiment', 'duplicate', 'fraud', 'translation')),
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    confidence_score DECIMAL(5,2),
    processing_time_ms INTEGER,
    model_version TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Uploads
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    document_type TEXT NOT NULL,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'processing', 'verified', 'failed', 'rejected')),
    verification_result JSONB DEFAULT '{}'::jsonb,
    extracted_data JSONB DEFAULT '{}'::jsonb,
    is_signed BOOLEAN DEFAULT false,
    signature_data JSONB DEFAULT '{}'::jsonb,
    digilocker_doc_id TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart Contract Rules
CREATE TABLE IF NOT EXISTS public.smart_contract_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    condition_type TEXT NOT NULL, -- time_based, status_based, priority_based
    condition_config JSONB NOT NULL,
    action_type TEXT NOT NULL, -- escalate, notify, assign, close
    action_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime Subscriptions Tracking
CREATE TABLE IF NOT EXISTS public.realtime_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    channel_type TEXT NOT NULL, -- complaint, department, broadcast
    channel_id TEXT NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, channel_type, channel_id)
);

-- City Data Cache (for smart city dashboard)
CREATE TABLE IF NOT EXISTS public.city_data_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    data_type TEXT UNIQUE NOT NULL, -- weather, traffic, water, power, transport, emergency
    data JSONB NOT NULL,
    source TEXT,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_complaint_id ON public.blockchain_transactions(complaint_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_tx_hash ON public.blockchain_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_timestamp ON public.blockchain_transactions(timestamp);

CREATE INDEX IF NOT EXISTS idx_nft_certificates_citizen_id ON public.nft_certificates(citizen_id);
CREATE INDEX IF NOT EXISTS idx_nft_certificates_complaint_id ON public.nft_certificates(complaint_id);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON public.payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON public.payment_orders(order_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

CREATE INDEX IF NOT EXISTS idx_reward_points_ledger_user_id ON public.reward_points_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_points_ledger_type ON public.reward_points_ledger(type);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_complaint_id ON public.documents(complaint_id);
CREATE INDEX IF NOT EXISTS idx_documents_verification_status ON public.documents(verification_status);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_logs_user_id ON public.ai_analysis_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_logs_complaint_id ON public.ai_analysis_logs(complaint_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_logs_type ON public.ai_analysis_logs(analysis_type);

-- Enable Row Level Security
ALTER TABLE public.blockchain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reward_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_contract_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_data_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Blockchain transactions: public read, service write
CREATE POLICY "Blockchain transactions are viewable by everyone"
    ON public.blockchain_transactions FOR SELECT
    USING (true);

CREATE POLICY "Service role can insert blockchain transactions"
    ON public.blockchain_transactions FOR INSERT
    WITH CHECK (true);

-- NFT certificates: owner can view, service can insert
CREATE POLICY "Users can view their own certificates"
    ON public.nft_certificates FOR SELECT
    USING (auth.uid() = citizen_id);

CREATE POLICY "Service role can insert certificates"
    ON public.nft_certificates FOR INSERT
    WITH CHECK (true);

-- Payment orders: owner only
CREATE POLICY "Users can view their own payment orders"
    ON public.payment_orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment orders"
    ON public.payment_orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Transactions: owner only
CREATE POLICY "Users can view their own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Reward points ledger: owner only
CREATE POLICY "Users can view their own reward points"
    ON public.reward_points_ledger FOR SELECT
    USING (auth.uid() = user_id);

-- User reward balances: owner only
CREATE POLICY "Users can view their own reward balance"
    ON public.user_reward_balances FOR SELECT
    USING (auth.uid() = user_id);

-- Documents: owner only
CREATE POLICY "Users can view their own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents"
    ON public.documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON public.documents FOR UPDATE
    USING (auth.uid() = user_id);

-- Smart contract rules: public read
CREATE POLICY "Smart contract rules are viewable by everyone"
    ON public.smart_contract_rules FOR SELECT
    USING (true);

-- City data cache: public read
CREATE POLICY "City data is viewable by everyone"
    ON public.city_data_cache FOR SELECT
    USING (true);

-- Realtime subscriptions: owner only
CREATE POLICY "Users can manage their subscriptions"
    ON public.realtime_subscriptions FOR ALL
    USING (auth.uid() = user_id);

-- Functions

-- Function to update user reward balance
CREATE OR REPLACE FUNCTION update_user_reward_balance()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_reward_balances (user_id, current_balance, total_earned, total_redeemed, lifetime_points)
    VALUES (
        NEW.user_id,
        CASE WHEN NEW.type = 'earn' OR NEW.type = 'bonus' THEN NEW.points ELSE -NEW.points END,
        CASE WHEN NEW.type = 'earn' OR NEW.type = 'bonus' THEN NEW.points ELSE 0 END,
        CASE WHEN NEW.type = 'redeem' THEN NEW.points ELSE 0 END,
        CASE WHEN NEW.type = 'earn' OR NEW.type = 'bonus' THEN NEW.points ELSE 0 END
    )
    ON CONFLICT (user_id) DO UPDATE SET
        current_balance = public.user_reward_balances.current_balance + 
            CASE WHEN NEW.type = 'earn' OR NEW.type = 'bonus' THEN NEW.points ELSE -NEW.points END,
        total_earned = public.user_reward_balances.total_earned + 
            CASE WHEN NEW.type = 'earn' OR NEW.type = 'bonus' THEN NEW.points ELSE 0 END,
        total_redeemed = public.user_reward_balances.total_redeemed + 
            CASE WHEN NEW.type = 'redeem' THEN NEW.points ELSE 0 END,
        lifetime_points = public.user_reward_balances.lifetime_points + 
            CASE WHEN NEW.type = 'earn' OR NEW.type = 'bonus' THEN NEW.points ELSE 0 END,
        tier = CASE
            WHEN public.user_reward_balances.lifetime_points >= 10000 THEN 'platinum'
            WHEN public.user_reward_balances.lifetime_points >= 5000 THEN 'gold'
            WHEN public.user_reward_balances.lifetime_points >= 1000 THEN 'silver'
            ELSE 'bronze'
        END,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for reward points
CREATE TRIGGER trigger_update_reward_balance
    AFTER INSERT ON public.reward_points_ledger
    FOR EACH ROW
    EXECUTE FUNCTION update_user_reward_balance();

-- Function to validate blockchain chain integrity
CREATE OR REPLACE FUNCTION validate_blockchain_chain(p_complaint_id UUID)
RETURNS TABLE(is_valid BOOLEAN, transaction_count INTEGER, integrity_score INTEGER) AS $$
DECLARE
    v_prev_hash TEXT := '0';
    v_valid BOOLEAN := true;
    v_count INTEGER := 0;
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT tx_hash, previous_hash, block_number 
        FROM public.blockchain_transactions 
        WHERE complaint_id = p_complaint_id 
        ORDER BY block_number ASC
    LOOP
        v_count := v_count + 1;
        IF rec.previous_hash != v_prev_hash THEN
            v_valid := false;
        END IF;
        v_prev_hash := rec.tx_hash;
    END LOOP;
    
    RETURN QUERY SELECT v_valid, v_count, CASE WHEN v_valid THEN 100 ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.blockchain_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.city_data_cache;
