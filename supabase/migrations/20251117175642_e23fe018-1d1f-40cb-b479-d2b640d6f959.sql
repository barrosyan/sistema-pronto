-- Add connection_date column to leads table
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS connection_date TIMESTAMPTZ NULL;

-- No changes to RLS needed; existing policies apply to the table
