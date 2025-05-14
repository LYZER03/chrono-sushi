/**
 * Environment configuration utility for Sushi Samurai Express
 * Handles environment-specific settings and configuration
 */

export type Environment = 'development' | 'test' | 'production';

// Get current environment from env vars or default to development
export const getEnvironment = (): Environment => {
  const env = import.meta.env.VITE_APP_ENV || 'development';
  
  if (env === 'development' || env === 'test' || env === 'production') {
    return env as Environment;
  }
  
  console.warn(`Unknown environment "${env}", defaulting to development`);
  return 'development';
};

// Check if we're in development mode
export const isDevelopment = (): boolean => getEnvironment() === 'development';

// Check if we're in test mode
export const isTest = (): boolean => getEnvironment() === 'test';

// Check if we're in production mode
export const isProduction = (): boolean => getEnvironment() === 'production';

// Get base URL for API requests (useful for redirects and callbacks)
export const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL;
  
  if (!url) {
    console.warn('VITE_API_BASE_URL not set, using default');
    return isProduction() ? 'https://sushi-samurai-express.vercel.app' : 'http://localhost:5173';
  }
  
  return url;
};

// Get feature flag value
export const getFeatureFlag = (flag: string, defaultValue = false): boolean => {
  const value = import.meta.env[`VITE_ENABLE_${flag.toUpperCase()}`];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  return value === 'true' || value === '1';
};

// Get environment-specific configuration
export const getConfig = () => {
  return {
    environment: getEnvironment(),
    baseUrl: getBaseUrl(),
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    features: {
      analytics: getFeatureFlag('ANALYTICS'),
      authSocial: getFeatureFlag('AUTH_SOCIAL', true),
    },
    // Add more configuration as needed
  };
};

export type AppConfig = ReturnType<typeof getConfig>;

// Export default configuration
export default getConfig();
