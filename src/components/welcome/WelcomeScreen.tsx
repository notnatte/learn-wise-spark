import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface UserProgress {
  completedLessons: number;
  totalLessons: number;
  currentStreak: number;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  recommendedCourses: {
    id: string;
    title: string;
    progress: number;
  }[];
}

interface WelcomeScreenProps {
  userName: string;
  userProgress: UserProgress;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  userName,
  userProgress
}) => {
  const navigate = useNavigate();

  const progressPercentage = (userProgress.completedLessons / userProgress.totalLessons) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, {userName}! <Sparkles className="inline-block h-8 w-8 text-yellow-500" />
            </h1>
            <p className="text-muted-foreground mt-2">
              Continue your learning journey
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Trophy className="h-5 w-5 mr-2" />
            {userProgress.currentStreak} Day Streak
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{userProgress.completedLessons}</div>
                  <div className="text-sm text-muted-foreground">Lessons Completed</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{userProgress.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommended Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProgress.recommendedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={course.progress} className="w-24 h-2" />
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProgress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-2 hover:bg-muted rounded-lg"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button size="lg" onClick={() => navigate('/courses')}>
            <BookOpen className="h-5 w-5 mr-2" />
            Explore Courses
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/ai-tutor')}>
            <Sparkles className="h-5 w-5 mr-2" />
            Chat with AI Tutor
          </Button>
        </div>
      </motion.div>
    </div>
  );
}; 