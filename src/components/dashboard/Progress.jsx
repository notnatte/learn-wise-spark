import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Progress() {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    overallProgress: 0,
    courseProgress: [],
    recentActivity: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProgressData() {
      setLoading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Get user's enrolled courses
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);
        
        if (enrollmentsError) throw enrollmentsError;
        
        if (!enrollments || enrollments.length === 0) {
          setProgressData({
            overallProgress: 0,
            courseProgress: [],
            recentActivity: []
          });
          setLoading(false);
          return;
        }
        
        const courseIds = enrollments.map(e => e.course_id);
        
        // Get course details
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, description, cover_image')
          .in('id', courseIds);
        
        if (coursesError) throw coursesError;
        
        // For each course, get progress
        const coursesWithProgress = await Promise.all(courses.map(async (course) => {
          const { data: progress, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id, progress, completed')
            .eq('user_id', user.id)
            .eq('course_id', course.id);
          
          if (progressError) throw progressError;
          
          // Get total lessons for this course
          const { count: totalLessons, error: countError } = await supabase
            .from('lessons')
            .select('id', { count: 'exact' })
            .eq('course_id', course.id);
          
          if (countError) throw countError;
          
          // Calculate overall progress
          const completedLessons = progress?.filter(p => p.completed)?.length || 0;
          const overallProgress = totalLessons > 0 
            ? Math.round((completedLessons / totalLessons) * 100) 
            : 0;
          
          return {
            ...course,
            progress: overallProgress,
            completedLessons,
            totalLessons
          };
        }));
        
        // Calculate overall progress across all courses
        const totalLessons = coursesWithProgress.reduce((sum, course) => sum + course.totalLessons, 0);
        const totalCompletedLessons = coursesWithProgress.reduce((sum, course) => sum + course.completedLessons, 0);
        const overallProgress = totalLessons > 0 
          ? Math.round((totalCompletedLessons / totalLessons) * 100) 
          : 0;
        
        // Get recent activity
        const { data: recentActivity, error: activityError } = await supabase
          .from('user_progress')
          .select(`
            id, 
            updated_at, 
            progress, 
            completed,
            lessons(id, title, course_id),
            courses(id, title)
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5);
        
        if (activityError) throw activityError;
        
        setProgressData({
          overallProgress,
          courseProgress: coursesWithProgress,
          recentActivity: recentActivity || []
        });
      } catch (err) {
        console.error('Error loading progress data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadProgressData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        Error loading progress: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h2 className="text-white text-xl font-bold">Overall Progress</h2>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {progressData.overallProgress}% Complete
              </span>
              <span className="text-sm font-medium text-gray-500">
                {progressData.courseProgress.reduce((sum, course) => sum + course.completedLessons, 0)} / 
                {progressData.courseProgress.reduce((sum, course) => sum + course.totalLessons, 0)} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progressData.overallProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Courses in Progress</h3>
              {progressData.courseProgress.length === 0 ? (
                <p className="text-gray-500 italic">No courses enrolled yet.</p>
              ) : (
                <ul className="space-y-3">
                  {progressData.courseProgress
                    .filter(course => course.progress > 0 && course.progress < 100)
                    .slice(0, 3)
                    .map(course => (
                      <li key={course.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{course.title}</span>
                          <span className="text-sm text-gray-500">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-500 h-1.5 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Completed Courses</h3>
              {progressData.courseProgress.filter(course => course.progress === 100).length === 0 ? (
                <p className="text-gray-500 italic">No completed courses yet.</p>
              ) : (
                <ul className="space-y-3">
                  {progressData.courseProgress
                    .filter(course => course.progress === 100)
                    .slice(0, 3)
                    .map(course => (
                      <li key={course.id} className="border rounded-lg p-3 flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-3">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-800">{course.title}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
          <h2 className="text-white text-xl font-bold">Recent Activity</h2>
        </div>
        <div className="p-6">
          {progressData.recentActivity.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">No recent activity to show.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {progressData.recentActivity.map(activity => {
                // Format the date
                const activityDate = new Date(activity.updated_at);
                const now = new Date();
                const diffTime = Math.abs(now - activityDate);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                let timeAgo;
                if (diffDays === 0) {
                  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                  if (diffHours === 0) {
                    const diffMinutes = Math.floor(diffTime / (1000 * 60));
                    timeAgo = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
                  } else {
                    timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                  }
                } else if (diffDays === 1) {
                  timeAgo = 'Yesterday';
                } else if (diffDays < 7) {
                  timeAgo = `${diffDays} days ago`;
                } else {
                  timeAgo = activityDate.toLocaleDateString();
                }
                
                return (
                  <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {activity.completed ? (
                          <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : (
                          <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <p className="text-sm text-gray-800">
                          {activity.completed ? 'Completed' : 'Progressed in'}{' '}
                          <a href={`/lessons/${activity.lessons?.id}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                            {activity.lessons?.title || 'Lesson'}
                          </a>{' '}
                          in{' '}
                          <a href={`/courses/${activity.courses?.id}`} className="font-medium text-gray-900">
                            {activity.courses?.title || 'Course'}
                          </a>
                        </p>
                        {activity.progress && !activity.completed && (
                          <p className="mt-1 text-xs text-gray-500">
                            Progress: {activity.progress}%
                          </p>
                        )}
                      </div>
                      <div className="ml-auto text-sm text-gray-500 whitespace-nowrap">
                        {timeAgo}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}