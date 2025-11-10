-- Update RLS policies for leads table to require authentication
DROP POLICY IF EXISTS "Anyone can delete campaign metrics" ON public.campaign_metrics;
DROP POLICY IF EXISTS "Anyone can insert campaign metrics" ON public.campaign_metrics;
DROP POLICY IF EXISTS "Anyone can read campaign metrics" ON public.campaign_metrics;
DROP POLICY IF EXISTS "Anyone can update campaign metrics" ON public.campaign_metrics;

DROP POLICY IF EXISTS "Anyone can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can read leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update leads" ON public.leads;

-- Create secure policies for campaign_metrics (authenticated users only)
CREATE POLICY "Authenticated users can read campaign metrics"
ON public.campaign_metrics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert campaign metrics"
ON public.campaign_metrics
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update campaign metrics"
ON public.campaign_metrics
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete campaign metrics"
ON public.campaign_metrics
FOR DELETE
TO authenticated
USING (true);

-- Create secure policies for leads (authenticated users only)
CREATE POLICY "Authenticated users can read leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (true);