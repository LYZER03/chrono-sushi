import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

/**
 * Main layout component for the application
 * Provides consistent structure with header and footer
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and brand name */}
            <div className="flex items-center space-x-2">
              <span className="text-primary-600 dark:text-primary-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
                </svg>
              </span>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sushi Samurai Express</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Home</a>
              <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Menu</a>
              <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">About</a>
              <a href="#" className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sushi Samurai Express &copy; {new Date().getFullYear()} - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
