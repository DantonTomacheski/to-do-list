import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTaskStore, TaskStatus } from '../store/taskStore'
import HeaderBar from '../molecules/HeaderBar'
import TaskCard from '../molecules/TaskCard'
import BottomNavigation from '../molecules/BottomNavigation'
import StatusFilterChip from '../atoms/StatusFilterChip'
import TaskFormModal from '../organisms/TaskFormModal'

const TasksPage: React.FC = () => {
  const { t } = useTranslation()
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'All' | TaskStatus>('All')

  // Get data from task store
  const {
    tasks,
    projects,
    updateTaskStatus,
    deleteTask,
    setStatusFilter
  } = useTaskStore()

  // Filter tasks by search query and status filter
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = searchQuery === '' || 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description || '').toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesFilter = activeFilter === 'All' || task.status === activeFilter
        
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        // Sort by status (To-do first, then In Progress, then Done)
        const statusOrder = { 'To-do': 0, 'In Progress': 1, 'Done': 2 }
        const statusCompare = statusOrder[a.status] - statusOrder[b.status]
        
        if (statusCompare !== 0) return statusCompare
        
        // Then sort by date (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  }, [tasks, searchQuery, activeFilter])

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus)
    
    setSnackbarMessage(t('statusUpdated'))
    setShowSnackbar(true)
    setTimeout(() => {
      setShowSnackbar(false)
    }, 3000)
  }

  // Get project name for a task
  const getProjectName = (projectId?: string) => {
    if (!projectId) return undefined
    const project = projects.find(p => p.id === projectId)
    return project?.name
  }

  // Get project color for a task
  const getProjectColor = (projectId?: string) => {
    if (!projectId) return 'bg-purple-100 text-purple-800'
    const project = projects.find(p => p.id === projectId)
    if (!project) return 'bg-purple-100 text-purple-800'
    
    const color = project.color
    return `${color} ${
      color.includes('blue') ? 'text-blue-800' :
      color.includes('orange') ? 'text-orange-800' :
      color.includes('purple') ? 'text-purple-800' :
      color.includes('green') ? 'text-green-800' :
      'text-gray-800'
    }`
  }

  // Handle filter selection
  const handleFilterSelect = (filter: 'All' | TaskStatus) => {
    setActiveFilter(filter)
    setStatusFilter(filter)
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <HeaderBar title={t('tasks')} />
      
      <div className="p-4">
        {/* Search input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={t('searchTasks')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status filters */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          <StatusFilterChip
            status="All"
            isActive={activeFilter === 'All'}
            onClick={() => handleFilterSelect('All')}
          />
          <StatusFilterChip
            status="To-do"
            isActive={activeFilter === 'To-do'}
            onClick={() => handleFilterSelect('To-do')}
          />
          <StatusFilterChip
            status="In Progress"
            isActive={activeFilter === 'In Progress'}
            onClick={() => handleFilterSelect('In Progress')}
          />
          <StatusFilterChip
            status="Done"
            isActive={activeFilter === 'Done'}
            onClick={() => handleFilterSelect('Done')}
          />
        </div>

        {/* Task count */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('allTasks')}{' '}
            <span className="text-sm text-gray-500 font-normal">
              {filteredTasks.length}
            </span>
          </h2>
        </div>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 mt-4 mb-6">{searchQuery ? t('noTasksFound') : t('noTasksYet')}</p>
            <button 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowTaskModal(true)}
            >
              {t('addTask')}
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-stagger-fade-in">
            {filteredTasks.map((task, index) => (
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
        className="fixed right-4 bottom-20 bg-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        onClick={() => setShowTaskModal(true)}
        aria-label={t('addTask')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Status updated snackbar */}
      {showSnackbar && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {snackbarMessage}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={taskData => {
          // Pass the task data to the task store
          const { addTask } = useTaskStore.getState();
          addTask(taskData);
          setShowTaskModal(false);
          
          // Show success message
          setSnackbarMessage(t('taskAdded'));
          setShowSnackbar(true);
          setTimeout(() => {
            setShowSnackbar(false);
          }, 3000);
        }}
        projectId="" // Will need to be updated if project selection is added
        selectedDate={new Date()}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default TasksPage
