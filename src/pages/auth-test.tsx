import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';

const AuthTest = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    register, 
    logout,
    loadUser,
    clearError 
  } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  
  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  // Clear error when auth type changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [authType, clearError, error]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authType === 'login') {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Authentication Test Page
      </h1>
      
      {/* Current auth state */}
      <div className="mb-6 p-3 border rounded bg-gray-50">
        <h2 className="font-semibold mb-2">Current State:</h2>
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </p>
        {error && (
          <p className="text-red-600">
            <strong>Error:</strong> {error}
          </p>
        )}
        {user && (
          <div className="mt-2">
            <h3 className="font-semibold">User Info:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {isAuthenticated ? (
        /* Logged in state */
        <div className="text-center">
          <p className="mb-4">You are logged in as {user?.email}</p>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        /* Login/Register form */
        <>
          <div className="flex mb-4 border-b">
            <button
              className={`py-2 px-4 flex-1 ${
                authType === 'login' 
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
                  : 'text-gray-500'
              }`}
              onClick={() => setAuthType('login')}
            >
              Login
            </button>
            <button
              className={`py-2 px-4 flex-1 ${
                authType === 'register' 
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
                  : 'text-gray-500'
              }`}
              onClick={() => setAuthType('register')}
            >
              Register
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isLoading
                ? authType === 'login' ? 'Logging in...' : 'Registering...'
                : authType === 'login' ? 'Login' : 'Register'
              }
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AuthTest;
