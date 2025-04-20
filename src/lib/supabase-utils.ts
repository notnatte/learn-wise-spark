import { supabase } from './supabase';

// User profile functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, profileData: any) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

// Learning stats functions
export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('learning_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserStats(userId: string, statsData: any) {
  const { data, error } = await supabase
    .from('learning_stats')
    .upsert({
      user_id: userId,
      ...statsData,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

// Learning goals functions
export async function getUserGoals(userId: string) {
  const { data, error } = await supabase
    .from('learning_goals')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
}

export async function createUserGoal(userId: string, goalData: any) {
  const { data, error } = await supabase
    .from('learning_goals')
    .insert({
      user_id: userId,
      ...goalData,
    })
    .select();
  
  if (error) throw error;
  return data;
}

export async function updateUserGoal(goalId: string, goalData: any) {
  const { data, error } = await supabase
    .from('learning_goals')
    .update({
      ...goalData,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .select();
  
  if (error) throw error;
  return data;
}

// Badges functions
export async function getUserBadges(userId: string) {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
}

export async function awardBadgeToUser(userId: string, badgeData: any) {
  const { data, error } = await supabase
    .from('badges')
    .insert({
      user_id: userId,
      ...badgeData,
    })
    .select();
  
  if (error) throw error;
  return data;
}

// Lessons and quizzes
export async function getLessons(subjectId?: string) {
  let query = supabase.from('lessons').select('*');
  
  if (subjectId) {
    query = query.eq('subject_id', subjectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getUserLessonProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select('*, lesson:lessons(*)')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
}

export async function getQuizzes(lessonId?: string) {
  let query = supabase.from('quizzes').select('*');
  
  if (lessonId) {
    query = query.eq('lesson_id', lessonId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getQuizQuestions(quizId: string) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*, answers:quiz_answers(*)')
    .eq('quiz_id', quizId);
  
  if (error) throw error;
  return data || [];
}

export async function submitQuizAttempt(userId: string, quizId: string, score: number) {
  const { data, error } = await supabase
    .from('user_quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score: score,
      completed: true,
      completed_at: new Date().toISOString()
    })
    .select();
  
  if (error) throw error;
  return data;
}

// Update lesson progress
export async function updateLessonProgress(userId: string, lessonId: string, progress: number, completed: boolean = false) {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      progress: progress,
      completed: completed,
      last_accessed: new Date().toISOString()
    })
    .select();
  
  if (error) throw error;
  return data;
}

// Get subjects
export async function getSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

// Messages
export async function getUserMessages(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content: content
    })
    .select();
  
  if (error) throw error;
  return data;
}

// Group messages
export async function getUserGroups(userId: string) {
  const { data, error } = await supabase
    .from('message_group_members')
    .select('group:message_groups(*)')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data?.map(item => item.group) || [];
}

export async function getGroupMessages(groupId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function sendGroupMessage(senderId: string, groupId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      group_id: groupId,
      content: content
    })
    .select();
  
  if (error) throw error;
  return data;
}

// Create and manage groups
export async function createMessageGroup(name: string, description: string) {
  const { data, error } = await supabase
    .from('message_groups')
    .insert({
      name,
      description
    })
    .select();
  
  if (error) throw error;
  return data;
}

export async function addUserToGroup(groupId: string, userId: string) {
  const { data, error } = await supabase
    .from('message_group_members')
    .insert({
      group_id: groupId,
      user_id: userId
    })
    .select();
  
  if (error) throw error;
  return data;
}

// Search functions
export async function searchUsers(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', `%${query}%`)
    .limit(10);
  
  if (error) throw error;
  return data || [];
}

export async function searchLessons(query: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
    .limit(10);
  
  if (error) throw error;
  return data || [];
}

// Analytics functions
export async function incrementLessonCompletions(userId: string) {
  const { data: stats, error: getError } = await supabase
    .from('learning_stats')
    .select('lessons_completed')
    .eq('user_id', userId)
    .single();
  
  if (getError && getError.code !== 'PGRST116') throw getError;
  
  const currentCount = stats?.lessons_completed || 0;
  
  const { data, error } = await supabase
    .from('learning_stats')
    .upsert({
      user_id: userId,
      lessons_completed: currentCount + 1,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function incrementQuizzesTaken(userId: string, score: number) {
  const { data: stats, error: getError } = await supabase
    .from('learning_stats')
    .select('quizzes_taken, average_score')
    .eq('user_id', userId)
    .single();
  
  if (getError && getError.code !== 'PGRST116') throw getError;
  
  const currentCount = stats?.quizzes_taken || 0;
  const currentAvg = stats?.average_score || 0;
  
  // Calculate new average
  const newAvg = currentCount === 0 
    ? score 
    : (currentAvg * currentCount + score) / (currentCount + 1);
  
  const { data, error } = await supabase
    .from('learning_stats')
    .upsert({
      user_id: userId,
      quizzes_taken: currentCount + 1,
      average_score: newAvg,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function updateStudyStreak(userId: string, streak: number) {
  const { data, error } = await supabase
    .from('learning_stats')
    .upsert({
      user_id: userId,
      study_streak: streak,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function updateLearningTime(userId: string, additionalMinutes: number) {
  const { data: stats, error: getError } = await supabase
    .from('learning_stats')
    .select('learning_time')
    .eq('user_id', userId)
    .single();
  
  if (getError && getError.code !== 'PGRST116') throw getError;
  
  const currentTime = stats?.learning_time || 0;
  const newTime = currentTime + (additionalMinutes / 60); // Convert to hours
  
  const { data, error } = await supabase
    .from('learning_stats')
    .upsert({
      user_id: userId,
      learning_time: newTime,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}