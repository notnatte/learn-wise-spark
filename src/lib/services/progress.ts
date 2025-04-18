import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
type LearningStreak = Database['public']['Tables']['learning_streaks']['Row'];

export interface ProgressStats {
  totalLessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  recentProgress: UserProgress[];
}

export const progressService = {
  // Mark a lesson as completed
  async completeLesson(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Check if progress already exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();
    
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Get user's progress statistics
  async getProgressStats(): Promise<ProgressStats> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Get completed lessons count
    const { data: completedLessons, error: completedError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true);
    
    if (completedError) throw completedError;
    
    // Get learning streak
    const { data: streak, error: streakError } = await supabase
      .from('learning_streaks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (streakError && streakError.code !== 'PGRST116') throw streakError;
    
    // Get achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', user.id);
    
    if (achievementsError) throw achievementsError;
    
    // Get recent progress
    const { data: recentProgress, error: recentError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);
    
    if (recentError) throw recentError;
    
    return {
      totalLessonsCompleted: completedLessons?.length || 0,
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
      achievements: achievements?.map(a => a.achievements) || [],
      recentProgress: recentProgress || [],
    };
  },
  
  // Update learning streak
  async updateLearningStreak() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get current streak
    const { data: currentStreak, error: streakError } = await supabase
      .from('learning_streaks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (streakError && streakError.code !== 'PGRST116') throw streakError;
    
    if (!currentStreak) {
      // Create new streak
      const { data, error } = await supabase
        .from('learning_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today.toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
    
    const lastActivity = new Date(currentStreak.last_activity_date);
    lastActivity.setHours(0, 0, 0, 0);
    
    const daysSinceLastActivity = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastActivity === 0) {
      // Already updated today
      return currentStreak;
    } else if (daysSinceLastActivity === 1) {
      // Consecutive day
      const newStreak = currentStreak.current_streak + 1;
      const { data, error } = await supabase
        .from('learning_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, currentStreak.longest_streak),
          last_activity_date: today.toISOString(),
        })
        .eq('id', currentStreak.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Streak broken
      const { data, error } = await supabase
        .from('learning_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: currentStreak.longest_streak,
          last_activity_date: today.toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Check and award achievements
  async checkAchievements() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Get user's progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true);
    
    if (progressError) throw progressError;
    
    // Get all achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');
    
    if (achievementsError) throw achievementsError;
    
    // Get user's current achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id);
    
    if (userAchievementsError) throw userAchievementsError;
    
    const awardedAchievementIds = new Set(
      userAchievements?.map(a => a.achievement_id) || []
    );
    
    const completedLessonsCount = progress?.length || 0;
    const newAchievements: Achievement[] = [];
    
    // Check each achievement
    for (const achievement of achievements || []) {
      if (awardedAchievementIds.has(achievement.id)) continue;
      
      let shouldAward = false;
      
      switch (achievement.type) {
        case 'lessons_completed':
          shouldAward = completedLessonsCount >= achievement.requirement;
          break;
        // Add more achievement types here
      }
      
      if (shouldAward) {
        newAchievements.push(achievement);
        
        // Award the achievement
        await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: achievement.id,
            awarded_at: new Date().toISOString(),
          });
      }
    }
    
    return newAchievements;
  },
}; 