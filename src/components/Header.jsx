import React from 'react'
import { Hotel, LogOut } from 'lucide-react'
import Button from './Button'

const Header = ({ user, onLogout }) => (
  <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Hotel className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Hotel Manager</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-600 capitalize">{user.role}</p>
        </div>
        <Button variant="danger" onClick={onLogout} className="flex items-center space-x-2">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </div>
  </header>
)

export default Header
