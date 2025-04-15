
import React from 'react';
import { Clock, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatsCards = () => {
  return (
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
  );
};

export default StatsCards;
