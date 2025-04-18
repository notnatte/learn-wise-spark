
import { supabase } from '@/integrations/supabase/client';

// Mock types since the actual tables don't exist in the Supabase database
interface Course {
  id: string;
  title: string;
  description: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  thumbnail_url?: string;
  level: string;
  duration: number;
}

interface Lesson {
  id: string;
  title: string;
  course_id: string;
  content: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface CourseWithDetails extends Course {
  lessons: Lesson[];
  enrolled: boolean;
  progress: number;
  instructor: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

// Sample data for demonstration
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'user-123',
    level: 'beginner',
    duration: 10
  }
];

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Getting Started',
    course_id: '1',
    content: 'Welcome to the course!',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'text'
  }
];

export const courseService = {
  // Get all published courses
  async getPublishedCourses(): Promise<Course[]> {
    // Mock implementation until Supabase tables are created
    return mockCourses.filter(course => course.published);
  },
  
  // Get a course by ID with details
  async getCourseById(courseId: string): Promise<CourseWithDetails | null> {
    // Mock implementation until Supabase tables are created
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return null;
    
    const lessons = mockLessons.filter(l => l.course_id === courseId);
    
    // Mock instructor data
    const instructor = {
      id: course.created_by,
      username: "instructor1",
      full_name: "Jane Doe",
      avatar_url: null
    };
    
    // Check if the current user is enrolled
    const { data: { user } } = await supabase.auth.getUser();
    let enrolled = false;
    let progress = 0;
    
    if (user) {
      // Mock enrollment check
      enrolled = true;
      progress = 25; // Mock progress
    }
    
    return {
      ...course,
      lessons,
      enrolled,
      progress,
      instructor,
    };
  },
  
  // Create a new course (for teachers/admins)
  async createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Course> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Mock course creation
    const newCourse: Course = {
      id: Math.random().toString(36).substring(7),
      ...course,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Return the new course
    return newCourse;
  },
  
  // Update a course (for teachers/admins)
  async updateCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    // Mock course update
    const existingCourse = mockCourses.find(c => c.id === courseId);
    if (!existingCourse) throw new Error('Course not found');
    
    const updatedCourse = {
      ...existingCourse,
      ...course,
      updated_at: new Date().toISOString()
    };
    
    return updatedCourse;
  },
  
  // Delete a course (for teachers/admins)
  async deleteCourse(courseId: string): Promise<void> {
    // Mock course deletion
    console.log(`Course ${courseId} deleted`);
  },
  
  // Enroll in a course
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Mock enrollment
    const enrollment = {
      id: Math.random().toString(36).substring(7),
      user_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString()
    };
    
    return enrollment;
  },
  
  // Get user's enrolled courses
  async getEnrolledCourses(): Promise<Course[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Mock enrolled courses
    return mockCourses;
  },
  
  // Create a lesson (for teachers/admins)
  async createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
    // Mock lesson creation
    const newLesson: Lesson = {
      id: Math.random().toString(36).substring(7),
      ...lesson,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return newLesson;
  },
  
  // Update a lesson (for teachers/admins)
  async updateLesson(lessonId: string, lesson: Partial<Lesson>): Promise<Lesson> {
    // Mock lesson update
    const existingLesson = mockLessons.find(l => l.id === lessonId);
    if (!existingLesson) throw new Error('Lesson not found');
    
    const updatedLesson = {
      ...existingLesson,
      ...lesson,
      updated_at: new Date().toISOString()
    };
    
    return updatedLesson;
  },
  
  // Delete a lesson (for teachers/admins)
  async deleteLesson(lessonId: string): Promise<void> {
    // Mock lesson deletion
    console.log(`Lesson ${lessonId} deleted`);
  },
};
