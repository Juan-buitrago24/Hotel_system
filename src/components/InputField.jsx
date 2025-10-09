import React from 'react'

const InputField = ({ label, type = 'text', value, onChange, icon: Icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {Icon && <Icon className="w-4 h-4 inline mr-2" />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
      {...props}
    />
  </div>
)

export default InputField
