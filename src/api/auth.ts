import { supabase } from './supabase';
import type { Provider } from '@supabase/supabase-js';

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = SignInCredentials & {
  fullName?: string;
};

/**
 * Signs in a user with email and password
 */
export const signInWithEmail = async ({ email, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Signs up a new user with email and password
 */
export const signUpWithEmail = async ({ email, password, fullName }: SignUpCredentials) => {
  console.log('Starting user registration process...');
  
  // Step 1: Register with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
    },
  });

  if (authError) {
    console.error('Auth signup error:', authError);
    throw new Error(authError.message);
  }

  console.log('Auth signup successful:', authData.user?.id);

  // If sign up is successful and we have a user ID, create a user profile
  if (authData.user) {
    try {
      // We need to use the admin functions or service_role to bypass RLS
      // For now, we'll try to handle the insertion with detailed logging
      console.log('Attempting to create user profile with ID:', authData.user.id);
      
      const userData = {
        id: authData.user.id,
        email,
        full_name: fullName || null,
        role: 'customer', // Default role for new users
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('User data being inserted:', userData);
      
      // Insert into the public users table
      const { data: insertedUser, error: profileError } = await supabase
        .from('users')
        .insert(userData)
        .select('*')
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        console.error('Error details:', JSON.stringify(profileError, null, 2));
        
        // Check if this is a permissions error
        if (profileError.code === '42501' || profileError.message.includes('permission denied')) {
          console.warn('This appears to be a permissions issue with RLS policies. Please check your Supabase RLS configuration.');
        }
        
        // We'll log but not throw, so registration can still complete
        console.warn('User will be registered in auth but may not have a profile in the users table');
      } else {
        console.log('User profile created successfully:', insertedUser);
      }
    } catch (err) {
      console.error('Error during user profile creation:', err);
      console.error('Full error details:', JSON.stringify(err, null, 2));
      // We'll still return the auth data, but the error will be logged
    }
  }

  return authData;
};

/**
 * Signs in user with a third-party provider (Google)
 */
export const signInWithProvider = async (provider: Provider = 'google') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Signs out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }

  return true;
};

/**
 * Get the base URL for the application (works in both browser and tests)
 */
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Default for testing
  return 'http://localhost:5173';
};

/**
 * Resets password for a user
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getBaseUrl()}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates user password
 */
export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Gets the current user session
 */
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.session;
};

/**
 * Gets the current user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return user;
};
