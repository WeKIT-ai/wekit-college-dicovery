-- Create user profiles table for enhanced user data
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  college TEXT,
  course TEXT,
  graduation_year INTEGER,
  current_role TEXT,
  location TEXT,
  interests TEXT[],
  coins_balance INTEGER DEFAULT 0,
  total_contributions INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create forums table for community discussions
CREATE TABLE public.forums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'general', 'college-specific', 'course-specific', 'career'
  college_id UUID REFERENCES public.colleges(id),
  course TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  forum_id UUID NOT NULL REFERENCES public.forums(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum replies table
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user feedback table for in-app surveys
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  feedback_type TEXT NOT NULL, -- 'survey', 'feature_request', 'bug_report', 'general'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  page_context TEXT, -- which page the feedback was given from
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentoring requests table
CREATE TABLE public.mentoring_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentee_id UUID NOT NULL REFERENCES auth.users(id),
  mentor_id UUID REFERENCES auth.users(id),
  college_id UUID REFERENCES public.colleges(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'completed'
  coins_offered INTEGER DEFAULT 0,
  session_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification system
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL, -- 'mention', 'reply', 'upvote', 'badge', 'mentoring', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user activities for gamification
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  activity_type TEXT NOT NULL, -- 'review_posted', 'photo_uploaded', 'forum_post', 'reply', 'upvote', 'mentoring'
  points_earned INTEGER DEFAULT 0,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for forums
CREATE POLICY "Anyone can view active forums" ON public.forums FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can create forums" ON public.forums FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Forum creators can update their forums" ON public.forums FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for forum_posts
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Post authors can update their posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Post authors can delete their posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for forum_replies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reply authors can update their replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Reply authors can delete their replies" ON public.forum_replies FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_feedback
CREATE POLICY "Anyone can submit feedback" ON public.user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own feedback" ON public.user_feedback FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for mentoring_requests
CREATE POLICY "Users can view their mentoring requests" ON public.mentoring_requests FOR SELECT USING (auth.uid() = mentee_id OR auth.uid() = mentor_id);
CREATE POLICY "Users can create mentoring requests" ON public.mentoring_requests FOR INSERT WITH CHECK (auth.uid() = mentee_id);
CREATE POLICY "Users can update their mentoring requests" ON public.mentoring_requests FOR UPDATE USING (auth.uid() = mentee_id OR auth.uid() = mentor_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_activities
CREATE POLICY "Users can view their own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activities" ON public.user_activities FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forums_updated_at
  BEFORE UPDATE ON public.forums
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentoring_requests_updated_at
  BEFORE UPDATE ON public.mentoring_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update coin balance and activities
CREATE OR REPLACE FUNCTION public.award_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_activity_type TEXT,
  p_description TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Update user profile coins
  UPDATE public.user_profiles 
  SET coins_balance = coins_balance + p_amount,
      total_contributions = total_contributions + 1
  WHERE user_id = p_user_id;
  
  -- Record activity
  INSERT INTO public.user_activities (user_id, activity_type, points_earned, description)
  VALUES (p_user_id, p_activity_type, p_amount, p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;