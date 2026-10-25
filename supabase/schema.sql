-- ==============================================================================
-- DancingRagas Classical Dance & Music Academy
-- Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- 1. Create Profiles table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  batch_name TEXT DEFAULT 'Bharatanatyam Diploma',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Site Content table (Live CMS for Announcements, Bios, Syllabus, FAQs)
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 3. Create Gallery Media table (Photos, Recital Videos, Stage Shows)
CREATE TABLE IF NOT EXISTS public.gallery_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'instagram')),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Performances',
  url TEXT NOT NULL,
  video_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sequence_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Inquiries & Bookings table (Admissions CRM)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  discipline TEXT NOT NULL,
  level TEXT,
  preferred_time TEXT,
  timezone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Student Resources table (Syllabus PDFs, Theory notes, Tanpura tracks)
CREATE TABLE IF NOT EXISTS public.student_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pdf', 'audio', 'video', 'notes')),
  batch_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Student Practice Submissions (Homework video reviews by Dr. Malavika)
CREATE TABLE IF NOT EXISTS public.student_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  notes TEXT,
  mentor_feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read their own profile; admins can read and update all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Site Content & Gallery: Public can read; only admins can insert/update/delete
CREATE POLICY "Public read site content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Admin write site content" ON public.site_content
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public read gallery media" ON public.gallery_media
  FOR SELECT USING (true);

CREATE POLICY "Admin write gallery media" ON public.gallery_media
  FOR ALL USING (public.is_admin());

-- Inquiries: Anyone can insert (website visitors); only admins can read and update
CREATE POLICY "Public insert inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin manage inquiries" ON public.inquiries
  FOR ALL USING (public.is_admin());

-- Student Resources: Students can read their batch; admins manage all
CREATE POLICY "Students read resources" ON public.student_resources
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin manage resources" ON public.student_resources
  FOR ALL USING (public.is_admin());

-- Student Submissions: Students insert/read their own; admins manage all
CREATE POLICY "Students manage own submissions" ON public.student_submissions
  FOR ALL USING (auth.uid() = student_id OR public.is_admin());

-- ==============================================================================
-- Storage Buckets Configuration (Run in Storage Settings)
-- ==============================================================================
-- 1. Create bucket 'gallery-media' (Public)
-- 2. Create bucket 'student-resources' (Public / Authenticated)
-- 3. Create bucket 'student-assignments' (Authenticated)
