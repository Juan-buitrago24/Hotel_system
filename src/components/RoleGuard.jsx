import React from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Componente para controlar visibilidad basada en roles
 * 
 * Uso:
 * <RoleGuard allowedRoles={['admin']}>
 *   <Button>Solo Admin</Button>
 * </RoleGuard>
 */
const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  showMessage = false 
}) => {
  const { user } = useContext(AuthContext);

  // Si no hay usuario, no mostrar nada
  if (!user) {
    return fallback;
  }

  // Si no hay roles especificados, mostrar siempre
  if (allowedRoles.length === 0) {
    return children;
  }

  // Mapeo de roles para compatibilidad
  // 'admin' en allowedRoles incluye: admin, hotel_admin, admin_global
  const userRole = user.role;
  let hasPermission = allowedRoles.includes(userRole);
  
  // Si se requiere 'admin', aceptar también hotel_admin y admin_global
  if (!hasPermission && allowedRoles.includes('admin')) {
    hasPermission = userRole === 'hotel_admin' || userRole === 'admin_global';
  }

  if (!hasPermission) {
    if (showMessage) {
      return (
        <div className="text-gray-400 text-sm italic">
          No tienes permisos para realizar esta acción
        </div>
      );
    }
    return fallback;
  }

  return children;
};

/**
 * Hook personalizado para verificar permisos en lógica
 */
export const useRole = () => {
  const { user } = useContext(AuthContext);

  const hasRole = (roles) => {
    if (!user) return false;
    
    const userRole = user.role;
    
    // Mapeo de roles para compatibilidad
    // admin, hotel_admin y super_admin tienen permisos de admin
    if (Array.isArray(roles)) {
      if (roles.includes('admin') && (userRole === 'admin' || userRole === 'hotel_admin' || userRole === 'super_admin')) {
        return true;
      }
      return roles.includes(userRole);
    }
    
    if (roles === 'admin' && (userRole === 'admin' || userRole === 'hotel_admin' || userRole === 'super_admin')) {
      return true;
    }
    
    return userRole === roles;
  };

  const isAdmin = () => hasRole('admin');
  const isHotelAdmin = () => user?.role === 'hotel_admin' || user?.role === 'admin';
  const isSuperAdmin = () => user?.role === 'super_admin';
  const isEmpleado = () => hasRole('empleado');
  const isCliente = () => hasRole('cliente');

  return {
    user,
    hasRole,
    isAdmin,
    isHotelAdmin,
    isSuperAdmin,
    isEmpleado,
    isCliente,
    role: user?.role
  };
};

export default RoleGuard;
