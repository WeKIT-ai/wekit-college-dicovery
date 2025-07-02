-- Create college_feedback table to store user feedback and photos for colleges
CREATE TABLE public.college_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  academics_rating INTEGER CHECK (academics_rating >= 1 AND academics_rating <= 5),
  campus_life_rating INTEGER CHECK (campus_life_rating >= 1 AND campus_life_rating <= 5),
  facilities_rating INTEGER CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
  safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
  placements_rating INTEGER CHECK (placements_rating >= 1 AND placements_rating <= 5),
  title TEXT,
  review_text TEXT,
  course TEXT,
  graduation_year TEXT,
  would_recommend TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create college_photos table to store photos uploaded by users for specific colleges
CREATE TABLE public.college_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_id UUID REFERENCES public.college_feedback(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  photo_type TEXT DEFAULT 'general', -- general, campus, hostel, library, sports, cafeteria, etc.
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.college_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_photos ENABLE ROW LEVEL SECURITY;

-- RLS policies for college_feedback
CREATE POLICY "Users can view all feedback" 
ON public.college_feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own feedback" 
ON public.college_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" 
ON public.college_feedback 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback" 
ON public.college_feedback 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for college_photos
CREATE POLICY "Users can view approved photos" 
ON public.college_photos 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can view their own photos" 
ON public.college_photos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload photos" 
ON public.college_photos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
ON public.college_photos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
ON public.college_photos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for college photos
INSERT INTO storage.buckets (id, name, public) VALUES ('college-photos', 'college-photos', true);

-- Storage policies for college photos bucket
CREATE POLICY "College photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'college-photos');

CREATE POLICY "Users can upload college photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'college-photos' AND auth.uid()::text IS NOT NULL);

CREATE POLICY "Users can update their own college photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'college-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own college photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'college-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for updating updated_at column
CREATE TRIGGER update_college_feedback_updated_at
BEFORE UPDATE ON public.college_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();