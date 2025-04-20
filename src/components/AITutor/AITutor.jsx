import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AITutor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI learning assistant. How can I help you with your studies today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch user data and enrolled courses
  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // Get user's enrolled courses
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);
        
        if (enrollments && enrollments.length > 0) {
          const courseIds = enrollments.map(e => e.course_id);
          
          const { data: coursesData } = await supabase
            .from('courses')
            .select('id, title')
            .in('id', courseIds);
          
          if (coursesData) {
            setCourses(coursesData);
          }
        }
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
    }
    
    fetchUserData();
  }, [navigate]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Prepare context for the AI
      let context = "You are an AI tutor helping a student learn.";
      
      if (selectedCourse) {
        // Get course details for context
        const { data: courseData } = await supabase
          .from('courses')
          .select('title, description')
          .eq('id', selectedCourse)
          .single();
        
        if (courseData) {
          context += ` The student is currently studying ${courseData.title}. Course description: ${courseData.description}`;
          
          // Get recent lessons for additional context
          const { data: lessonsData } = await supabase
            .from('lessons')
            .select('title, summary')
            .eq('course_id', selectedCourse)
            .order('order_index', { ascending: true })
            .limit(3);
          
          if (lessonsData && lessonsData.length > 0) {
            context += ` Recent lessons include: ${lessonsData.map(l => l.title).join(', ')}`;
          }
        }
      }
      
      // Call your AI service here
      // This is a placeholder - replace with your actual AI service call
      const aiResponse = await simulateAIResponse(input, context);
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder function - replace with actual AI service
  const simulateAIResponse = async (question, context) => {
    // In a real implementation, you would call your AI service here
    // For now, we'll simulate a response with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response logic based on keywords
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('hello') || questionLower.includes('hi')) {
      return "Hello! How can I help you with your learning today?";
    } else if (questionLower.includes('thank')) {
      return "You're welcome! Feel free to ask if you have any other questions.";
    } else if (questionLower.includes('course')) {
      return "I can help you understand course concepts, explain difficult topics, or provide additional resources. What specific aspect of your course are you struggling with?";
    } else if (questionLower.includes('concept') || questionLower.includes('understand')) {
      return "Let me help break this down for you. Understanding new concepts can be challenging. Could you tell me which specific concept you're finding difficult?";
    } else if (questionLower.includes('example')) {
      return "Examples are a great way to understand concepts! Here's a simplified example that might help illustrate the concept...";
    } else {
      return "That's an interesting question. Let me help you explore this topic further. Could you provide more details about what you're trying to learn?";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-indigo-600 text-white">
          <h1 className="text-xl font-bold">AI Learning Assistant</h1>
          <p className="text-sm text-indigo-100">Ask me anything about your courses</p>
        </div>
        
        {/* Course selector */}
        <div className="p-4 border-b">
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select a course for context (optional)
          </label>
          <select
            id="course-select"
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value || null)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>
        
        {/* Chat messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg max-w-xs sm:max-w-md ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="mb-4">
              <div className="inline-block p-3 rounded-lg max-w-xs sm:max-w-md bg-white text-gray-800 border border-gray-200 rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input form */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      
      {/* Tips section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tips for using the AI Tutor</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Be specific with your questions for more accurate answers</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Select a course for context-aware responses related to what you're studying</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Ask for examples or simplified explanations if you're struggling with a concept</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>The AI tutor can help with concepts but isn't a replacement for completing your own assignments</span>
          </li>
        </ul>
      </div>
    </div>
  );
}