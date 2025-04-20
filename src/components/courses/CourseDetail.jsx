import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseDetails, enrollInCourse, getUserEnrollments } from '../../lib/api';

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      
      // Get course details
      const { course, error } = await getCourseDetails(courseId);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      setCourse(course);
      
      // Check if user is enrolled
      const { enrollments, error: enrollmentError } = await getUserEnrollments();
      
      if (!enrollmentError && enrollments) {
        const enrolled = enrollments.some(e => e.course_id === courseId);
        setIsEnrolled(enrolled);
      }
      
      setLoading(false);
    }
    
    loadCourse();
  }, [courseId]);

  async function handleEnroll() {
    setEnrolling(true);
    
    const { enrollment, error } = await enrollInCourse(courseId);
    
    if (error) {
      alert(`Error enrolling in course: ${error.message}`);
    } else {
      setIsEnrolled(true);
      // Navigate to first lesson if available
      if (course.lessons && course.lessons.length > 0) {
        navigate(`/lessons/${course.lessons[0].id}`);
      }
    }
    
    setEnrolling(false);
  }

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
        Error loading course: {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">Course not found</h3>
        <Link to="/courses" className="text-indigo-600 hover:underline">
          Browse all courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Course Header */}
        <div className="h-64 bg-indigo-100 relative">
          {course.cover_image ? (
            <img 
              src={course.cover_image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-white text-3xl font-bold">{course.title}</h1>
          </div>
        </div>
        
        {/* Course Info */}
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {course.level || 'All Levels'}
            </span>
            
            {course.duration && (
              <span className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {Math.floor(course.duration / 60)}h {course.duration % 60}m
              </span>
            )}
            
            <span className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {course.lessons?.length || 0} Lessons
            </span>
            
            <span className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              {course.profiles?.full_name || course.profiles?.username || 'Instructor'}
            </span>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About this course</h2>
            <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
          </div>
          
          {/* Lessons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            
            {course.lessons && course.lessons.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                {course.lessons
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((lesson, index) => (
                    <div 
                      key={lesson.id}
                      className={`p-4 ${index !== course.lessons.length - 1 ? 'border-b' : ''} hover:bg-gray-50`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-medium mr-3">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-medium">{lesson.title}</h3>
                            <p className="text-sm text-gray-500">
                              {lesson.type === 'video' && 'Video Lesson'}
                              {lesson.type === 'text' && 'Reading Material'}
                              {lesson.type === 'quiz' && 'Quiz'}
                              {lesson.type === 'assignment' && 'Assignment'}
                              {lesson.duration && ` • ${lesson.duration} min`}
                            </p>
                          </div>
                        </div>
                        
                        {isEnrolled ? (
                          <Link 
                            to={`/lessons/${lesson.id}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No lessons available yet.</p>
            )}
          </div>
          
          {/* Enroll Button */}
          {!isEnrolled && (
            <div className="mt-6">
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
              >
                {enrolling ? 'Enrolling...' : 'Enroll in Course'}
              </button>
            </div>
          )}
          
          {/* Continue Learning Button */}
          {isEnrolled && course.lessons && course.lessons.length > 0 && (
            <div className="mt-6">
              <Link
                to={`/lessons/${course.lessons[0].id}`}
                className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Continue Learning
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}