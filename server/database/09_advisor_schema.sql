-- Phase 11: AI Career Advisor Schema

-- Conversations Table
CREATE TABLE IF NOT EXISTS public.advisor_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.advisor_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.advisor_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    response JSONB,
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_advisor_conversations_user_id ON public.advisor_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_advisor_messages_conversation_id ON public.advisor_messages(conversation_id);

-- Row Level Security
ALTER TABLE public.advisor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_messages ENABLE ROW LEVEL SECURITY;

-- Policies for advisor_conversations
CREATE POLICY "Users can view their own advisor conversations"
    ON public.advisor_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advisor conversations"
    ON public.advisor_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own advisor conversations"
    ON public.advisor_conversations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own advisor conversations"
    ON public.advisor_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for advisor_messages
CREATE POLICY "Users can view messages of their conversations"
    ON public.advisor_messages FOR SELECT
    USING (
        conversation_id IN (
            SELECT id FROM public.advisor_conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to their conversations"
    ON public.advisor_messages FOR INSERT
    WITH CHECK (
        conversation_id IN (
            SELECT id FROM public.advisor_conversations WHERE user_id = auth.uid()
        )
    );
