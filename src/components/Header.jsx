import React from 'react'
import { Hotel, LogOut, UserCircle } from 'lucide-react'
import Button from './Button'
import DarkModeToggle from './DarkModeToggle'

const Header = ({ user, onLogout, onShowProfile }) => (
  <header className="bg-white dark:bg-gray-800 shadow-md transition-colors">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src="/Logo Hotel Manager.jpg" 
          alt="Hotel Manager Logo" 
          className="h-10 w-auto object-contain"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hotel Manager</h1>
      </div>
      <div className="flex items-center space-x-4">
        <DarkModeToggle />
        <button 
          onClick={onShowProfile}
          className="text-right hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
            </div>
            <UserCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        </button>
        <Button variant="danger" onClick={onLogout} className="flex items-center space-x-2">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </div>
  </header>
)

export default Header
