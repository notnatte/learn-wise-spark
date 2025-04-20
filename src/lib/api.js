import { supabase } from './supabase';

// Authentication
export async function signUp(email, password, username, fullName) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName
      }
    }
  });
  
  return { user, error };
}

export async function signIn(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { user, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Profile
export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { profile: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return { profile: data, error };
}

export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { profile: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  
  return { profile: data, error };
}

// Courses
export async function getPublishedCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:created_by (username, full_name, avatar_url)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });
  
  return { courses: data, error };
}

export async function getCourseDetails(courseId) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:created_by (username, full_name, avatar_url),
      lessons:lessons (*)
    `)
    .eq('id', courseId)
    .single();
  
  return { course: data, error };
}

// Enrollments
export async function enrollInCourse(courseId) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { enrollment: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: user.id,
      course_id: courseId
    })
    .select()
    .single();
  
  return { enrollment: data, error };
}

export async function getUserEnrollments() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { enrollments: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses:course_id (*)
    `)
    .eq('user_id', user.id);
  
  return { enrollments: data, error };
}

// Progress
export async function updateLessonProgress(lessonId, progress, completed = false) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { progress: null, error: 'Not authenticated' };
  
  // Check if progress record exists
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single();
  
  if (existingProgress) {
    // Update existing progress
    const { data, error } = await supabase
      .from('user_progress')
      .update({
        progress,
        completed,
        last_accessed: new Date()
      })
      .eq('id', existingProgress.id)
      .select()
      .single();
    
    return { progress: data, error };
  } else {
    // Create new progress record
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        progress,
        completed,
        last_accessed: new Date()
      })
      .select()
      .single();
    
    return { progress: data, error };
  }
}

// Learning Streaks
export async function getLearningStreak() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { streak: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('learning_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  return { streak: data, error };
}

// Achievements
export async function getUserAchievements() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { achievements: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements:achievement_id (*)
    `)
    .eq('user_id', user.id);
  
  return { achievements: data, error };
}

// AI Conversations
export async function createAIConversation(title) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { conversation: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: user.id,
      title: title || 'New Conversation'
    })
    .select()
    .single();
  
  return { conversation: data, error };
}

export async function getAIConversations() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { conversations: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  
  return { conversations: data, error };
}

export async function getAIConversationMessages(conversationId) {
  const { data, error } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  
  return { messages: data, error };
}

export async function sendAIMessage(conversationId, content) {
  // First insert the user message
  const { data: userMessage, error: userError } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id: conversationId,
      role: 'user',
      content
    })
    .select()
    .single();
  
  if (userError) return { message: null, error: userError };
  
  // In a real app, you would call your AI service here
  // For now, we'll just simulate a response
  const aiResponse = "This is a simulated AI response. In a real application, this would be generated by calling an AI service.";
  
  // Insert the AI response
  const { data: aiMessage, error: aiError } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse
    })
    .select()
    .single();
  
  if (aiError) return { message: null, error: aiError };
  
  // Update the conversation's updated_at timestamp
  await supabase
    .from('ai_conversations')
    .update({ updated_at: new Date() })
    .eq('id', conversationId);
  
  return { message: aiMessage, error: null };
}

// Notifications
export async function getNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { notifications: null, error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  return { notifications: data, error };
}

export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();
  
  return { notification: data, error };