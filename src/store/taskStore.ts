import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TaskStatus = 'To-do' | 'In Progress' | 'Done'

export interface Task {
  id: string
  title: string
  description?: string
  projectId?: string
  status: TaskStatus
  date: string // ISO format date
  time?: string // Optional time
  priority?: 'Low' | 'Medium' | 'High'
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  createdAt: string
  updatedAt: string
  tasks: string[] // task IDs
}

interface TaskStore {
  tasks: Task[]
  projects: Project[]
  selectedDate: string
  activeStatusFilter: 'All' | TaskStatus
  isLoading: boolean

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteTask: (taskId: string) => void
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => string
  updateProject: (projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteProject: (projectId: string) => void
  addTaskToProject: (projectId: string, taskId: string) => void
  removeTaskFromProject: (projectId: string, taskId: string) => void
  
  // Calendar view actions
  selectDate: (date: string) => void
  setStatusFilter: (filter: 'All' | TaskStatus) => void
  
  // Getters
  getTasksForDate: (date: string) => Task[]
  getFilteredTasksForDate: () => Task[]
  getTaskById: (taskId: string) => Task | undefined
  getProjectById: (projectId: string) => Project | undefined
  getProjectsWithProgress: () => Array<Project & { progress: number }>
  getTodayProgress: () => { total: number; completed: number; percentage: number }
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [],
      selectedDate: new Date().toISOString().split('T')[0], // Default to today
      activeStatusFilter: 'All',
      isLoading: false,

      // Task actions
      addTask: (taskData) => {
        const id = `task-${Date.now()}`
        const now = new Date().toISOString()
        const newTask: Task = {
          id,
          ...taskData,
          createdAt: now,
          updatedAt: now
        }

        set((state) => ({
          tasks: [...state.tasks, newTask]
        }))

        return id
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === taskId 
              ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
              : task
          )
        }))
      },

      deleteTask: (taskId) => {
        // Remove from projects first
        const task = get().tasks.find(t => t.id === taskId)
        if (task?.projectId) {
          get().removeTaskFromProject(task.projectId, taskId)
        }

        // Then remove the task
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId)
        }))
      },

      updateTaskStatus: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === taskId 
              ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } 
              : task
          )
        }))
      },

      // Project actions
      addProject: (projectData) => {
        const id = `project-${Date.now()}`
        const now = new Date().toISOString()
        const newProject: Project = {
          id,
          ...projectData,
          tasks: [],
          createdAt: now,
          updatedAt: now
        }

        set((state) => ({
          projects: [...state.projects, newProject]
        }))

        return id
      },

      updateProject: (projectId, updates) => {
        set((state) => ({
          projects: state.projects.map((project) => 
            project.id === projectId 
              ? { ...project, ...updates, updatedAt: new Date().toISOString() } 
              : project
          )
        }))
      },

      deleteProject: (projectId) => {
        // First, get all task IDs for this project
        const project = get().projects.find(p => p.id === projectId)
        
        if (project) {
          // Update all tasks to remove project association
          project.tasks.forEach(taskId => {
            set((state) => ({
              tasks: state.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, projectId: undefined, updatedAt: new Date().toISOString() } 
                  : task
              )
            }))
          })
        }

        // Then remove the project
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== projectId)
        }))
      },

      addTaskToProject: (projectId, taskId) => {
        // Add task ID to project
        set((state) => ({
          projects: state.projects.map((project) => 
            project.id === projectId 
              ? { 
                  ...project, 
                  tasks: project.tasks.includes(taskId) 
                    ? project.tasks 
                    : [...project.tasks, taskId],
                  updatedAt: new Date().toISOString()
                } 
              : project
          )
        }))

        // Update task with project ID
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === taskId 
              ? { ...task, projectId, updatedAt: new Date().toISOString() } 
              : task
          )
        }))
      },

      removeTaskFromProject: (projectId, taskId) => {
        // Remove task ID from project
        set((state) => ({
          projects: state.projects.map((project) => 
            project.id === projectId 
              ? { 
                  ...project, 
                  tasks: project.tasks.filter(id => id !== taskId),
                  updatedAt: new Date().toISOString()
                } 
              : project
          )
        }))

        // Remove project ID from task if it matches
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === taskId && task.projectId === projectId
              ? { ...task, projectId: undefined, updatedAt: new Date().toISOString() } 
              : task
          )
        }))
      },

      // Calendar view actions
      selectDate: (date) => {
        set({ selectedDate: date })
      },

      setStatusFilter: (filter) => {
        set({ activeStatusFilter: filter })
      },

      // Getters
      getTasksForDate: (date) => {
        return get().tasks.filter(task => task.date === date)
      },

      getFilteredTasksForDate: () => {
        const { tasks, selectedDate, activeStatusFilter } = get()
        
        return tasks.filter(task => {
          // Filter by date
          const dateMatch = task.date === selectedDate
          
          // Filter by status (if not "All")
          const statusMatch = activeStatusFilter === 'All' || task.status === activeStatusFilter
          
          return dateMatch && statusMatch
        })
      },

      getTaskById: (taskId) => {
        return get().tasks.find(task => task.id === taskId)
      },

      getProjectById: (projectId) => {
        return get().projects.find(project => project.id === projectId)
      },

      getProjectsWithProgress: () => {
        const { projects, tasks } = get()
        
        return projects.map(project => {
          const projectTasks = tasks.filter(task => task.projectId === project.id)
          const completedTasks = projectTasks.filter(task => task.status === 'Done')
          const progress = projectTasks.length > 0 
            ? Math.round((completedTasks.length / projectTasks.length) * 100) 
            : 0
          
          return {
            ...project,
            progress
          }
        })
      },

      getTodayProgress: () => {
        const today = new Date().toISOString().split('T')[0]
        const todayTasks = get().tasks.filter(task => task.date === today)
        const completedTasks = todayTasks.filter(task => task.status === 'Done')
        
        return {
          total: todayTasks.length,
          completed: completedTasks.length,
          percentage: todayTasks.length > 0 
            ? Math.round((completedTasks.length / todayTasks.length) * 100) 
            : 0
        }
      }
    }),
    {
      name: 'task-store', // unique name for localStorage
    }
  )
)
