-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE profiles (
          id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
          full_name TEXT,
          email TEXT,
          grade TEXT,
          favorite_subject TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create badges table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'badges') THEN
        CREATE TABLE badges (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          color TEXT,
          earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create learning stats table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'learning_stats') THEN
        CREATE TABLE learning_stats (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users NOT NULL,
          lessons_completed INTEGER DEFAULT 0,
          quizzes_taken INTEGER DEFAULT 0,
          average_score FLOAT DEFAULT 0,
          study_streak INTEGER DEFAULT 0,
          learning_time FLOAT DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create learning goals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'learning_goals') THEN
        CREATE TABLE learning_goals (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users NOT NULL,
          title TEXT NOT NULL,
          progress FLOAT DEFAULT 0,
          color TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create subjects table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subjects') THEN
        CREATE TABLE subjects (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          color TEXT
        );
    END IF;
END
$$;

-- Create lessons table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lessons') THEN
        CREATE TABLE lessons (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          subject_id UUID REFERENCES subjects NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          content TEXT,
          duration INTEGER, -- in minutes
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create quizzes table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quizzes') THEN
        CREATE TABLE quizzes (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          lesson_id UUID REFERENCES lessons,
          title TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create quiz questions table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quiz_questions') THEN
        CREATE TABLE quiz_questions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          quiz_id UUID REFERENCES quizzes NOT NULL,
          question TEXT NOT NULL,
          question_type TEXT NOT NULL, -- multiple_choice, true_false, etc.
          points INTEGER DEFAULT 1
        );
    END IF;
END
$$;

-- Create quiz answers table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quiz_answers') THEN
        CREATE TABLE quiz_answers (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          question_id UUID REFERENCES quiz_questions NOT NULL,
          answer_text TEXT NOT NULL,
          is_correct BOOLEAN DEFAULT FALSE
        );
    END IF;
END
$$;

-- Create user quiz attempts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_quiz_attempts') THEN
        CREATE TABLE user_quiz_attempts (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users NOT NULL,
          quiz_id UUID REFERENCES quizzes NOT NULL,
          score FLOAT,
          completed BOOLEAN DEFAULT FALSE,
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END
$$;

-- Create user lesson progress table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_lesson_progress') THEN
        CREATE TABLE user_lesson_progress (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users NOT NULL,
          lesson_id UUID REFERENCES lessons NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          progress FLOAT DEFAULT 0,
          last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create messages table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
        CREATE TABLE messages (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          sender_id UUID REFERENCES auth.users NOT NULL,
          receiver_id UUID REFERENCES auth.users,
          group_id UUID, -- For group messages
          content TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create message groups table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'message_groups') THEN
        CREATE TABLE message_groups (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create message group members table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'message_group_members') THEN
        CREATE TABLE message_group_members (
          group_id UUID REFERENCES message_groups NOT NULL,
          user_id UUID REFERENCES auth.users NOT NULL,
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          PRIMARY KEY (group_id, user_id)
        );
    END IF;
END
$$;

-- Enable RLS on tables
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS message_group_members ENABLE ROW LEVEL SECURITY;

-- Create profile policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" 
        ON profiles FOR SELECT 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" 
        ON profiles FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
END
$$;

-- Create trigger to create profile on signup if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE OR REPLACE FUNCTION public.handle_new_user() 
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, full_name, email)
          VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
          
          INSERT INTO public.learning_stats (user_id)
          VALUES (new.id);
          
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    END IF;
END
$$;

-- Insert sample data for subjects if the table is empty
INSERT INTO subjects (name, description, icon, color)
SELECT 'Mathematics', 'Learn algebra, geometry, calculus and more', 'calculator', 'bg-blue-500'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'Mathematics');

INSERT INTO subjects (name, description, icon, color)
SELECT 'Physics', 'Explore mechanics, electricity, and quantum physics', 'atom', 'bg-purple-500'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'Physics');

INSERT INTO subjects (name, description, icon, color)
SELECT 'Chemistry', 'Study elements, compounds, and chemical reactions', 'flask', 'bg-green-500'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'Chemistry');

INSERT INTO subjects (name, description, icon, color)
SELECT 'Biology', 'Discover living organisms, ecosystems, and genetics', 'leaf', 'bg-red-500'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'Biology');

INSERT INTO subjects (name, description, icon, color)
SELECT 'Literature', 'Analyze classic and modern literary works', 'book', 'bg-yellow-500'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'Literature');