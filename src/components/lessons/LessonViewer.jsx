import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function LessonViewer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    async function loadLessonData() {
      setLoading(true);
      
      try {
        // Get lesson details
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();
        
        if (lessonError) throw lessonError;
        if (!lessonData) throw new Error('Lesson not found');
        
        setLesson(lessonData);
        
        // Get user progress for this lesson
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('completed')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single();
          
          setIsCompleted(progressData?.completed || false);
        }
        
        // Get course details to show navigation between lessons
        if (lessonData.course_id) {
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id, title')
            .eq('id', lessonData.course_id)
            .single();
          
          if (courseError) throw courseError;
          
          // Get all lessons for this course
          const { data: courseLessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('id, title, order_index, duration, completed')
            .eq('course_id', lessonData.course_id)
            .order('order_index', { ascending: true });
          
          if (lessonsError) throw lessonsError;
          
          // Add lessons to course object
          const courseWithLessons = {
            ...courseData,
            lessons: courseLessons || []
          };
          
          setCourse(courseWithLessons);
          
          // Find current lesson index
          const index = courseLessons?.findIndex(l => l.id === parseInt(lessonId)) || 0;
          setCurrentLessonIndex(index >= 0 ? index : 0);
        }
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadLessonData();
  }, [lessonId]);

  async function handleMarkComplete() {
    if (isCompleted || markingComplete) return;
    
    setMarkingComplete(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to mark lessons as complete');
      }
      
      // Check if progress record exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();
      
      if (existingProgress) {
        // Update existing record
        await supabase
          .from('user_progress')
          .update({ 
            completed: true,
            progress: 100,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress record
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            course_id: lesson.course_id,
            completed: true,
            progress: 100
          });
      }
      
      setIsCompleted(true);
      
      // If there's a next lesson, show a prompt to continue
      if (course?.lessons && currentLessonIndex < course.lessons.length - 1) {
        if (window.confirm('Great job! Would you like to continue to the next lesson?')) {
          navigate(`/lessons/${course.lessons[currentLessonIndex + 1].id}`);
        }
      }
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      setError(err.message);
    } finally {
      setMarkingComplete(false);
    }
  }

  function getNextAndPreviousLessons() {
    if (!course?.lessons || course.lessons.length === 0) {
      return { next: null, previous: null };
    }
    
    const previous = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
    const next = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null;
    
    return { next, previous };
  }

  const { next, previous } = getNextAndPreviousLessons();

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

  if (!lesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Lesson not found</h2>
          <p className="mt-2 text-gray-600">
            The lesson you're looking for doesn't exist or has been removed.
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
    <div className="bg-white min-h-screen">
      {/* Lesson Header */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            {course && (
              <Link
                to={`/courses/${course.id}`}
                className="inline-flex items-center text-sm font-medium text-indigo-100 hover:text-white"
              >
                <svg className="mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to {course.title}
              </Link>
            )}
            <h1 className="mt-2 text-2xl font-bold text-white">{lesson.title}</h1>
            
            <div className="mt-2 flex items-center text-indigo-100">
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{lesson.duration || '45 min'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lesson Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose max-w-none">
              {/* Video Player (if available) */}
              {lesson.video_url && (
                <div className="aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={lesson.video_url}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
              
              {/* Lesson Content */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h2>
                
                <div className="prose prose-indigo prose-lg text-gray-700">
                  {lesson.content ? (
                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                  ) : (
                    <>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, 
                        nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia,
                        nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                      </p>
                      <p>
                        Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. 
                        Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                      </p>
                      <h3>Key Concepts</h3>
                      <ul>
                        <li>First important concept explained in detail</li>
                        <li>Second key point that builds on the previous one</li>
                        <li>Practical application of the concepts learned</li>
                      </ul>
                      <p>
                        Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                      </p>
                    </>
                  )}
                </div>
                
                {/* Mark Complete Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleMarkComplete}
                    disabled={isCompleted || markingComplete}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isCompleted 
                        ? 'bg-green-600 hover:bg-green-700 text-white cursor-default' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    } disabled:opacity-50`}
                  >
                    {markingComplete ? (
                      'Saving...'
                    ) : isCompleted ? (
                      <>
                        <svg className="mr-1.5 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                </div>
              </div>
              
              {/* Lesson Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <div>
                  {previous && (
                    <Link
                      to={`/lessons/${previous.id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous Lesson
                    </Link>
                  )}
                </div>
                
                <div>
                  {next && (
                    <Link
                      to={`/lessons/${next.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Next Lesson
                      <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            {/* Course Outline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Course Outline</h3>
              </div>
              
              {course && course.lessons && (
                <ul className="divide-y divide-gray-200">
                  {course.lessons.map((courseLesson, index) => {
                    const isActive = courseLesson.id === parseInt(lessonId);
                    const isLessonCompleted = courseLesson.completed || false;
                    
                    return (
                      <li key={courseLesson.id} className={`px-4 py-4 ${isActive ? 'bg-indigo-50' : ''}`}>
                        <Link to={`/lessons/${courseLesson.id}`} className="flex items-start">
                          <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                            isLessonCompleted 
                              ? 'bg-green-100 text-green-600' 
                              : isActive 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isLessonCompleted ? (
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className={`text-sm font-medium ${
                              isActive ? 'text-indigo-700' : 'text-gray-900'
                            }`}>
                              {courseLesson.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {courseLesson.duration || '45 min'}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            {/* Additional Resources */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Additional Resources</h3>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <ul className="space-y-4">
                  {(lesson.resources || [
                    { title: 'Lesson Slides', type: 'pdf', url: '#' },
                    { title: 'Exercise Files', type: 'zip', url: '#' },
                    { title: 'Further Reading', type: 'link', url: '#' }
                  ]).map((resource, index) => (
                    <li key={index}>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        {resource.type === 'pdf' && (
                          <svg className="mr-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        )}
                        {resource.type === 'zip' && (
                          <svg className="mr-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 3h8v1H6V7zm0 2h8v1H6V9zm0 2h4v1H6v-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {resource.type === 'link' && (
                          <svg className="mr-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        )}
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Need Help? */}
            <div className="mt-6 bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-indigo-900">Need Help?</h3>
              <p className="mt-2 text-sm text-indigo-700">
                Having trouble understanding this lesson? Get personalized assistance from our AI tutor or connect with your instructor.
              </p>
              <div className="mt-4 space-y-3">
                <Link
                  to="/ai-tutor"
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ask AI Tutor
                </Link>
                <button
                  type="button"
                  className="block w-full text-center px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Contact Instructor
                </button>
              </div>
            </div>
            
            {/* Discussion Section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Discussion</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  5 comments
                </span>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Join the discussion about this lesson with other students.
                </p>
                
                <Link
                  to={`/lessons/${lessonId}/discussion`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Discussion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
