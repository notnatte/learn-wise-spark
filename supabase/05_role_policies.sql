-- Add role-based policies
-- First, let's verify the role column exists and has the correct data type
DO $$
BEGIN
  -- Check if role column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    -- Add role column if it doesn't exist
    ALTER TABLE public.profiles 
    ADD COLUMN role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student';
  END IF;
END $$;

-- Update course policies to properly check roles
DROP POLICY IF EXISTS "Teachers and admins can create courses" ON public.courses;
CREATE POLICY "Teachers and admins can create courses" 
ON public.courses FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    )
);

DROP POLICY IF EXISTS "Teachers and admins can update their own courses" ON public.courses;
CREATE POLICY "Teachers and admins can update their own courses" 
ON public.courses FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    ) AND created_by = auth.uid()
);

-- Add policy for teachers/admins to view all courses (even unpublished)
DROP POLICY IF EXISTS "Teachers and admins can view all courses" ON public.courses;
CREATE POLICY "Teachers and admins can view all courses" 
ON public.courses FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Update lesson policies to properly check roles
DROP POLICY IF EXISTS "Teachers and admins can create lessons" ON public.lessons;
CREATE POLICY "Teachers and admins can create lessons" 
ON public.lessons FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Add policy for teachers/admins to update lessons
DROP POLICY IF EXISTS "Teachers and admins can update lessons" ON public.lessons;
CREATE POLICY "Teachers and admins can update lessons" 
ON public.lessons FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
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
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Add policy for admins to manage achievements
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements" 
ON public.achievements FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Add policy for admins to view all user data
DROP POLICY IF EXISTS "Admins can view all user data" ON public.profiles;
CREATE POLICY "Admins can view all user data" 
ON public.profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Add policy for admins to view all enrollments
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
CREATE POLICY "Admins can view all enrollments" 
ON public.enrollments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Add policy for admins to view all user progress
DROP POLICY IF EXISTS "Admins can view all user progress" ON public.user_progress;
CREATE POLICY "Admins can view all user progress" 
ON public.user_progress FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Add policy for teachers to view progress for students in their courses
DROP POLICY IF EXISTS "Teachers can view progress for their courses" ON public.user_progress;
CREATE POLICY "Teachers can view progress for their courses" 
ON public.user_progress FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'teacher'
    ) AND
    lesson_id IN (
        SELECT l.id FROM public.lessons l
        JOIN public.courses c ON l.course_id = c.id
        WHERE c.created_by = auth.uid()
    )
);