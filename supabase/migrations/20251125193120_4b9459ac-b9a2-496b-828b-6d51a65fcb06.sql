-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_name)
);

-- Enable RLS on profiles_data
ALTER TABLE public.profiles_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles_data
CREATE POLICY "Users can view their own profiles"
ON public.profiles_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles"
ON public.profiles_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
ON public.profiles_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles"
ON public.profiles_data FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at on profiles_data
CREATE TRIGGER update_profiles_data_updated_at
BEFORE UPDATE ON public.profiles_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add profile_id foreign key to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles_data(id) ON DELETE SET NULL;