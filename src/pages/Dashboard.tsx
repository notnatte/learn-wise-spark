
import React from 'react';
import StreakBadge from '@/components/StreakBadge';
import StatsCards from '@/components/dashboard/StatsCards';
import WeeklyProgress from '@/components/dashboard/WeeklyProgress';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import RecommendedLessons from '@/components/dashboard/RecommendedLessons';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Liya!</h1>
          <p className="text-muted-foreground mt-1">Here's your learning progress</p>
        </div>
        <StreakBadge streak={8} />
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WeeklyProgress />
        <QuickActions />
      </div>
      
      <RecentActivity />
      
      <RecommendedLessons />
    </div>
  );
};

export default Dashboard;
