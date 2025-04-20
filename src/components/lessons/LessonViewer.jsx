import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails, updateLessonProgress } from '../../lib/api';
import { supabase } from '../../lib/supabase';

export default function LessonViewer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      
      // First, get the lesson details
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (lessonError) {
        setError(lessonError.message);
        setLoading(false);
        return;
      }
      
      setCurrentLesson(lesson);
      
      // Then get the course details
      const { course, error: courseError } = await getCourseDetails(lesson.course_id);
      
      if (courseError) {
        setError(courseError.message);
        setLoading(false);
        return;
      }
      
      setCourse(course);
      
      // Get user's progress for this lesson
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('progress, completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .single();
        
        if (progressData) {
          setProgress(progressData.progress);
        }
        
        // Record that the user accessed this lesson
        await updateLessonProgress(lessonId, progressData?.progress || 0);
      }
      
      setLoading(false);
    }
    
    loadLesson();
  }, [lessonId]);

  // Find next and previous lessons
  const getAdjacentLessons = () => {
    if (!course || !course.lessons || !currentLesson) return { next: null, prev: null };
    
    const sortedLessons = [...course.lessons].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sortedLessons.findIndex(lesson => lesson.id === currentLesson.id);
    
    return {
      next: currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null,
      prev: currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
    };
  };

  const { next, prev } = getAdjacentLessons();

  const handleComplete = async () => {
    await updateLessonProgress(lessonId, 100, true);
    setProgress(100);
    
    // Navigate to next lesson if available
    if (next) {
      navigate(`/lessons/${next.id}`);
    } else {
      // No more lessons, navigate back to course
      navigate(`/courses/${course.id}`);
    }
  };

  const handleProgressUpdate = async (newProgress) => {
    await updateLessonProgress(lessonId, newProgress);
    setProgress(newProgress);
  };

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
        Error loading lesson: {error}
      </div>
    );
  }

  if (!currentLesson || !course) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">Lesson not found</h3>
        <button 
          onClick={() => navigate('/courses')}
          className="text-indigo-600 hover:underline"
        >
          Browse all courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Course Navigation */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Course</h2>
            <h3 className="text-lg font-medium">{course.title}</h3>
          </div>
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Course
          </button>
        </div>
      </div>
      
      {/* Lesson Content */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Lesson Type Specific Content */}
          {currentLesson.type === 'video' && (
            <div className="aspect-w-16 aspect-h-9 mb-6">
              {currentLesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <p>Video content unavailable</p>
                </div>
              )}
            </div>
          )}
          
          {currentLesson.type === 'text' && (
            <div className="prose max-w-none mb-6">
              {currentLesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              ) : (
                <p className="text-gray-500 italic">No content available for this lesson.</p>
              )}
            </div>
          )}
          
          {currentLesson.type === 'quiz' && (
            <div className="bg-indigo-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Quiz</h3>
              {currentLesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              ) : (
                <p className="text-gray-500 italic">Quiz content unavailable.</p>
              )}
            </div>
          )}
          
          {currentLesson.type === 'assignment' && (
            <div className="bg-amber-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Assignment</h3>
              {currentLesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              ) : (
                <p className="text-gray-500 italic">Assignment content unavailable.</p>
              )}
            </div>
          )}
          
          {/* Lesson Navigation */}
          <div className="flex justify-between mt-8">
            {prev ? (
              <button
                onClick={() => navigate(`/lessons/${prev.id}`)}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous Lesson
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              onClick={handleComplete}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {next ? 'Complete & Continue' : 'Complete Lesson'}
            </button>
            
            {next ? (
              <button
                onClick={() => navigate(`/lessons/${next.id}`)}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                Next Lesson
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Tutor Button */}
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Need help with this lesson?</h3>
        <p className="text-gray-600 mb-4">Our AI tutor can answer your questions about this topic.</p>
        <button
          onClick={() => navigate('/ai-tutor')}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-6 rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Ask AI Tutor
        </button>
      </div>
    </div>
  );
}