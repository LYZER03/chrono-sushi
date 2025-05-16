import { useState, useEffect } from 'react'
import './App.css'

// Import from our store
import { useAuthStore } from './store'
import { checkSupabaseConnection } from './api/supabase'

// Import layout components
import Layout from './components/layout/Layout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Import our test pages
import AuthTest from './pages/auth-test'
import CategoryTest from './pages/category-test'
import ProductTest from './pages/product-test'
import UserTest from './pages/user-test'

function App() {
  const [count, setCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [activePage, setActivePage] = useState<'main' | 'auth' | 'categories' | 'products' | 'users'>('main')
  const { user, isAuthenticated } = useAuthStore()

  // Check Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection()
        setConnectionStatus(isConnected)
      } catch (error) {
        console.error('Failed to check connection:', error)
        setConnectionStatus(false)
      }
    }
    
    checkConnection()
  }, [])

  return (
    <Layout>
      {/* Testing navigation menu */}
      <div className="mb-8 flex justify-center">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-2">Test Navigation</h2>
          <select 
            value={activePage}
            onChange={(e) => setActivePage(e.target.value as any)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md p-2"
          >
            <option value="main">Main App</option>
            <option value="auth">Test Authentication</option>
            <option value="categories">Test Categories</option>
            <option value="products">Test Products</option>
            <option value="users">Test Users</option>
          </select>
        </div>
      </div>

      {activePage === 'auth' ? (
        <AuthTest />
      ) : activePage === 'categories' ? (
        <CategoryTest />
      ) : activePage === 'products' ? (
        <ProductTest />
      ) : activePage === 'users' ? (
        <UserTest />
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>Status of Supabase connection</CardDescription>
            </CardHeader>
            <CardContent>
              {connectionStatus === null ? (
                <p className="text-gray-500 dark:text-gray-400">Checking connection...</p>
              ) : connectionStatus ? (
                <p className="text-green-600 dark:text-green-400 font-medium">Connected to Supabase ✅</p>
              ) : (
                <p className="text-red-600 dark:text-red-400 font-medium">Failed to connect to Supabase ❌</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>State Management Demo</CardTitle>
              <CardDescription>Demonstration of Zustand store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium mb-1">Authentication Status:</p>
                <p className="text-lg font-semibold">{isAuthenticated ? 'Logged In' : 'Logged Out'}</p>
              </div>
              
              {user && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-sm font-medium mb-1">Current User:</p>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setCount((count) => count + 1)} className="w-full">
                Clicked {count} times
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Framework Components</CardTitle>
              <CardDescription>UI Components from shadcn-ui inspired library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Buttons</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Button Sizes</h3>
                  <div className="flex items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  )
}

export default App
