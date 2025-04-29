import React from 'react'
import { useTranslation } from 'react-i18next'
import DashboardHeader from '../molecules/DashboardHeader'
import ProgressCard from '../molecules/ProgressCard'
import ProjectCard from '../molecules/ProjectCard'
import TaskGroup from '../molecules/TaskGroup'
import BottomNavigation from '../molecules/BottomNavigation'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  
  // Mock data
  const todayProgress = 85
  const projects = [
    { id: 1, title: 'Grocery shopping app design', category: t('officeProject'), progress: 75, color: 'blue' },
    { id: 2, title: 'Uber Eats redesign challenge', category: t('personalProject'), progress: 45, color: 'orange' }
  ]
  
  const taskGroups = [
    { id: 1, title: t('officeProject'), taskCount: 23, progress: 70, color: 'bg-pink-100', iconColor: '#EC4899' },
    { id: 2, title: t('personalProject'), taskCount: 30, progress: 52, color: 'bg-purple-100', iconColor: '#8B5CF6' },
    { id: 3, title: t('dailyStudy'), taskCount: 30, progress: 87, color: 'bg-orange-100', iconColor: '#F97316' },
    { id: 4, title: t('dailyStudy'), taskCount: 12, progress: 25, color: 'bg-yellow-100', iconColor: '#FBBF24' }
  ]
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <DashboardHeader />
      
      <div className="p-4 space-y-6">
        {/* Today's Progress Card */}
        <ProgressCard percentage={todayProgress} />
        
        {/* In Progress Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">{t('inProgress')} <span className="text-sm text-gray-500 font-normal">{projects.length}</span></h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                title={project.title}
                category={project.category}
                progress={project.progress}
                color={project.color as 'blue' | 'orange' | 'purple' | 'green'}
                onClick={() => console.log(`Navigate to project ${project.id}`)}
              />
            ))}
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
                    {group.id === 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {group.id === 2 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {group.id === 3 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                    {group.id === 4 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                }
                onClick={() => console.log(`Navigate to task group ${group.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default Dashboard
