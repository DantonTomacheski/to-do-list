import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  id: string
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full mb-4">
      <label 
        htmlFor={id} 
        className="block mb-1 font-medium text-gray-700"
      >
        {label}{required && <span className="text-pink ml-1">*</span>}
      </label>
      <input
        id={id}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-purple/30 focus:border-purple'
          }
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        required={required}
        {...props}
      />
      {error && (
        <div id={`${id}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </div>
      )}
    </div>
  )
}

export default Input