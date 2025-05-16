import { useState } from 'react'
import { useAuthStore } from '../../store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * Application header component with navigation and user options
 * Fully responsive with mobile menu support
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand name */}
          <div className="flex items-center space-x-2">
            <span className="text-primary-600 dark:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
              </svg>
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Sushi Samurai Express</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Authentic Japanese cuisine with a modern twist</p>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost" 
            size="icon"
            className="md:hidden rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d={isMenuOpen 
                ? "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" 
                : "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"} 
              />
            </svg>
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 relative group">
              Home
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 dark:bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 relative group">
              Menu
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 dark:bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 relative group">
              About
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 dark:bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 relative group flex items-center gap-2">
              Orders
              <Badge variant="secondary" className="text-xs">New</Badge>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 dark:bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
            
            {isAuthenticated ? (
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-center space-x-1 font-medium"
                >
                  <span>{user?.email}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </Button>
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 hidden group-hover:block">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Settings</a>
                  <Button 
                    onClick={logout}
                    variant="ghost"
                    className="block w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="default">Sign In</Button>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        <div className={cn(
          "mt-4 pt-2 pb-4 border-t border-gray-200 dark:border-gray-700 md:hidden",
          isMenuOpen ? "block" : "hidden"
        )}>
          <div className="flex flex-col space-y-3">
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 py-2">Home</a>
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 py-2">Menu</a>
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 py-2">About</a>
            <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 py-2 flex items-center gap-2">
              Orders
              <Badge variant="secondary" className="text-xs">New</Badge>
            </a>
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-700 dark:text-gray-200">{user?.email}</p>
                <a href="#" className="text-sm text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-1">Your Profile</a>
                <a href="#" className="text-sm text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-1">Settings</a>
                <Button 
                  onClick={logout}
                  variant="ghost"
                  className="justify-start p-0 h-auto text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button variant="default" className="mt-2 w-full sm:w-auto">Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
