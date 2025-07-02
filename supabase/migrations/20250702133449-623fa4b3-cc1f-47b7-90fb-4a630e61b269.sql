-- Add missing RLS policies for tables that need them

-- Enable RLS on tables that don't have it enabled
ALTER TABLE public.mentoring_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diversity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_analytics ENABLE ROW LEVEL SECURITY;

-- Mentoring Programs policies
CREATE POLICY "Admins can manage all programs" ON public.mentoring_programs
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone can view active programs" ON public.mentoring_programs
FOR SELECT USING (is_active = true);

CREATE POLICY "Program creators can manage their programs" ON public.mentoring_programs
FOR ALL USING (auth.uid() = created_by);

-- Communication Logs policies
CREATE POLICY "Participants can view their communication logs" ON public.communication_logs
FOR SELECT USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create communication logs" ON public.communication_logs
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Admins can manage all communication logs" ON public.communication_logs
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Mentoring Feedback policies
CREATE POLICY "Feedback providers can create feedback" ON public.mentoring_feedback
FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Connection participants can view feedback" ON public.mentoring_feedback
FOR SELECT USING (
  auth.uid() = provider_id OR 
  auth.uid() = recipient_id OR
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM mentorship_connections mc
    JOIN mentor_profiles mp ON mc.mentor_id = mp.id
    JOIN youth_profiles yp ON mc.mentee_id = yp.id
    WHERE mc.id = connection_id 
    AND (mp.user_id = auth.uid() OR yp.user_id = auth.uid())
  )
);

CREATE POLICY "Feedback providers can update their feedback" ON public.mentoring_feedback
FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Admins can manage all feedback" ON public.mentoring_feedback
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Mentoring Goals policies
CREATE POLICY "Connection participants can view goals" ON public.mentoring_goals
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM mentorship_connections mc
    JOIN mentor_profiles mp ON mc.mentor_id = mp.id
    JOIN youth_profiles yp ON mc.mentee_id = yp.id
    WHERE mc.id = connection_id 
    AND (mp.user_id = auth.uid() OR yp.user_id = auth.uid())
  )
);

CREATE POLICY "Connection participants can create goals" ON public.mentoring_goals
FOR INSERT WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM mentorship_connections mc
    JOIN mentor_profiles mp ON mc.mentor_id = mp.id
    JOIN youth_profiles yp ON mc.mentee_id = yp.id
    WHERE mc.id = connection_id 
    AND (mp.user_id = auth.uid() OR yp.user_id = auth.uid())
  )
);

CREATE POLICY "Goal creators can update their goals" ON public.mentoring_goals
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all goals" ON public.mentoring_goals
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Diversity Metrics policies
CREATE POLICY "Admins can manage diversity metrics" ON public.diversity_metrics
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Program participants can view relevant metrics" ON public.diversity_metrics
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM mentorship_connections mc
    JOIN mentor_profiles mp ON mc.mentor_id = mp.id
    JOIN youth_profiles yp ON mc.mentee_id = yp.id
    WHERE mc.id = connection_id 
    AND (mp.user_id = auth.uid() OR yp.user_id = auth.uid())
  )
);

-- Mentoring Analytics policies
CREATE POLICY "Admins can manage all analytics" ON public.mentoring_analytics
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Connection participants can view their analytics" ON public.mentoring_analytics
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM mentorship_connections mc
    JOIN mentor_profiles mp ON mc.mentor_id = mp.id
    JOIN youth_profiles yp ON mc.mentee_id = yp.id
    WHERE mc.id = connection_id 
    AND (mp.user_id = auth.uid() OR yp.user_id = auth.uid())
  )
);

-- Add missing INSERT policy for notifications (system should be able to create them)
CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Add missing policies for system_integrations if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'system_integrations') THEN
    EXECUTE 'ALTER TABLE public.system_integrations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'CREATE POLICY "Admins can manage integrations" ON public.system_integrations FOR ALL USING (has_role(auth.uid(), ''admin''::app_role))';
    EXECUTE 'CREATE POLICY "Users can view their integrations" ON public.system_integrations FOR SELECT USING (auth.uid() = user_id)';
  END IF;
END
$$;