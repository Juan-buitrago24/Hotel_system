import React from 'react'

const InputField = ({ label, type = 'text', value, onChange, icon: Icon, as, children, ...props }) => {
  // Si el tipo es 'select', usar select como componente
  const Component = as || (type === 'select' ? 'select' : 'input');
  
  // No pasar 'type' a select elements
  const componentProps = Component === 'select' 
    ? { value, onChange, ...props }
    : { type, value, onChange, ...props };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      <Component
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400 dark:placeholder-gray-500"
        {...componentProps}
      >
        {children}
      </Component>
    </div>
  );
};

export default InputField
