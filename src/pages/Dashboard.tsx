import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../molecules/DashboardHeader'
import ProgressCard from '../molecules/ProgressCard'
import ProjectCard from '../molecules/ProjectCard'
import TaskGroup from '../molecules/TaskGroup'
import BottomNavigation from '../molecules/BottomNavigation'
import { useTaskStore } from '../store/taskStore'
import { useUserStore } from '../store/userStore'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // Get user data from store - will be used in DashboardHeader
  useUserStore(state => state.user)
  
  // Get task data from store
  const { 
    projects, 
    getTodayProgress,
    getProjectsWithProgress,
    tasks
  } = useTaskStore()
  
  // Get today's progress
  const todayProgress = getTodayProgress()
  
  // Get projects with progress information
  const projectsWithProgress = useMemo(() => {
    return getProjectsWithProgress().map(project => ({
      id: project.id,
      title: project.name,
      category: project.description || '',
      progress: project.progress,
      color: project.color.includes('blue') ? 'blue' : 
             project.color.includes('orange') ? 'orange' : 
             project.color.includes('purple') ? 'purple' : 'green'
    }))
  }, [getProjectsWithProgress])
  
  // Group tasks by project for task groups display
  const taskGroups = useMemo(() => {
    // Create a map of project IDs to task counts and progress
    const projectTaskMap = new Map()
    
    // Initialize with all projects first
    projects.forEach(project => {
      projectTaskMap.set(project.id, {
        id: project.id,
        title: project.name,
        taskCount: 0,
        completedTasks: 0,
        progress: 0,
        color: project.color,
        iconColor: project.color.includes('pink') ? '#EC4899' : 
                  project.color.includes('purple') ? '#8B5CF6' : 
                  project.color.includes('orange') ? '#F97316' : 
                  project.color.includes('yellow') ? '#FBBF24' : '#3B82F6'
      })
    })
    
    // Count tasks for each project
    tasks.forEach(task => {
      if (task.projectId) {
        const projectData = projectTaskMap.get(task.projectId)
        if (projectData) {
          projectData.taskCount++
          if (task.status === 'Done') {
            projectData.completedTasks++
          }
        }
      }
    })
    
    // Calculate progress for each project
    projectTaskMap.forEach(data => {
      if (data.taskCount > 0) {
        data.progress = Math.round((data.completedTasks / data.taskCount) * 100)
      }
    })
    
    // If no projects with tasks, create a default task group
    if (projectTaskMap.size === 0 || Array.from(projectTaskMap.values()).every(data => data.taskCount === 0)) {
      return [
        { 
          id: 'default', 
          title: t('personalProject'), 
          taskCount: 0, 
          progress: 0, 
          color: 'bg-purple-100', 
          iconColor: '#8B5CF6' 
        }
      ]
    }
    
    // Return only projects that have tasks
    return Array.from(projectTaskMap.values())
      .filter(data => data.taskCount > 0)
      .sort((a, b) => b.taskCount - a.taskCount) // Sort by task count descending
  }, [projects, tasks, t])
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <DashboardHeader />
      
      <div className="p-4 space-y-6">
        {/* Today's Progress Card */}
        <ProgressCard 
          percentage={todayProgress.percentage} 
          completed={todayProgress.completed} 
          total={todayProgress.total} 
        />
        
        {/* In Progress Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">{t('inProgress')} <span className="text-sm text-gray-500 font-normal">{projectsWithProgress.length}</span></h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {projectsWithProgress.length > 0 ? (
              projectsWithProgress.map(project => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  category={project.category}
                  progress={project.progress}
                  color={project.color as 'blue' | 'orange' | 'purple' | 'green'}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-6">
                <p className="text-gray-500 mb-3">{t('noProjectsYet')}</p>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => navigate('/project/new')}
                >
                  {t('createProject')}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Task Groups */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">{t('taskGroups')} <span className="text-sm text-gray-500 font-normal">{taskGroups.length}</span></h2>
          </div>
          <div className="space-y-3">
            {taskGroups.map(group => (
              <TaskGroup
                key={group.id}
                title={group.title}
                taskCount={group.taskCount}
                progress={group.progress}
                color={group.color}
                icon={
                  <div className="text-white">
                    {/* Project/Office icon */}
                    {(group.title === t('officeProject') || group.color.includes('pink')) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {/* Personal icon */}
                    {(group.title === t('personalProject') || group.color.includes('purple')) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {/* Study icon */}
                    {(group.title === t('dailyStudy') || group.color.includes('orange')) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                    {/* Other/Tasks icon */}
                    {(group.color.includes('yellow') || group.color.includes('blue') || (!group.color.includes('pink') && !group.color.includes('purple') && !group.color.includes('orange'))) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                }
                onClick={() => navigate(`/project/${group.id}`)}
              />
            ))}
            
            {taskGroups.length === 0 && (
              <div className="bg-white p-6 rounded-xl flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-3">{t('noTaskGroupsYet')}</p>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => navigate('/project/new')}
                >
                  {t('createTaskGroup')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default Dashboard
