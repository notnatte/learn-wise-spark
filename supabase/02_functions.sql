-- Create functions and triggers
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