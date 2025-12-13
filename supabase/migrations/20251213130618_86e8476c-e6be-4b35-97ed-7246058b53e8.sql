-- Allow users to insert their own admin role (self-promotion to PM)
CREATE POLICY "Users can insert their own admin role"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own admin role (self-demotion from PM)
CREATE POLICY "Users can delete their own admin role"
ON public.user_roles
FOR DELETE
USING (auth.uid() = user_id);