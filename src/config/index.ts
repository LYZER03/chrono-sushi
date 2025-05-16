/**
 * Configuration utility for different environments
 * Handles environment-specific settings (dev, test, prod)
 */

type Environment = 'development' | 'test' | 'production';

// Get current environment from Vite
const ENV: Environment = (import.meta.env.MODE || 'development') as Environment;

interface EnvironmentConfig {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

// Default configuration
const defaultConfig: EnvironmentConfig = {
  apiUrl: 'http://localhost:3000',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isProduction: false,
  isDevelopment: true,
  isTest: false,
};

// Environment-specific configurations
const environmentConfigs: Record<Environment, Partial<EnvironmentConfig>> = {
  development: {
    isDevelopment: true,
  },
  test: {
    apiUrl: 'http://localhost:3000',
    isTest: true,
    isDevelopment: false,
  },
  production: {
    apiUrl: 'https://api.sushisamurai.com',
    isProduction: true,
    isDevelopment: false,
  },
};

// Merge default config with environment-specific overrides
const config: EnvironmentConfig = {
  ...defaultConfig,
  ...environmentConfigs[ENV],
};

export default config;
