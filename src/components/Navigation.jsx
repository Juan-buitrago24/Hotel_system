import React from 'react'
import { Calendar, Users, LayoutDashboard, Package } from 'lucide-react'

const Navigation = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'reservations', label: 'Reservas', icon: Calendar, enabled: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: false },
    { id: 'guests', label: 'Huéspedes', icon: Users, enabled: false },
    { id: 'inventory', label: 'Inventario', icon: Package, enabled: false }
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => item.enabled && onViewChange(item.id)}
              disabled={!item.enabled}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
                item.enabled && activeView === item.id
                  ? 'border-blue-600 text-blue-600'
                  : item.enabled
                  ? 'border-transparent text-gray-600 hover:text-gray-800'
                  : 'border-transparent text-gray-400 cursor-not-allowed'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation
