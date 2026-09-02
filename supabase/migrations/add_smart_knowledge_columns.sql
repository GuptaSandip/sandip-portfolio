-- ============================================================
-- Add Smart Knowledge Columns to chatbot_knowledge table
-- For auto-sync from all portfolio pages
-- ============================================================

-- Create chatbot_knowledge table if it doesn't exist
CREATE TABLE IF NOT EXISTS chatbot_knowledge (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  content         TEXT,
  question        TEXT,
  answer          TEXT,
  category        TEXT DEFAULT 'general' CHECK (category IN ('general','about','experience','tech','courses','achievements','projects','faq','services','education')),
  is_active       BOOLEAN DEFAULT TRUE,
  source_type     TEXT DEFAULT 'manual' CHECK (source_type IN ('manual','auto')),
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if table already exists
ALTER TABLE chatbot_knowledge 
ADD COLUMN IF NOT EXISTS question TEXT;

ALTER TABLE chatbot_knowledge 
ADD COLUMN IF NOT EXISTS answer TEXT;

ALTER TABLE chatbot_knowledge 
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual','auto'));

ALTER TABLE chatbot_knowledge 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Update category check constraint if needed (add new categories)
-- Note: In Supabase, you may need to drop and recreate the constraint

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_active ON chatbot_knowledge(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_category ON chatbot_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_source_type ON chatbot_knowledge(source_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_project_id ON chatbot_knowledge(project_id);

-- Enable RLS if not already enabled
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- Create public read policy (anyone can read active knowledge)
DROP POLICY IF EXISTS "pub_chatbot_knowledge" ON chatbot_knowledge;
CREATE POLICY "pub_chatbot_knowledge" ON chatbot_knowledge 
  FOR SELECT USING (is_active = TRUE);

-- Display confirmation
SELECT 'chatbot_knowledge table ready for smart knowledge system!' as status;
