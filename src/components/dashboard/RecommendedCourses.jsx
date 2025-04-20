import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function RecommendedCourses() {
  const [loading, setLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecommendedCourses() {
      setLoading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Get user's enrolled courses
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);
        
        const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];
        
        // Get user's interests (if you have a user_interests table)
        const { data: userInterests } = await supabase
          .from('user_interests')
          .select('interest')
          .eq('user_id', user.id);
        
        const interests = userInterests?.map(ui => ui.interest) || [];
        
        // Get recommended courses based on interests and not already enrolled
        let query = supabase
          .from('courses')
          .select('id, title, description, cover_image, category, difficulty, rating, instructor_name')
          .order('rating', { ascending: false });
        
        // Exclude enrolled courses
        if (enrolledCourseIds.length > 0) {
          query = query.not('id', 'in', `(${enrolledCourseIds.join(',')})`);
        }
        
        // Filter by interests if available
        if (interests.length > 0) {
          query = query.or(interests.map(interest => `category.eq.${interest}`).join(','));
        }
        
        const { data: courses, error: coursesError } = await query.limit(6);
        
        if (coursesError) throw coursesError;
        
        // If no courses match interests or not enough, get popular courses
        if (!courses || courses.length < 6) {
          const { data: popularCourses } = await supabase
            .from('courses')
            .select('id, title, description, cover_image, category, difficulty, rating, instructor_name')
            .order('rating', { ascending: false })
            .limit(6 - (courses?.length || 0));
          
          // Combine and remove duplicates
          const allCourses = [...(courses || []), ...(popularCourses || [])];
          const uniqueCourses = allCourses.filter((course, index, self) =>
            index === self.findIndex((c) => c.id === course.id)
          );
          
          setRecommendedCourses(uniqueCourses);
        } else {
          setRecommendedCourses(courses);
        }
      } catch (err) {
        console.error('Error loading recommended courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadRecommendedCourses();
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
        Error loading recommendations: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4">
        <h2 className="text-white text-xl font-bold">Recommended For You</h2>
      </div>
      <div className="p-6">
        {recommendedCourses.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-500 mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No recommendations yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              As you continue learning, we'll recommend courses based on your interests and progress.
            </p>
            <Link
              to="/courses"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Browse All Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map(course => (
              <div key={course.id} className="group relative">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                  {course.cover_image ? (
                    <img 
                      src={course.cover_image} 
                      alt={course.title} 
                      className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-500">
                      <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                      {course.category || 'General'}
                    </span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-gray-600 ml-1">{course.rating || '4.5'}</span>
                    </div>
                  </div>
                  <h3 className="mt-1 text-lg font-medium text-gray-900">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span>{course.instructor_name || 'Expert Instructor'}</span>
                    <span className="mx-1">•</span>
                    <span>{course.difficulty || 'Beginner'}</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-3 block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}