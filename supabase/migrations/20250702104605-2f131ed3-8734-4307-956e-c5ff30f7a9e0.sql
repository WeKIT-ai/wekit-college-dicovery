-- Insert sample colleges for testing
INSERT INTO public.colleges (name, city, state, college_type, institution_type, establishment_year, website_url, nirf_ranking, courses_offered, departments, facilities, description) VALUES
('Indian Institute of Technology Delhi', 'New Delhi', 'Delhi', 'Engineering', 'Government', 1961, 'https://iitd.ac.in', 2, 
 '["Computer Science Engineering", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Chemical Engineering"]'::jsonb,
 '["Computer Science", "Mechanical", "Electrical", "Civil", "Chemical", "Mathematics", "Physics"]'::jsonb,
 '["Hostel", "Library", "Sports Complex", "Labs", "Cafeteria", "Medical Center"]'::jsonb,
 'Premier engineering institution known for excellence in technology and innovation'),

('Bangalore Medical College', 'Bangalore', 'Karnataka', 'Medical', 'Government', 1955, 'https://bmcri.edu.in', 45,
 '["MBBS", "MD", "MS", "DM", "MCh"]'::jsonb,
 '["General Medicine", "Surgery", "Pediatrics", "Gynecology", "Orthopedics", "Radiology"]'::jsonb,
 '["Hospital", "Library", "Hostel", "Labs", "Research Center"]'::jsonb,
 'Leading medical college with attached teaching hospital'),

('St Xavier College Mumbai', 'Mumbai', 'Maharashtra', 'Arts and Science', 'Private', 1869, 'https://xaviers.edu', 78,
 '["BA", "BSc", "BCom", "MA", "MSc", "MCom"]'::jsonb,
 '["English", "Economics", "Physics", "Chemistry", "Mathematics", "Commerce"]'::jsonb,
 '["Library", "Auditorium", "Sports Ground", "Labs", "Canteen"]'::jsonb,
 'Prestigious autonomous college known for liberal arts education'),

('Indian Institute of Science Bangalore', 'Bangalore', 'Karnataka', 'Research Institute', 'Deemed', 1909, 'https://iisc.ac.in', 1,
 '["BE", "MTech", "PhD", "Integrated PhD"]'::jsonb,
 '["Aerospace", "Computer Science", "Electrical", "Materials", "Chemical", "Biological Sciences"]'::jsonb,
 '["Research Labs", "Library", "Hostel", "Sports Complex", "Convention Center"]'::jsonb,
 'Premier research institution focusing on science and engineering research'),

('Delhi University Hansraj College', 'New Delhi', 'Delhi', 'Arts and Science', 'Government', 1948, 'https://hansrajcollege.ac.in', 156,
 '["BA", "BSc", "BCom", "MA", "MSc"]'::jsonb,
 '["Economics", "English", "Physics", "Chemistry", "Mathematics", "Political Science"]'::jsonb,
 '["Library", "Labs", "Auditorium", "Sports Facilities", "Canteen"]'::jsonb,
 'One of the premier colleges of Delhi University known for academic excellence');