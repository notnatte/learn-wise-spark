
import React from 'react';
import { BadgeCheck, BookOpen, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const recentActivity = [
  { id: 1, icon: <BadgeCheck className="h-5 w-5 text-green-500" />, title: "New Badge Earned", description: "You earned the 7-Day Streak badge", time: "2 hours ago" },
  { id: 2, icon: <BookOpen className="h-5 w-5 text-blue-500" />, title: "Lesson Completed", description: "Completed Quadratic Equations lesson", time: "Yesterday" },
  { id: 3, icon: <Star className="h-5 w-5 text-yellow-500" />, title: "Quiz Result", description: "Scored 90% on Physics quiz", time: "2 days ago" },
  { id: 4, icon: <Clock className="h-5 w-5 text-purple-500" />, title: "Study Session", description: "Studied for 45 minutes", time: "3 days ago" },
];

const RecentActivity = () => {
  return (
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
  );
};

export default RecentActivity;
