
import React from 'react';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  title: string;
  icon: React.ReactNode;
  unlocked: boolean;
  description?: string;
}

const AchievementBadge = ({ 
  title, 
  icon, 
  unlocked,
  description
}: AchievementBadgeProps) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-2",
          unlocked 
            ? "bg-accent badge-glow" 
            : "bg-muted"
        )}
      >
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center",
          unlocked ? "text-accent-foreground" : "text-muted-foreground"
        )}>
          {icon}
        </div>
      </div>
      <h4 className="text-sm font-medium text-center">{title}</h4>
      {description && (
        <p className="text-xs text-muted-foreground text-center mt-1">{description}</p>
      )}
    </div>
  );
};

export default AchievementBadge;
