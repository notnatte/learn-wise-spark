-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables for the LearnWise application

-- PART 1: Create tables and extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER, -- in minutes
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT CHECK (type IN ('text', 'video', 'quiz', 'assignment')),
  duration INTEGER, -- in minutes
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  progress INTEGER DEFAULT 0, -- percentage (0-100)
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 0,
  requirements JSONB
);

-- User achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Learning streaks
CREATE TABLE IF NOT EXISTS public.learning_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  UNIQUE(user_id)
);

-- AI Tutor conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Tutor messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('achievement', 'reminder', 'system')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PART 2: Create functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.learning_streaks (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_learning_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  streak_increment INTEGER;
BEGIN
  -- Get the last activity date
  SELECT last_activity_date INTO last_date
  FROM public.learning_streaks
  WHERE user_id = NEW.user_id;
  
  -- If no previous activity or last activity was more than 1 day ago
  IF last_date IS NULL OR last_date < CURRENT_DATE - 1 THEN
    streak_increment := 1;
  -- If last activity was yesterday, increment streak
  ELSIF last_date = CURRENT_DATE - 1 THEN
    streak_increment := 1;
  -- If already active today, no change
  ELSE
    streak_increment := 0;
  END IF;
  
  -- Update the streak
  UPDATE public.learning_streaks
  SET 
    current_streak = CASE 
      WHEN streak_increment > 0 THEN current_streak + streak_increment
      ELSE current_streak
    END,
    longest_streak = CASE 
      WHEN current_streak + streak_increment > longest_streak THEN current_streak + streak_increment
      ELSE longest_streak
    END,
    last_activity_date = CURRENT_DATE
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_progress_recorded ON public.user_progress;
CREATE TRIGGER on_progress_recorded
AFTER INSERT OR UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.update_learning_streak();

-- PART 3: Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PART 4: Create basic policies first (without complex conditions)
-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses policies
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;
CREATE POLICY "Published courses are viewable by everyone" ON public.courses FOR SELECT USING (published = true);

-- Simplified teacher/admin policy to avoid role column issues
DROP POLICY IF EXISTS "Teachers and admins can create courses" ON public.courses;
CREATE POLICY "Teachers and admins can create courses" ON public.courses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Teachers and admins can update their own courses" ON public.courses;
CREATE POLICY "Teachers and admins can update their own courses" ON public.courses FOR UPDATE USING (created_by = auth.uid());

-- Lessons policies
DROP POLICY IF EXISTS "Lessons in published courses are viewable by everyone" ON public.lessons;
CREATE POLICY "Lessons in published courses are viewable by everyone" ON public.lessons FOR SELECT USING (
    course_id IN (SELECT id FROM public.courses WHERE published = true)
);

DROP POLICY IF EXISTS "Teachers and admins can create lessons" ON public.lessons;
CREATE POLICY "Teachers and admins can create lessons" ON public.lessons FOR INSERT WITH CHECK (true);

-- User progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (user_id = auth.uid());

-- Enrollments policies
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can enroll in courses" ON public.enrollments;
CREATE POLICY "Users can enroll in courses" ON public.enrollments FOR INSERT WITH CHECK (user_id = auth.uid());

-- Achievements policies
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements FOR SELECT USING (true);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (user_id = auth.uid());

-- Learning streaks policies
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.learning_streaks;
CREATE POLICY "Users can view their own streaks" ON public.learning_streaks FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.learning_streaks;
CREATE POLICY "Users can insert their own streaks" ON public.learning_streaks FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own streaks" ON public.learning_streaks;
CREATE POLICY "Users can update their own streaks" ON public.learning_streaks FOR UPDATE USING (user_id = auth.uid());

-- AI conversations policies
DROP POLICY IF EXISTS "Users can view their own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can view their own AI conversations" ON public.ai_conversations FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can create their own AI conversations" ON public.ai_conversations FOR INSERT WITH CHECK (user_id = auth.uid());

-- AI messages policies
DROP POLICY IF EXISTS "Users can view their own AI messages" ON public.ai_messages;
CREATE POLICY "Users can view their own AI messages" ON public.ai_messages FOR SELECT USING (
    conversation_id IN (
    SELECT id FROM public.ai_conversations WHERE user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can create their own AI messages" ON public.ai_messages;
CREATE POLICY "Users can create their own AI messages" ON public.ai_messages FOR INSERT WITH CHECK (
    conversation_id IN (
    SELECT id FROM public.ai_conversations WHERE user_id = auth.uid()
    )
);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- PART 5: Add more complex role-based policies now that the basic setup is working

-- Update course policies to properly check roles
DROP POLICY IF EXISTS "Teachers and admins can create courses" ON public.courses;
CREATE POLICY "Teachers and admins can create courses" 
ON public.courses FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT IN ('teacher', 'admin')
    )
);

DROP POLICY IF EXISTS "Teachers and admins can update their own courses" ON public.courses;
CREATE POLICY "Teachers and admins can update their own courses" 
ON public.courses FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT IN ('teacher', 'admin')
    ) AND created_by = auth.uid()
);

-- Add policy for teachers/admins to view all courses (even unpublished)
DROP POLICY IF EXISTS "Teachers and admins can view all courses" ON public.courses;
CREATE POLICY "Teachers and admins can view all courses" 
ON public.courses FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT IN ('teacher', 'admin')
    )
);

-- Update lesson policies to properly check roles
DROP POLICY IF EXISTS "Teachers and admins can create lessons" ON public.lessons;
CREATE POLICY "Teachers and admins can create lessons" 
ON public.lessons FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT IN ('teacher', 'admin')
    )
);

-- Add policy for teachers/admins to update lessons
DROP POLICY IF EXISTS "Teachers and admins can update lessons" ON public.lessons;
CREATE POLICY "Teachers and admins can update lessons" 
ON public.lessons FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT IN ('teacher', 'admin')
    ) AND 
    course_id IN (
        SELECT id FROM public.courses WHERE created_by = auth.uid()
    )
);

-- Add policy for teachers/admins to view all lessons (even in unpublished courses)
DROP POLICY IF EXISTS "Teachers and admins can view all lessons" ON public.lessons;
CREATE POLICY "Teachers and admins can view all lessons" 
ON public.lessons FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT IN ('teacher', 'admin')
    )
);

-- Add policy for admins to manage achievements
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements" 
ON public.achievements FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT = 'admin'
    )
);

-- Add policy for admins to view all user data
DROP POLICY IF EXISTS "Admins can view all user data" ON public.profiles;
CREATE POLICY "Admins can view all user data" 
ON public.profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT = 'admin'
    )
);

-- Add policy for admins to view all enrollments
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
CREATE POLICY "Admins can view all enrollments" 
ON public.enrollments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT = 'admin'
    )
);

-- Add policy for admins to view all user progress
DROP POLICY IF EXISTS "Admins can view all user progress" ON public.user_progress;
CREATE POLICY "Admins can view all user progress" 
ON public.user_progress FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT = 'admin'
    )
);

-- Add policy for teachers to view progress for students in their courses
DROP POLICY IF EXISTS "Teachers can view progress for their courses" ON public.user_progress;
CREATE POLICY "Teachers can view progress for their courses" 
ON public.user_progress FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role)::TEXT = 'teacher'
    ) AND
    lesson_id IN (
        SELECT l.id FROM public.lessons l
        JOIN public.courses c ON l.course_id = c.id
        WHERE c.created_by = auth.uid()
    )
);