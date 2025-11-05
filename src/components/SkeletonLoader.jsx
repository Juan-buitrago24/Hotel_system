import React from 'react';

// Skeleton básico reutilizable
export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return (
    <div className={`${width} ${height} bg-gray-200 rounded skeleton ${className}`}></div>
  );
};

// Skeleton para tarjetas (RoomCard)
export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="w-24" height="h-6" />
        <Skeleton width="w-20" height="h-6" className="rounded-full" />
      </div>

      {/* Tipo y precio */}
      <div className="space-y-3 mb-4">
        <Skeleton width="w-32" height="h-5" />
        <Skeleton width="w-28" height="h-8" />
      </div>

      {/* Descripción */}
      <div className="space-y-2 mb-4">
        <Skeleton width="w-full" height="h-3" />
        <Skeleton width="w-4/5" height="h-3" />
        <Skeleton width="w-3/5" height="h-3" />
      </div>

      {/* Amenities */}
      <div className="flex gap-2 mb-4">
        <Skeleton width="w-16" height="h-6" className="rounded-full" />
        <Skeleton width="w-16" height="h-6" className="rounded-full" />
        <Skeleton width="w-16" height="h-6" className="rounded-full" />
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <Skeleton width="w-full" height="h-10" />
        <Skeleton width="w-10" height="h-10" />
        <Skeleton width="w-10" height="h-10" />
      </div>
    </div>
  );
};

// Skeleton para filas de tabla
export const SkeletonTableRow = ({ columns = 6 }) => {
  return (
    <tr className="border-b border-gray-100 animate-fadeIn">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton 
            width={index === 0 ? 'w-32' : 'w-24'} 
            height="h-4" 
          />
        </td>
      ))}
    </tr>
  );
};

// Skeleton para tabla completa
export const SkeletonTable = ({ rows = 5, columns = 6, showHeader = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fadeIn">
      <table className="min-w-full divide-y divide-gray-200">
        {showHeader && (
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  <Skeleton width="w-20" height="h-4" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Skeleton para lista de items (GuestsPage, EmployeesPage)
export const SkeletonList = ({ items = 5 }) => {
  return (
    <div className="space-y-3 animate-fadeIn">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Avatar/Icon */}
            <Skeleton width="w-12" height="h-12" className="rounded-full" />
            
            {/* Info */}
            <div className="flex-1 space-y-2">
              <Skeleton width="w-48" height="h-5" />
              <Skeleton width="w-64" height="h-4" />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Skeleton width="w-8" height="h-8" className="rounded" />
            <Skeleton width="w-8" height="h-8" className="rounded" />
            <Skeleton width="w-8" height="h-8" className="rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton para grid de tarjetas (RoomsPage)
export const SkeletonGrid = ({ items = 6, columns = 3 }) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClass[columns]} gap-6 animate-fadeIn`}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// Skeleton para calendario
export const SkeletonCalendar = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton width="w-8" height="h-8" />
        <Skeleton width="w-40" height="h-6" />
        <Skeleton width="w-8" height="h-8" />
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} width="w-full" height="h-8" />
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <Skeleton key={index} width="w-full" height="h-20" className="rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonTableRow,
  SkeletonList,
  SkeletonGrid,
  SkeletonCalendar
};
