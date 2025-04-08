
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color?: string;
  onClick: () => void;
}

const CourseCard = ({ 
  title, 
  description, 
  progress, 
  icon,
  color = "bg-primary/10", 
  onClick 
}: CourseCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-0">
        <div className="p-6">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", color)}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <Button onClick={onClick} className="w-full gap-2">
            Continue Learning
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
