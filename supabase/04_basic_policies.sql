-- Create basic policies first (without complex conditions)
-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses policies
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;
CREATE POLICY "Published courses are viewable by everyone" ON public.courses FOR SELECT USING (published = true);

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