import React from 'react'
import { useTranslation } from 'react-i18next'
import { TaskStatus } from '../store/taskStore'

interface StatusFilterChipProps {
  status: 'All' | TaskStatus
  isActive: boolean
  onClick: () => void
}

const StatusFilterChip: React.FC<StatusFilterChipProps> = ({ 
  status, 
  isActive, 
  onClick 
}) => {
  const { t } = useTranslation()
  
  // Map status to color and translation
  const statusMap = {
    'All': {
      color: 'bg-gray-100 text-gray-800',
      activeColor: 'text-purple-600',
      label: t('all')
    },
    'To-do': {
      color: 'bg-blue-100 text-blue-800',
      activeColor: 'text-blue-600',
      label: t('todo')
    },
    'In Progress': {
      color: 'bg-orange-100 text-orange-800',
      activeColor: 'text-orange-600',
      label: t('inProgress')
    },
    'Done': {
      color: 'bg-green-100 text-green-800',
      activeColor: 'text-green-600',
      label: t('done')
    }
  }
  
  const { color, activeColor, label } = statusMap[status]

  return (
    <div 
      className={`px-4 py-2 rounded-full ${color} relative transition-all duration-150 cursor-pointer`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
    >
      <span className={`${isActive ? 'font-bold' : 'font-normal'}`}>
        {label}
      </span>
      
      {/* Active indicator underline */}
      {isActive && (
        <div className={`absolute bottom-0 left-0 right-0 mx-auto w-full h-0.5 ${activeColor.replace('text', 'bg')}`} />
      )}
    </div>
  )
}

export default StatusFilterChip
