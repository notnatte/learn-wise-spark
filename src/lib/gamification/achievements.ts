
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

// Mock data for demonstration purposes since we don't have actual tables in Supabase
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Lesson',
    description: 'Complete your first lesson',
    points: 50,
    icon: 'book',
    category: 'learning',
    requirements: {
      type: 'lessons_completed',
      value: 1
    }
  },
  {
    id: '2',
    title: 'Week Streak',
    description: 'Log in for 7 consecutive days',
    points: 100,
    icon: 'calendar',
    category: 'streak',
    requirements: {
      type: 'streak_days',
      value: 7
    }
  }
];

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
      console.log(`Awarded ${points} points to user ${userId} for ${action}`);
      // Actual implementation would store this in Supabase
      // Since table doesn't exist, we're just logging it

      // Check for new achievements
      await this.checkAchievements(userId);
    }

    return points;
  }

  static async checkAchievements(userId: string): Promise<Achievement[]> {
    // Mock user stats for demonstration
    const userStats = {
      lessons_completed: 5,
      current_streak: 3,
      average_quiz_score: 85,
      peer_helps: 2
    };

    const newAchievements: Achievement[] = [];

    for (const achievement of mockAchievements) {
      // Mock implementation to check if user already has this achievement
      const hasAchievement = false;

      if (hasAchievement) continue;

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
        
        console.log(`User ${userId} earned achievement: ${achievement.title}`);
        // Actual implementation would store this in Supabase
      }
    }

    return newAchievements;
  }

  static async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    // Mock leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        userId: '1',
        username: 'user1',
        totalPoints: 500,
        rank: 1,
        achievements: 5,
        streak: 10
      },
      {
        userId: '2',
        username: 'user2',
        totalPoints: 450,
        rank: 2,
        achievements: 4,
        streak: 8
      }
    ];

    return mockLeaderboard.slice(0, limit);
  }

  static async getUserStats(userId: string): Promise<{
    totalPoints: number;
    rank: number;
    achievements: Achievement[];
    streak: number;
  }> {
    // Mock user stats
    return {
      totalPoints: 350,
      rank: 3,
      achievements: mockAchievements.slice(0, 1),
      streak: 5
    };
  }
}
