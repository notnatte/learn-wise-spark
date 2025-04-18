import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Enrollment = Database['public']['Tables']['enrollments']['Row'];

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

export const courseService = {
  // Get all published courses
  async getPublishedCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  // Get a course by ID with details
  async getCourseById(courseId: string): Promise<CourseWithDetails | null> {
    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (courseError) throw courseError;
    if (!course) return null;
    
    // Get the lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (lessonsError) throw lessonsError;
    
    // Get the instructor
    const { data: instructor, error: instructorError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', course.created_by)
      .single();
    
    if (instructorError) throw instructorError;
    
    // Check if the current user is enrolled
    const { data: { user } } = await supabase.auth.getUser();
    let enrolled = false;
    let progress = 0;
    
    if (user) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      enrolled = !!enrollment;
      
      if (enrolled && lessons && lessons.length > 0) {
        // Calculate progress
        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id)
          .in('lesson_id', lessons.map(l => l.id));
        
        const completedLessons = userProgress?.filter(p => p.completed).length || 0;
        progress = Math.round((completedLessons / lessons.length) * 100);
      }
    }
    
    return {
      ...course,
      lessons: lessons || [],
      enrolled,
      progress,
      instructor: instructor || {
        id: course.created_by,
        username: null,
        full_name: null,
        avatar_url: null,
      },
    };
  },
  
  // Create a new course (for teachers/admins)
  async createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'created_by'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...course,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a course (for teachers/admins)
  async updateCourse(courseId: string, course: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', courseId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete a course (for teachers/admins)
  async deleteCourse(courseId: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);
    
    if (error) throw error;
  },
  
  // Enroll in a course
  async enrollInCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Get user's enrolled courses
  async getEnrolledCourses(): Promise<Course[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        course_id,
        courses (*)
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    return data?.map(item => item.courses) || [];
  },
  
  // Create a lesson (for teachers/admins)
  async createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a lesson (for teachers/admins)
  async updateLesson(lessonId: string, lesson: Partial<Lesson>) {
    const { data, error } = await supabase
      .from('lessons')
      .update(lesson)
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete a lesson (for teachers/admins)
  async deleteLesson(lessonId: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);
    
    if (error) throw error;
  },
}; 