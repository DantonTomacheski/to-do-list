import React from 'react'

interface GradientPageTemplateProps {
  children: React.ReactNode
  className?: string
}

const GradientPageTemplate: React.FC<GradientPageTemplateProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`
      min-h-screen w-full 
      bg-gradient-to-b from-white to-purple/10
      flex flex-col items-center justify-center p-4
      ${className}
    `}>
      {children}
    </div>
  )
}

export default GradientPageTemplate