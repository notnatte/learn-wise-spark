
import { supabase } from '@/integrations/supabase/client';

// Define types
interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress: number; // percentage 0-100
  last_accessed: string;
}

interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
}

// Mock data
const mockProgress: UserProgress[] = [
  {
    id: '1',
    user_id: 'user-123',
    lesson_id: 'lesson-1',
    completed: true,
    progress: 100,
    last_accessed: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user-123',
    lesson_id: 'lesson-2',
    completed: false,
    progress: 50,
    last_accessed: new Date().toISOString()
  }
];

const mockStreaks: UserStreak[] = [
  {
    id: '1',
    user_id: 'user-123',
    current_streak: 3,
    longest_streak: 7,
    last_activity_date: new Date().toISOString()
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Lesson',
    description: 'Complete your first lesson',
    icon: 'graduation-cap',
    points: 50
  },
  {
    id: '2',
    title: 'Week Streak',
    description: 'Maintain a 7-day streak',
    icon: 'calendar',
    points: 100
  }
];

const mockUserAchievements: UserAchievement[] = [
  {
    id: '1',
    user_id: 'user-123',
    achievement_id: '1',
    earned_at: new Date().toISOString()
  }
];

// Progress service
export const progressService = {
  // Get user progress for a specific lesson
  async getLessonProgress(lessonId: string): Promise<UserProgress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const progress = mockProgress.find(p => p.user_id === user.id && p.lesson_id === lessonId);
    return progress || null;
  },
  
  // Update user progress for a lesson
  async updateLessonProgress(lessonId: string, progress: number, completed: boolean): Promise<UserProgress> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const existingProgress = mockProgress.find(p => p.user_id === user.id && p.lesson_id === lessonId);
    
    if (existingProgress) {
      // Update existing
      existingProgress.progress = progress;
      existingProgress.completed = completed;
      existingProgress.last_accessed = new Date().toISOString();
      return existingProgress;
    } else {
      // Create new
      const newProgress: UserProgress = {
        id: Math.random().toString(36).substring(7),
        user_id: user.id,
        lesson_id: lessonId,
        progress,
        completed,
        last_accessed: new Date().toISOString()
      };
      
      return newProgress;
    }
  },
  
  // Get all lessons with progress for current user
  async getAllLessonProgress(): Promise<UserProgress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    return mockProgress.filter(p => p.user_id === user.id);
  },
  
  // Get user's streak
  async getUserStreak(): Promise<UserStreak | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const streak = mockStreaks.find(s => s.user_id === user.id);
    return streak || null;
  },
  
  // Update user's streak
  async updateStreak(): Promise<UserStreak> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const existingStreak = mockStreaks.find(s => s.user_id === user.id);
    
    if (existingStreak) {
      // Update existing
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = existingStreak.last_activity_date.split('T')[0];
      
      if (today !== lastActivity) {
        existingStreak.current_streak += 1;
        if (existingStreak.current_streak > existingStreak.longest_streak) {
          existingStreak.longest_streak = existingStreak.current_streak;
        }
        existingStreak.last_activity_date = new Date().toISOString();
      }
      
      return existingStreak;
    } else {
      // Create new
      const newStreak: UserStreak = {
        id: Math.random().toString(36).substring(7),
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: new Date().toISOString()
      };
      
      return newStreak;
    }
  },
  
  // Get user's achievements
  async getUserAchievements(): Promise<Achievement[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const userAchievementIds = mockUserAchievements
      .filter(ua => ua.user_id === user.id)
      .map(ua => ua.achievement_id);
    
    return mockAchievements.filter(a => userAchievementIds.includes(a.id));
  },
  
  // Get all available achievements
  async getAllAchievements(): Promise<Achievement[]> {
    return mockAchievements;
  }
};
