-- Add Calendly integration fields to mentor profiles
ALTER TABLE public.mentor_profiles 
ADD COLUMN calendly_username TEXT,
ADD COLUMN calendly_event_type TEXT,
ADD COLUMN scheduling_enabled BOOLEAN DEFAULT false,
ADD COLUMN booking_preferences JSONB DEFAULT '{"buffer_time": 15, "max_advance_days": 30, "timezone": "UTC"}'::jsonb;

-- Add scheduling fields to mentoring_requests
ALTER TABLE public.mentoring_requests
ADD COLUMN is_scheduling_request BOOLEAN DEFAULT false,
ADD COLUMN calendly_event_id TEXT,
ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN meeting_link TEXT,
ADD COLUMN scheduling_status TEXT DEFAULT 'pending'; -- 'pending', 'scheduled', 'completed', 'cancelled'

-- Add Calendly webhook handling table
CREATE TABLE public.calendly_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  mentor_id UUID REFERENCES public.mentor_profiles(id),
  mentoring_request_id UUID REFERENCES public.mentoring_requests(id),
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on calendly_webhooks
ALTER TABLE public.calendly_webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies for calendly_webhooks
CREATE POLICY "System can manage calendly webhooks" 
ON public.calendly_webhooks 
FOR ALL 
USING (true);

-- Create function to handle scheduling workflow
CREATE OR REPLACE FUNCTION public.create_scheduling_request(
  p_mentee_id UUID,
  p_mentor_id UUID,
  p_subject TEXT,
  p_description TEXT,
  p_preferred_time TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id UUID;
BEGIN
  -- Insert new mentoring request with scheduling flag
  INSERT INTO public.mentoring_requests (
    mentee_id,
    mentor_id,
    subject,
    description,
    preferred_time,
    is_scheduling_request,
    status
  ) VALUES (
    p_mentee_id,
    p_mentor_id,
    p_subject,
    p_description,
    p_preferred_time,
    true,
    'pending'
  ) RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$$;