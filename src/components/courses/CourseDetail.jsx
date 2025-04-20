import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseById, enrollInCourse, checkEnrollmentStatus } from '../../lib/api';

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function loadCourseData() {
      setLoading(true);
      
      // Get course details
      const { course, error } = await getCourseById(courseId);
      
      if (error) {
        setError(error.message);
      } else if (course) {
        setCourse(course);
        
        // Check if user is enrolled
        const { enrolled, error: enrollmentError } = await checkEnrollmentStatus(courseId);
        
        if (!enrollmentError) {
          setIsEnrolled(enrolled);
        }
      } else {
        setError('Course not found');
      }
      
      setLoading(false);
    }
    
    loadCourseData();
  }, [courseId]);

  async function handleEnroll() {
    if (isEnrolled) {
      // Navigate to first lesson if already enrolled
      if (course.lessons && course.lessons.length > 0) {
        navigate(`/lessons/${course.lessons[0].id}`);
      }
      return;
    }
    
    setEnrolling(true);
    
    const { error } = await enrollInCourse(courseId);
    
    if (error) {
      setError(error.message);
    } else {
      setIsEnrolled(true);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <p className="mt-2 text-gray-600">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Course Header */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-2xl">
              <div className="flex items-center">
                <Link
                  to="/courses"
                  className="inline-flex items-center text-sm font-medium text-indigo-100 hover:text-white"
                >
                  <svg className="mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to Courses
                </Link>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{course.title}</h1>
              <p className="mt-3 text-lg text-indigo-100">{course.description}</p>
              
              <div className="mt-6 flex flex-wrap items-center">
                {course.category && (
                  <span className="mr-4 mb-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {course.category}
                  </span>
                )}
                
                <div className="flex items-center mr-4 mb-2">
                  <svg className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-indigo-100">
                    {course.rating ? course.rating.toFixed(1) : '4.5'} 
                    <span className="text-indigo-200">
                      ({course.reviews_count || '24'} reviews)
                    </span>
                  </span>
                </div>
                
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm text-indigo-100">
                    {course.duration || '6 hours'} total duration
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                    </h3>
                    {course.original_price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${course.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        {course.lessons?.length || '8'} comprehensive lessons
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Lifetime access
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Certificate of completion
                      </p>
                    </li>
                  </ul>
                  
                  <div className="mt-8">
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {enrolling ? 'Processing...' : isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">What You'll Learn</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {(course.learning_objectives || [
                    'Understand core concepts and principles',
                    'Apply knowledge to real-world scenarios',
                    'Build practical projects to reinforce learning',
                    'Master advanced techniques and best practices',
                    'Develop problem-solving skills in the domain',
                    'Gain confidence in implementing solutions'
                  ]).map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Course Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Course Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{course.full_description || course.description}</p>
                {/* Additional description paragraphs would go here */}
              </div>
            </div>
            
            {/* Instructor */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Your Instructor</h2>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                    {course.instructor?.avatar_url ? (
                      <img 
                        src={course.instructor.avatar_url} 
                        alt={course.instructor.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.instructor?.name || 'John Doe'}
                  </h3>
                  <p className="text-gray-600">
                    {course.instructor?.title || 'Senior Instructor'}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    {course.instructor?.bio || 'Experienced educator with over 10 years of teaching experience in this field. Passionate about helping students achieve their learning goals.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {/* Course Curriculum */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Course Curriculum</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {course.lessons?.length || '8'} lessons • {course.duration || '6 hours'} total
                </p>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {(course.lessons || Array(5).fill(null).map((_, i) => ({
                  id: i + 1,
                  title: `Lesson ${i + 1}: Introduction to Topic ${i + 1}`,
                  duration: '45 min',
                  is_free: i === 0
                }))).map((lesson, index) => (
                  <li key={lesson.id || index} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                      
                      {isEnrolled ? (
                        <Link
                          to={`/lessons/${lesson.id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Start
                        </Link>
                      ) : lesson.is_free ? (
                        <Link
                          to={`/lessons/${lesson.id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Preview
                        </Link>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-500">
                          <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Locked
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}