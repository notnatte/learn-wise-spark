
import React from 'react';
import { Play, Zap, Eye, BookMarked, Clock, Brain, HelpCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Zap className="h-5 w-5 mr-2 text-accent" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <Button 
            className="w-full flex justify-start group transition-all duration-200" 
            variant="outline"
          >
            <Play className="h-5 w-5 mr-2 text-green-500 group-hover:scale-110 transition-transform" />
            <span>Continue Learning</span>
          </Button>
          
          <Button 
            className="w-full flex justify-start group transition-all duration-200" 
            variant="outline" 
            onClick={() => handleNavigate('/ai-tutor')}
          >
            <Brain className="h-5 w-5 mr-2 text-purple-500 group-hover:scale-110 transition-transform" />
            <span>Ask AI Tutor</span>
          </Button>
          
          <Button 
            className="w-full flex justify-start group transition-all duration-200" 
            variant="outline" 
            onClick={() => handleNavigate('/progress')}
          >
            <Eye className="h-5 w-5 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
            <span>View Progress</span>
          </Button>
          
          <Button 
            className="w-full flex justify-start group transition-all duration-200" 
            variant="outline"
          >
            <HelpCircle className="h-5 w-5 mr-2 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span>Homework Help</span>
          </Button>
          
          <Button 
            className="w-full flex justify-start group transition-all duration-200" 
            variant="outline"
          >
            <CheckCircle className="h-5 w-5 mr-2 text-secondary group-hover:scale-110 transition-transform" />
            <span>Check Assignments</span>
          </Button>
          
          <Button 
            className="w-full flex justify-start group transition-all duration-200" 
            variant="outline"
          >
            <Clock className="h-5 w-5 mr-2 text-red-500 group-hover:scale-110 transition-transform" />
            <span>Set Study Reminder</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
