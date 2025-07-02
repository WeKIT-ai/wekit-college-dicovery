-- Create colleges table for Indian educational institutions
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  official_name TEXT,
  college_code TEXT UNIQUE,
  university_affiliation TEXT,
  establishment_year INTEGER,
  
  -- Location details
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  district TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Institution details
  institution_type TEXT, -- Government, Private, Deemed, Autonomous
  college_type TEXT, -- Engineering, Medical, Arts, Commerce, etc.
  affiliation_status TEXT, -- Affiliated, Autonomous, Deemed University
  accreditation_body TEXT, -- NAAC, NBA, etc.
  accreditation_grade TEXT,
  
  -- Contact information
  website_url TEXT,
  email TEXT,
  phone TEXT,
  
  -- Academic details
  courses_offered JSONB DEFAULT '[]'::jsonb,
  departments JSONB DEFAULT '[]'::jsonb,
  total_seats INTEGER,
  student_capacity INTEGER,
  
  -- Rankings and ratings
  nirf_ranking INTEGER,
  nirf_category TEXT,
  other_rankings JSONB DEFAULT '{}'::jsonb,
  
  -- Facilities
  facilities JSONB DEFAULT '[]'::jsonb,
  hostel_available BOOLEAN DEFAULT false,
  library_available BOOLEAN DEFAULT false,
  sports_facilities BOOLEAN DEFAULT false,
  
  -- Fee structure
  fee_structure JSONB DEFAULT '{}'::jsonb,
  
  -- Additional details
  description TEXT,
  admission_process TEXT,
  placement_details JSONB DEFAULT '{}'::jsonb,
  notable_alumni JSONB DEFAULT '[]'::jsonb,
  
  -- Data source tracking
  data_source TEXT,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  verification_status TEXT DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Colleges are viewable by everyone" 
ON public.colleges 
FOR SELECT 
USING (true);

-- Allow admins to manage colleges
CREATE POLICY "Admins can manage colleges" 
ON public.colleges 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_colleges_city ON public.colleges(city);
CREATE INDEX idx_colleges_state ON public.colleges(state);
CREATE INDEX idx_colleges_type ON public.colleges(college_type);
CREATE INDEX idx_colleges_name ON public.colleges(name);
CREATE INDEX idx_colleges_nirf_ranking ON public.colleges(nirf_ranking);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_colleges_updated_at
BEFORE UPDATE ON public.colleges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();