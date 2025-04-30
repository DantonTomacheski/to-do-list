import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Task, TaskStatus } from '../store/taskStore'
import { useNavigate } from 'react-router-dom'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  onDelete: (taskId: string) => void
  projectName?: string
  projectColor?: string
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onStatusChange, 
  onDelete,
  projectName,
  projectColor = 'bg-purple-100 text-purple-800' 
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swiping, setSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'none' | 'left' | 'right'>('none')
  const [showActionDrawer, setShowActionDrawer] = useState(false)
  
  // Card ref for animations
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Status badge styles
  const statusStyles = {
    'To-do': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-orange-100 text-orange-800',
    'Done': 'bg-green-100 text-green-800'
  }

  // Next status in the cycle
  const getNextStatus = (current: TaskStatus): TaskStatus => {
    switch (current) {
      case 'To-do': return 'In Progress'
      case 'In Progress': return 'Done'
      case 'Done': return 'To-do'
    }
  }
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(null)
    setSwiping(true)
  }
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !cardRef.current) return
    
    setTouchEnd(e.targetTouches[0].clientX)
    const diff = touchStart - e.targetTouches[0].clientX
    
    // Determine swipe direction
    if (Math.abs(diff) > 20) {
      setSwipeDirection(diff > 0 ? 'left' : 'right')
      
      // Apply transform to follow finger
      const move = Math.min(Math.abs(diff), 80) * (diff > 0 ? -1 : 1)
      cardRef.current.style.transform = `translateX(${move}px)`
    } else {
      setSwipeDirection('none')
      cardRef.current.style.transform = ''
    }
  }
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !cardRef.current) {
      setSwiping(false)
      setSwipeDirection('none')
      return
    }
    
    const diff = touchStart - touchEnd
    const minSwipeDistance = 60 // minimum distance in pixels to trigger action
    
    if (Math.abs(diff) >= minSwipeDistance) {
      if (diff > 0) { // Swiped left
        setShowActionDrawer(true)
      } else { // Swiped right
        // Update status to next in cycle
        onStatusChange(task.id, getNextStatus(task.status))
      }
    }
    
    // Reset card position with transition
    cardRef.current.style.transition = 'transform 0.3s ease'
    cardRef.current.style.transform = ''
    
    // Reset after animation completes
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = ''
      }
      setSwiping(false)
      setSwipeDirection('none')
    }, 300)
    
    setTouchStart(null)
    setTouchEnd(null)
  }
  
  // Handle card click
  const handleCardClick = () => {
    if (!swiping && swipeDirection === 'none') {
      navigate(`/projects/${task.projectId || 'none'}/tasks?task=${task.id}`)
    }
  }
  
  // Close action drawer
  const closeActionDrawer = () => {
    setShowActionDrawer(false)
  }
  
  // Edit task
  const handleEdit = () => {
    navigate(`/projects/${task.projectId || 'none'}/tasks/edit/${task.id}`)
    closeActionDrawer()
  }
  
  // Delete task
  const handleDelete = () => {
    onDelete(task.id)
    closeActionDrawer()
  }

  return (
    <div className="relative">
      <div 
        ref={cardRef}
        className="bg-white rounded-xl p-4 mb-3 shadow-sm active:translate-y-0.5 transition-all duration-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
        aria-label={`Task ${task.title}, status ${task.status}, scheduled ${task.time || 'all day'}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800 flex-1">{task.title}</h3>
          <div className={`px-2 py-1 rounded-full text-xs ${statusStyles[task.status]}`}>
            {t(task.status.toLowerCase().replace(/\s+/g, ''))}
          </div>
        </div>
        
        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex justify-between items-center">
          {task.time && (
            <div className="flex items-center text-gray-500 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{task.time}</span>
            </div>
          )}
          
          {projectName && (
            <div className={`px-2 py-1 rounded-full text-xs ${projectColor}`}>
              {projectName}
            </div>
          )}
          
          {task.priority && (
            <div className={`flex items-center text-xs ${
              task.priority === 'High' ? 'text-red-600' : 
              task.priority === 'Medium' ? 'text-orange-600' : 
              'text-blue-600'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>{t(task.priority.toLowerCase())}</span>
            </div>
          )}
        </div>
        
        {/* Swipe instructions for screen readers */}
        <div className="sr-only">
          {t('swipeRightToUpdateStatus')}. {t('swipeLeftForActions')}
        </div>
      </div>
      
      {/* Action drawer */}
      {showActionDrawer && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-10 animate-fade-in"
            onClick={closeActionDrawer}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 shadow-lg z-20 animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-4">{task.title}</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="bg-purple-100 text-purple-800 p-3 rounded-xl flex items-center justify-center"
                onClick={handleEdit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>{t('edit')}</span>
              </button>
              
              <button 
                className="bg-red-100 text-red-800 p-3 rounded-xl flex items-center justify-center"
                onClick={handleDelete}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{t('delete')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskCard
