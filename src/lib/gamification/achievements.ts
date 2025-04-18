import { supabase } from '@/lib/supabase';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: 'learning' | 'streak' | 'social' | 'challenge';
  requirements: {
    type: 'lessons_completed' | 'streak_days' | 'quiz_score' | 'peer_help';
    value: number;
  };
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  earnedAt: Date;
  progress: number; // 0-100
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  rank: number;
  achievements: number;
  streak: number;
}

export class GamificationSystem {
  private static readonly POINTS_PER_LESSON = 10;
  private static readonly POINTS_PER_STREAK_DAY = 5;
  private static readonly POINTS_PER_ACHIEVEMENT = 50;
  private static readonly POINTS_PER_PEER_HELP = 20;

  static async awardPoints(userId: string, action: string, value: number = 1): Promise<number> {
    let points = 0;

    switch (action) {
      case 'lesson_completed':
        points = this.POINTS_PER_LESSON * value;
        break;
      case 'streak_day':
        points = this.POINTS_PER_STREAK_DAY * value;
        break;
      case 'achievement_earned':
        points = this.POINTS_PER_ACHIEVEMENT * value;
        break;
      case 'peer_help':
        points = this.POINTS_PER_PEER_HELP * value;
        break;
    }

    if (points > 0) {
      const { data, error } = await supabase
        .from('user_points')
        .upsert({
          user_id: userId,
          points: points,
          action: action,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error awarding points:', error);
        return 0;
      }

      // Check for new achievements
      await this.checkAchievements(userId);
    }

    return points;
  }

  static async checkAchievements(userId: string): Promise<Achievement[]> {
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userStats) return [];

    const { data: achievements } = await supabase
      .from('achievements')
      .select('*');

    if (!achievements) return [];

    const newAchievements: Achievement[] = [];

    for (const achievement of achievements) {
      const { data: existingAchievement } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();

      if (existingAchievement) continue;

      let progress = 0;
      switch (achievement.requirements.type) {
        case 'lessons_completed':
          progress = (userStats.lessons_completed / achievement.requirements.value) * 100;
          break;
        case 'streak_days':
          progress = (userStats.current_streak / achievement.requirements.value) * 100;
          break;
        case 'quiz_score':
          progress = (userStats.average_quiz_score / achievement.requirements.value) * 100;
          break;
        case 'peer_help':
          progress = (userStats.peer_helps / achievement.requirements.value) * 100;
          break;
      }

      if (progress >= 100) {
        newAchievements.push(achievement);
        await this.awardPoints(userId, 'achievement_earned');
        
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            earned_at: new Date().toISOString(),
            progress: 100
          });
      }
    }

    return newAchievements;
  }

  static async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const { data: leaderboard } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        total_points,
        achievements_earned,
        current_streak,
        users (
          username
        )
      `)
      .order('total_points', { ascending: false })
      .limit(limit);

    if (!leaderboard) return [];

    return leaderboard.map((entry, index) => ({
      userId: entry.user_id,
      username: entry.users.username,
      totalPoints: entry.total_points,
      rank: index + 1,
      achievements: entry.achievements_earned,
      streak: entry.current_streak
    }));
  }

  static async getUserStats(userId: string): Promise<{
    totalPoints: number;
    rank: number;
    achievements: Achievement[];
    streak: number;
  }> {
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select(`
        achievement_id,
        earned_at,
        achievements (*)
      `)
      .eq('user_id', userId);

    const { data: rankData } = await supabase
      .from('user_stats')
      .select('user_id')
      .gt('total_points', userStats?.total_points || 0)
      .count();

    return {
      totalPoints: userStats?.total_points || 0,
      rank: (rankData?.count || 0) + 1,
      achievements: userAchievements?.map(ua => ua.achievements) || [],
      streak: userStats?.current_streak || 0
    };
  }
} 