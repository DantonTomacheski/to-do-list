import React from 'react'

interface ProjectCardProps {
  title: string
  category: string
  progress: number
  color: 'blue' | 'orange' | 'purple' | 'green'
  icon?: string
  onClick?: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  category,
  progress,
  color,
  icon,
  onClick
}) => {
  const categoryColors = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600'
  }
  
  const progressColors = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500'
  }
  
  const bgColors = {
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
    purple: 'bg-purple-50',
    green: 'bg-green-50'
  }
  
  return (
    <div 
      className={`${bgColors[color]} p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-w-[180px]`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <div className="flex-shrink-0">
            <img 
              src={icon} 
              alt="Project icon" 
              className="w-10 h-10 object-cover rounded-sm"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs ${categoryColors[color]} px-2 py-1 rounded-md`}>
              {category}
            </span>
          </div>
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{title}</h3>
        </div>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full w-full mt-auto">
        <div 
          className={`h-full ${progressColors[color]} rounded-full`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProjectCard
