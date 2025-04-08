
import React, { useState } from 'react';
import { Calendar, Clock, Award, TrendingUp, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProgressRing from '@/components/ProgressRing';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const subjects = [
  { id: 'math', name: 'Mathematics', progress: 78, color: 'text-blue-500' },
  { id: 'physics', name: 'Physics', progress: 64, color: 'text-purple-500' },
  { id: 'chemistry', name: 'Chemistry', progress: 42, color: 'text-green-500' },
];

const recentActivities = [
  { 
    id: 1, 
    type: 'quiz', 
    subject: 'Mathematics', 
    title: 'Quadratic Equations', 
    score: '8/10', 
    date: '2023-04-08', 
    time: '10:30 AM' 
  },
  { 
    id: 2, 
    type: 'lesson', 
    subject: 'Physics', 
    title: 'Newton\'s Laws of Motion', 
    completion: 100, 
    date: '2023-04-07', 
    time: '3:45 PM' 
  },
  { 
    id: 3, 
    type: 'practice', 
    subject: 'Chemistry', 
    title: 'Balancing Chemical Equations', 
    score: '15/20', 
    date: '2023-04-06', 
    time: '2:15 PM' 
  },
  { 
    id: 4, 
    type: 'ai-session', 
    subject: 'Mathematics', 
    title: 'Calculus Concepts', 
    duration: '28 mins', 
    date: '2023-04-05', 
    time: '4:50 PM' 
  },
];

const badgeData = [
  { id: 1, name: '7-Day Streak', description: 'Completed 7 consecutive days of learning', icon: Calendar, color: 'bg-blue-500' },
  { id: 2, name: 'Quick Learner', description: 'Completed 5 lessons in a single day', icon: Clock, color: 'bg-purple-500' },
  { id: 3, name: 'Perfect Score', description: 'Scored 100% on a quiz', icon: Award, color: 'bg-yellow-500' },
  { id: 4, name: 'Favourite Subject', description: 'Consistently engaging with Mathematics', icon: BookOpen, color: 'bg-red-500' },
  { id: 5, name: 'Dedicated Student', description: 'Spent over 10 hours learning this week', icon: TrendingUp, color: 'bg-green-500' },
];

const Progress = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Learning Progress</h1>
        <p className="text-muted-foreground mt-1">Track your educational journey</p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 sm:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Daily Study Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">8 days</div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-500 font-medium">↑ 2</span> days from last week
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Study Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">14.5 hrs</div>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-500 font-medium">↑ 3.2 hrs</span> from last week
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">24</div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-500 font-medium">↑ 6</span> from last week
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center sm:flex-row sm:justify-around gap-8 py-6">
              <ProgressRing progress={65} />
              
              <div className="space-y-6 w-full max-w-xs">
                {subjects.map((subject) => (
                  <div key={subject.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          subject.id === 'math' ? 'bg-blue-500' : 
                          subject.id === 'physics' ? 'bg-purple-500' : 
                          'bg-green-500'
                        }`} 
                        style={{ width: `${subject.progress}%` }} 
                      />
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" onClick={() => setActiveTab("subjects")}>View Detailed Stats</Button>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="flex items-start p-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                      {activity.type === 'quiz' && <Award className="h-5 w-5 text-yellow-500" />}
                      {activity.type === 'lesson' && <BookOpen className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'practice' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {activity.type === 'ai-session' && <TrendingUp className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{activity.title}</h3>
                        <span className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()} - {activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.subject}</p>
                      <div className="mt-1">
                        {activity.type === 'quiz' && (
                          <span className="text-sm font-medium">Score: <span className="text-green-600">{activity.score}</span></span>
                        )}
                        {activity.type === 'lesson' && (
                          <span className="text-sm font-medium">Completion: <span className="text-green-600">{activity.completion}%</span></span>
                        )}
                        {activity.type === 'practice' && (
                          <span className="text-sm font-medium">Score: <span className="text-green-600">{activity.score}</span></span>
                        )}
                        {activity.type === 'ai-session' && (
                          <span className="text-sm font-medium">Duration: <span className="text-purple-600">{activity.duration}</span></span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2 flex-shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">View All Activity</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="overflow-hidden">
                <div className={`h-2 ${
                  subject.id === 'math' ? 'bg-blue-500' : 
                  subject.id === 'physics' ? 'bg-purple-500' : 
                  'bg-green-500'
                }`} />
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium">Progress: {subject.progress}%</p>
                      <p className="text-muted-foreground">Last studied: Yesterday</p>
                    </div>
                    <div className="w-16 h-16">
                      <div className="relative w-full h-full">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          ></circle>
                          <circle
                            className={`${
                              subject.id === 'math' ? 'text-blue-500' : 
                              subject.id === 'physics' ? 'text-purple-500' : 
                              'text-green-500'
                            } progress-ring stroke-current`}
                            strokeWidth="10"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray={`${subject.progress * 2.51} 251.2`}
                            strokeDashoffset="0"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                          {subject.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed Lessons</span>
                      <span>
                        {subject.id === 'math' ? '8/10' : 
                         subject.id === 'physics' ? '6/12' : 
                         '5/8'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quiz Average</span>
                      <span>
                        {subject.id === 'math' ? '85%' : 
                         subject.id === 'physics' ? '78%' : 
                         '72%'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Spent</span>
                      <span>
                        {subject.id === 'math' ? '5.2 hrs' : 
                         subject.id === 'physics' ? '4.8 hrs' : 
                         '3.5 hrs'}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Continue Learning</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {badgeData.map((badge) => (
                  <TooltipProvider key={badge.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center">
                          <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mb-3 hover-scale badge-glow cursor-help`}>
                            <badge.icon className="h-8 w-8 text-white" />
                          </div>
                          <span className="text-sm font-medium text-center">{badge.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="p-3 max-w-xs">
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-semibold mt-6">Upcoming Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-dashed">
              <CardContent className="pt-6 p-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-muted-foreground opacity-70" />
                </div>
                <h3 className="font-medium text-center">Subject Master</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">Complete all lessons in a subject</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">8/10 lessons completed</p>
              </CardContent>
            </Card>
            
            <Card className="border-dashed">
              <CardContent className="pt-6 p-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="h-8 w-8 text-muted-foreground opacity-70" />
                </div>
                <h3 className="font-medium text-center">30-Day Streak</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">Study for 30 consecutive days</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '27%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">8/30 days completed</p>
              </CardContent>
            </Card>
            
            <Card className="border-dashed">
              <CardContent className="pt-6 p-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="h-8 w-8 text-muted-foreground opacity-70" />
                </div>
                <h3 className="font-medium text-center">Quiz Champion</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">Get perfect scores on 5 quizzes</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '40%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">2/5 perfect scores</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Progress;
