import React from 'react'
import ProgressCircle from '../atoms/ProgressCircle'

interface TaskGroupProps {
  title: string
  taskCount: number
  progress: number
  icon: React.ReactNode
  color: string
  onClick?: () => void
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  title,
  taskCount,
  progress,
  icon,
  color,
  onClick
}) => {
  return (
    <div 
      className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}</p>
        </div>
      </div>
      <ProgressCircle 
        percentage={progress} 
        size="sm" 
        color={color.includes('pink') ? '#EC4899' : color.includes('purple') ? '#5B3FFF' : color.includes('orange') ? '#F97316' : color.includes('yellow') ? '#FBBF24' : '#3B82F6'}
        trailColor={color.includes('pink') ? 'rgba(236, 72, 153, 0.2)' : color.includes('purple') ? 'rgba(91, 63, 255, 0.2)' : color.includes('orange') ? 'rgba(249, 115, 22, 0.2)' : color.includes('yellow') ? 'rgba(251, 191, 36, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
        showPercentage={true}
      />
    </div>
  )
}

export default TaskGroup
