
import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
}

const StreakBadge = ({ streak }: StreakBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-full">
      <Flame className="h-5 w-5 text-accent" fill="currentColor" />
      <span className="font-medium">{streak} day streak</span>
    </div>
  );
};

export default StreakBadge;
