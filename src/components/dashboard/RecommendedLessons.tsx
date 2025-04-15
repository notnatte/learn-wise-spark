
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';

const RecommendedLessons = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Recommended Lessons</h2>
        <Button variant="outline" onClick={() => window.location.href = '/explore'}>View All Lessons</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard
          title="Quadratic Equations"
          description="Mathematics"
          progress={75}
          icon={<BookOpen className="h-6 w-6 text-blue-500" />}
          color="bg-blue-500/10"
          onClick={() => console.log('Lesson clicked')}
        />
        
        <CourseCard
          title="Newton's Laws of Motion"
          description="Physics"
          progress={45}
          icon={<BookOpen className="h-6 w-6 text-purple-500" />}
          color="bg-purple-500/10"
          onClick={() => console.log('Lesson clicked')}
        />
        
        <CourseCard
          title="Chemical Reactions"
          description="Chemistry"
          progress={20}
          icon={<BookOpen className="h-6 w-6 text-green-500" />}
          color="bg-green-500/10"
          onClick={() => console.log('Lesson clicked')}
        />
      </div>
    </div>
  );
};

export default RecommendedLessons;
