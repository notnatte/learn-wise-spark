
import React from 'react';
import { Calendar, Lightbulb, Award, BookOpen, BookText, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressRing from '@/components/ProgressRing';
import StreakBadge from '@/components/StreakBadge';
import CourseCard from '@/components/CourseCard';
import AchievementBadge from '@/components/AchievementBadge';

const Dashboard = () => {
  const recentAchievements = [
    { id: 1, title: "First Quiz", icon: <BookText className="h-6 w-6" />, unlocked: true },
    { id: 2, title: "3-Day Streak", icon: <Calendar className="h-6 w-6" />, unlocked: true },
    { id: 3, title: "Knowledge Seeker", icon: <Brain className="h-6 w-6" />, unlocked: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
          <p className="text-muted-foreground mt-1">Continue your learning journey today</p>
        </div>
        <StreakBadge streak={3} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center sm:flex-row sm:justify-around gap-6 py-6">
            <ProgressRing progress={68} />
            
            <div className="space-y-6 w-full max-w-xs">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Daily Goal</span>
                  <span className="text-sm text-muted-foreground">2/3 lessons</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Quiz Score</span>
                  <span className="text-sm text-muted-foreground">85/100</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              
              <Button className="w-full">View Detailed Stats</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Tip</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">
                "Taking short breaks between study sessions can improve retention and productivity."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Continue Learning</h2>
          <Button variant="outline">View All Courses</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            title="Mathematics"
            description="Algebra Fundamentals"
            progress={75}
            icon={<BookOpen className="h-6 w-6 text-primary" />}
            color="bg-primary/10"
            onClick={() => console.log('Math course clicked')}
          />
          
          <CourseCard
            title="Science"
            description="Biology: Cell Structure"
            progress={45}
            icon={<Brain className="h-6 w-6 text-secondary" />}
            color="bg-secondary/10"
            onClick={() => console.log('Science course clicked')}
          />
          
          <CourseCard
            title="History"
            description="Ancient Civilizations"
            progress={20}
            icon={<BookText className="h-6 w-6 text-accent" />}
            color="bg-accent/10"
            onClick={() => console.log('History course clicked')}
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Achievements</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
          {recentAchievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.title}
              icon={achievement.icon}
              unlocked={achievement.unlocked}
            />
          ))}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-center">More to unlock!</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
