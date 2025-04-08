
import React from 'react';
import { BookOpen, Award, Clock, Calendar, Bell, Eye, BookMarked, BadgeCheck, Zap, Star, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressRing from '@/components/ProgressRing';
import StreakBadge from '@/components/StreakBadge';
import CourseCard from '@/components/CourseCard';
import AchievementBadge from '@/components/AchievementBadge';

const Dashboard = () => {
  const recentActivity = [
    { id: 1, icon: <BadgeCheck className="h-5 w-5 text-green-500" />, title: "New Badge Earned", description: "You earned the 7-Day Streak badge", time: "2 hours ago" },
    { id: 2, icon: <BookOpen className="h-5 w-5 text-blue-500" />, title: "Lesson Completed", description: "Completed Quadratic Equations lesson", time: "Yesterday" },
    { id: 3, icon: <Star className="h-5 w-5 text-yellow-500" />, title: "Quiz Result", description: "Scored 90% on Physics quiz", time: "2 days ago" },
    { id: 4, icon: <Clock className="h-5 w-5 text-purple-500" />, title: "Study Session", description: "Studied for 45 minutes", time: "3 days ago" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Liya!</h1>
          <p className="text-muted-foreground mt-1">Here's your learning progress</p>
        </div>
        <StreakBadge streak={8} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Time Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">2 hrs</div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500 font-medium">↑ 25%</span> from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Lessons Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">3</div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500 font-medium">↑ 2</span> new since last week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">12:30 PM</div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-yellow-500 font-medium">Physics Quiz</span> in 2 hours
            </div>
          </CardContent>
        </Card>
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
                  <span className="text-sm font-medium">Mathematics</span>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Physics</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Chemistry</span>
                  <span className="text-sm text-muted-foreground">42%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              
              <Button className="w-full" onClick={() => window.location.href = '/progress'}>View Detailed Stats</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              <Button className="w-full flex justify-start" variant="outline">
                <Play className="h-5 w-5 mr-2 text-green-500" />
                <span>Start Next Lesson</span>
              </Button>
              
              <Button className="w-full flex justify-start" variant="outline" onClick={() => window.location.href = '/ai-tutor'}>
                <Zap className="h-5 w-5 mr-2 text-purple-500" />
                <span>Ask AI Tutor</span>
              </Button>
              
              <Button className="w-full flex justify-start" variant="outline" onClick={() => window.location.href = '/progress'}>
                <Eye className="h-5 w-5 mr-2 text-blue-500" />
                <span>View Progress</span>
              </Button>
              
              <Button className="w-full flex justify-start" variant="outline">
                <BookMarked className="h-5 w-5 mr-2 text-yellow-500" />
                <span>Homework Help</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="flex items-start p-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => window.location.href = '/progress'}>View All Activity</Button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recommended Lessons</h2>
          <Button variant="outline" onClick={() => window.location.href = '/explore'}>View All Lessons</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            title="Quadratic Equations"
            description="Mathematics"
            progress={75}
            icon={<BookOpen className="h-6 w-6 text-blue-500" />}
            color="bg-blue-500/10"
            onClick={() => console.log('Lesson clicked')}
          />
          
          <CourseCard
            title="Newton's Laws of Motion"
            description="Physics"
            progress={45}
            icon={<BookOpen className="h-6 w-6 text-purple-500" />}
            color="bg-purple-500/10"
            onClick={() => console.log('Lesson clicked')}
          />
          
          <CourseCard
            title="Chemical Reactions"
            description="Chemistry"
            progress={20}
            icon={<BookOpen className="h-6 w-6 text-green-500" />}
            color="bg-green-500/10"
            onClick={() => console.log('Lesson clicked')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
