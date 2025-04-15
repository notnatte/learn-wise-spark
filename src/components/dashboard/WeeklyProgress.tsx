
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressRing from '@/components/ProgressRing';

const WeeklyProgress = () => {
  return (
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
  );
};

export default WeeklyProgress;
