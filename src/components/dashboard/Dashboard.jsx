import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    lessonsCompleted: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Get user's enrolled courses
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);
        
        if (enrollments && enrollments.length > 0) {
          const courseIds = enrollments.map(e => e.course_id);
          
          // Get course details
          const { data: courses } = await supabase
            .from('courses')
            .select('id, title, description, cover_image')
            .in('id', courseIds);
          
          if (courses) {
            // For each course, get progress
            const coursesWithProgress = await Promise.all(courses.map(async (course) => {
              const { data: progress } = await supabase
                .from('user_progress')
                .select('lesson_id, progress, completed')
                .eq('user_id', user.id)
                .eq('course_id', course.id);
              
              // Get total lessons for this course
              const { count: totalLessons } = await supabase
                .from('lessons')
                .select('id', { count: 'exact' })
                .eq('course_id', course.id);
              
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
            
            setEnrolledCourses(coursesWithProgress);
          }
          
          // Get recent activity
          const { data: activity } = await supabase
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
          
          if (activity) {
            setRecentActivity(activity);
          }
          
          // Get stats
          const { data: userStats } = await supabase
            .from('user_stats')
            .select('courses_completed, lessons_completed, total_time_spent')
            .eq('user_id', user.id)
            .single();
          
          if (userStats) {
            setStats({
              coursesCompleted: userStats.courses_completed || 0,
              lessonsCompleted: userStats.lessons_completed || 0,
              totalTimeSpent: userStats.total_time_spent || 0
            });
          }
        }
      }
      
      setLoading(false);
    }
    
    loadDashboardData();
  }, []);

  // Format time spent (minutes) to hours and minutes
  const formatTimeSpent = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.user_metadata?.full_name || 'Student'}!
        </h1>
        <p className="mt-2">
          Continue your learning journey and track your progress.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Courses Enrolled</h2>
              <p className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Lessons Completed</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.lessonsCompleted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Time Spent Learning</h2>
              <p className="text-3xl font-bold text-gray-900">{formatTimeSpent(stats.totalTimeSpent)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Continue Learning Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Learning</h2>
      
      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No courses yet</h3>
          <p className="mt-1 text-gray-500">
            You haven't enrolled in any courses yet. Start your learning journey today!
          </p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {enrolledCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-36 bg-gray-200 relative">
                {course.cover_image ? (
                  <img 
                    src={course.cover_image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
                
                {/* Progress badge */
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-700 shadow">
                  {course.progress}% complete
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                {/* Progress bar */
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {course.completedLessons} of {course.totalLessons} lessons
                  </span>
                  
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Recent Activity Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
      
      {recentActivity.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No recent activity to show.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map(activity => {
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
                <li key={activity.id} className="p-4 hover:bg-gray-50">
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
                    <div className="min-w-0 flex-1 px-4 flex justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          {activity.completed ? 'Completed' : 'Progressed in'}{' '}
                          <Link to={`/lessons/${activity.lessons?.id}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                            {activity.lessons?.title || 'Lesson'}
                          </Link>{' '}
                          in{' '}
                          <Link to={`/courses/${activity.courses?.id}`} className="font-medium text-gray-900">
                            {activity.courses?.title || 'Course'}
                          </Link>
                        </p>
                        {activity.progress && !activity.completed && (
                          <p className="mt-1 text-xs text-gray-500">
                            Progress: {activity.progress}%
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {timeAgo}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {/* Recommended Courses Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Recommended For You</h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated from an API call, showing static content for now */}
            <div className="group relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="JavaScript Fundamentals" 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-medium text-white">JavaScript Fundamentals</h3>
                  <p className="mt-1 text-sm text-gray-300">Master the basics of JavaScript programming</p>
                </div>
              </div>
              <Link to="/courses/1" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View JavaScript Fundamentals</span>
              </Link>
            </div>
            
            <div className="group relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="React for Beginners" 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-medium text-white">React for Beginners</h3>
                  <p className="mt-1 text-sm text-gray-300">Build modern web applications with React</p>
                </div>
              </div>
              <Link to="/courses/2" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View React for Beginners</span>
              </Link>
            </div>
            
            <div className="group relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Full Stack Development" 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-medium text-white">Full Stack Development</h3>
                  <p className="mt-1 text-sm text-gray-300">Learn to build complete web applications</p>
                </div>
              </div>
              <Link to="/courses/3" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View Full Stack Development</span>
              </Link>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse All Courses
              <svg className="ml-2 -mr-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );