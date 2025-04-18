
import React from 'react';
import { Play, Zap, Eye, BookMarked } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
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
          
          <Button 
            className="w-full flex justify-start" 
            variant="outline" 
            onClick={() => handleNavigate('/ai-tutor')}
          >
            <Zap className="h-5 w-5 mr-2 text-purple-500" />
            <span>Ask AI Tutor</span>
          </Button>
          
          <Button 
            className="w-full flex justify-start" 
            variant="outline" 
            onClick={() => handleNavigate('/progress')}
          >
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
  );
};

export default QuickActions;
