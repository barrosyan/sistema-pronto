-- Allow admins to view all profiles for user selection
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all campaign_metrics for analysis
CREATE POLICY "Admins can view all campaign metrics"
ON public.campaign_metrics
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all leads for analysis
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all daily_metrics for analysis
CREATE POLICY "Admins can view all daily metrics"
ON public.daily_metrics
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles_data for analysis
CREATE POLICY "Admins can view all profiles data"
ON public.profiles_data
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all events for analysis
CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
USING (has_role(auth.uid(), 'admin'));