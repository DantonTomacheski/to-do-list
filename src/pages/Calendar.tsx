import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import useDateUtils from '../hooks/useDateUtils'

import { useTaskStore, TaskStatus } from '../store/taskStore'
import DayChip from '../atoms/DayChip'
import StatusFilterChip from '../atoms/StatusFilterChip'
import TaskCard from '../molecules/TaskCard'
import BottomNavigation from '../molecules/BottomNavigation'
import HeaderBar from '../molecules/HeaderBar'
import TaskFormModal from '../organisms/TaskFormModal'
import { addWeeks, subWeeks } from 'date-fns'

const Calendar: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { formatToYYYYMMDD, parseFromYYYYMMDD, addDaysFormatted, subtractDaysFormatted, formatForDisplay, getTodayFormatted, getWeekStart } = useDateUtils()
  
  // Task store hooks
  const {
    selectDate,
    setStatusFilter,
    updateTaskStatus,
    deleteTask,
    getFilteredTasksForDate,
    selectedDate,
    activeStatusFilter,
    getProjectById
  } = useTaskStore()
  
  // UI state
  const [isLoading, setIsLoading] = useState(true)
  // We use error for potential localStorage corruption, initialized as null
  const [error] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  // Ref for pull-to-refresh
  const listRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)
  
  // Week navigation
  const [currentWeek, setCurrentWeek] = useState(() => {
    // Get the week that contains the selected date
    const date = searchParams.get('date') 
      ? parseFromYYYYMMDD(searchParams.get('date') as string) 
      : new Date()
    return getWeekStart(date)
  })
  
  // Handle URL params
  useEffect(() => {
    const dateParam = searchParams.get('date')
    
    if (dateParam) {
      selectDate(dateParam)
    } else {
      // If no date in URL, set to today or current selected date
      // Usar função auxiliar para formatar a data no formato YYYY-MM-DD no fuso horário local
      const today = getTodayFormatted()
      setSearchParams({ date: selectedDate || today })
    }
    
    // Simulate loading tasks
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [searchParams, selectDate, setSearchParams, selectedDate])
  
  // Get filtered tasks for the selected date
  const tasks = getFilteredTasksForDate()
  
  // Effect to update mobile status on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Generate days based on screen size (7 for mobile, 14 for desktop)
  const weekDays = Array.from({ length: isMobile ? 7 : 14 }).map((_, index) => {
    // Criar data usando a função de date-fns importada via hook
    const dateObj = new Date(currentWeek);
    dateObj.setDate(currentWeek.getDate() + index);
    return dateObj;
  })
  
  // Handle day selection - wrapped in useCallback to avoid recreation on each render
  const handleDaySelect = useCallback((day: Date) => {
    // Formatando a data selecionada usando o hook centralizado
    const formattedDate = formatToYYYYMMDD(day)
    
    // Atualizar a data no store e URL search param
    selectDate(formattedDate)
    setSearchParams({ date: formattedDate })
  }, [selectDate, setSearchParams])
  
  // Handle long press on day
  const handleDayLongPress = () => {
    setShowDatePicker(true)
  }
  
  // Handle date picker change
  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      selectDate(e.target.value)
      setSearchParams({ date: e.target.value })
      setShowDatePicker(false)
    }
  }
  
  // Navigate to previous week
  const handlePrevWeek = () => {
    setCurrentWeek((prev: Date) => subWeeks(prev, 1))
  }
  
  // Navigate to next week
  const handleNextWeek = () => {
    setCurrentWeek((prev: Date) => addWeeks(prev, 1))
  }
  
  // Update task status
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus)
    
    // Show snackbar
    setSnackbarMessage(t('statusUpdated'))
    setShowSnackbar(true)
    setTimeout(() => {
      setShowSnackbar(false)
    }, 3000)
  }
  
  // Handle filter selection
  const handleFilterSelect = (filter: 'All' | TaskStatus) => {
    setStatusFilter(filter)
  }
  
  // Handle pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (listRef.current && listRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY
    }
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null && listRef.current && listRef.current.scrollTop === 0) {
      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current
      
      if (diff > 60) {
        setIsRefreshing(true)
      }
    }
  }
  
  const handleTouchEnd = () => {
    if (isRefreshing) {
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false)
      }, 1000)
    }
    startY.current = null
  }
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // Usar o hook centralizado para manipular datas
        const prevDateStr = subtractDaysFormatted(selectedDate, 1)
        const prevDay = parseFromYYYYMMDD(prevDateStr)
        handleDaySelect(prevDay)
      } else if (e.key === 'ArrowRight') {
        // Usar o hook centralizado para manipular datas
        const nextDateStr = addDaysFormatted(selectedDate, 1)
        const nextDay = parseFromYYYYMMDD(nextDateStr)
        handleDaySelect(nextDay)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedDate, handleDaySelect])
  
  // Handle reset data
  const handleResetData = () => {
    localStorage.removeItem('task-store')
    window.location.reload()
  }
  
  // Get project name for task
  const getProjectName = (projectId?: string) => {
    if (!projectId) return undefined
    
    const project = getProjectById(projectId)
    return project?.name
  }
  
  // Get project color for task
  const getProjectColor = (projectId?: string) => {
    if (!projectId) return undefined
    
    const project = getProjectById(projectId)
    return project?.color
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Bar */}
      <HeaderBar title={t('calendar')} titleId="calendarTitle" />
      
      {/* Day Selector */}
      <div className="my-4 px-4">
        <div className="flex justify-between items-center mb-3">
          <button 
            onClick={handlePrevWeek}
            className="p-2 rounded-full bg-white shadow-sm active:bg-gray-100"
            aria-label="Previous week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => setShowDatePicker(true)}
            className="font-medium text-gray-800 hover:text-purple-600 transition-colors px-2 py-1 rounded"
          >
            {formatForDisplay(currentWeek).split(' ').slice(1).join(' ')}
          </button>
          
          <button 
            onClick={handleNextWeek}
            className="p-2 rounded-full bg-white shadow-sm active:bg-gray-100"
            aria-label="Next week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div 
          className="flex overflow-x-auto py-2 scrollbar-hide scroll-smooth" 
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            paddingBottom: '10px'
          }}
        >
          {weekDays.map((date) => (
            <div 
              key={formatToYYYYMMDD(date)} 
              className="scroll-snap-align-start flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <DayChip 
                date={date}
                isSelected={formatToYYYYMMDD(date) === selectedDate}
                onClick={() => handleDaySelect(date)}
                onLongPress={handleDayLongPress}
              />
            </div>
          ))}
        </div>
        
        {/* Hidden date picker for quick jumps */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-overlay animate-fade-in" onClick={() => setShowDatePicker(false)}>
            <div className="bg-white p-4 rounded-xl w-80 animate-slide-up" onClick={e => e.stopPropagation()}>
              <h3 className="font-medium text-gray-800 mb-4">{t('selectDate')}</h3>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                value={selectedDate}
                onChange={handleDatePickerChange}
                onFocus={(e) => {
                  // This forces the date picker to open on mobile
                  if (e.target) {
                    const target = e.target as HTMLInputElement;
                    if (target.showPicker) {
                      target.showPicker();
                    }
                  }
                }}
              />
              <button 
                className="w-full bg-purple-600 text-white py-2 rounded-lg"
                onClick={() => setShowDatePicker(false)}
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Filter Bar */}
      <div className="my-4 px-4">
        <div className="flex justify-between py-2 gap-2 w-full bg-white rounded-lg shadow-sm p-2">
          <StatusFilterChip 
            status="All"
            isActive={activeStatusFilter === 'All'}
            onClick={() => handleFilterSelect('All')}
          />
          <StatusFilterChip 
            status="To-do"
            isActive={activeStatusFilter === 'To-do'}
            onClick={() => handleFilterSelect('To-do')}
          />
          <StatusFilterChip 
            status="In Progress"
            isActive={activeStatusFilter === 'In Progress'}
            onClick={() => handleFilterSelect('In Progress')}
          />
          <StatusFilterChip 
            status="Done"
            isActive={activeStatusFilter === 'Done'}
            onClick={() => handleFilterSelect('Done')}
          />
        </div>
      </div>
      
      {/* Task List */}
      <div 
        ref={listRef}
        className="px-4 pb-20 overflow-y-auto"
        style={{ height: 'calc(100vh - 250px)' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="flex justify-center py-4">
            <svg className="animate-spin h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 mb-3 animate-pulse">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </>
        )}
        
        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-4">
              {t('dataError')}
            </div>
            <button 
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={handleResetData}
            >
              {t('resetData')}
            </button>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 mt-4 mb-6">{t('noTasksForDay')}</p>
            <button 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowTaskModal(true)}
            >
              {t('addTask')}
            </button>
          </div>
        )}
        
        {/* Task list */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="animate-stagger-fade-in">
            {tasks.map((task, index) => (
              <div 
                key={task.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard 
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={deleteTask}
                  projectName={getProjectName(task.projectId)}
                  projectColor={getProjectColor(task.projectId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* FAB for Add Task */}
      <button 
        className="fixed right-4 bottom-20 bg-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 z-fab"
        onClick={() => setShowTaskModal(true)}
        aria-label={t('addTask')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      {/* Status updated snackbar */}
      {showSnackbar && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-toast">
          {snackbarMessage}
        </div>
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={taskData => {
          // Pass the task data to the task store
          const { addTask } = useTaskStore.getState();
          const newTaskId = addTask(taskData);
          setShowTaskModal(false);
          
          // DEPURAÇÃO: Verificar se a task foi salva com a data correta
          const { tasks, selectedDate: currentSelectedDate } = useTaskStore.getState();
          const newTask = tasks.find(t => t.id === newTaskId);
          console.log('Task adicionada:', newTask);
          console.log('Data selecionada na UI:', currentSelectedDate);
          console.log('Data da task:', newTask?.date);
          console.log('Todas as tasks:', tasks);
          console.log('Tasks filtradas:', useTaskStore.getState().getFilteredTasksForDate());
          
          // Show success message
          setSnackbarMessage(t('taskAdded'));
          setShowSnackbar(true);
          setTimeout(() => {
            setShowSnackbar(false);
          }, 3000);
        }}
        projectId="" // Will need to be updated if project selection is added
        selectedDate={selectedDate ? parseFromYYYYMMDD(selectedDate) : new Date()}
      />
    </div>
  )
}

export default Calendar
