import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
}

export const authService = {
  // Get the current user's profile
  async getCurrentUser(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return profile;
  },
  
  // Sign up a new user
  async signUp(email: string, password: string, username: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in a user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Update the user's profile
  async updateProfile(profile: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
  },
  
  // Update password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
  },
}; 