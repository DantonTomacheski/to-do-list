import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useTaskStore, TaskStatus as StoreTaskStatus } from '../store/taskStore';
import ProjectTasksTemplate from '../templates/ProjectTasksTemplate';
import { TaskStatus } from '../atoms/ProjectTasksAtoms';

// Task modal component will be imported here when created
// import TaskModal from '../organisms/TaskModal';

const ProjectTasksPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Translation strings are needed in EmptyState and other components
  const { t } = useTranslation();
  
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<TaskStatus>('All');
  const [isLoading, setIsLoading] = useState(true);
  // This will be used when the TaskModal component is implemented
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Zustand store
  const {
    tasks,
    getProjectById,
    updateTask,
    deleteTask, // Using deleteTask instead of removeTask to match the store
    // addTask will be used when task modal is implemented
  } = useTaskStore();
  
  // Project data
  const project = projectId ? getProjectById(projectId) : null;
  
  // Handle project not found
  useEffect(() => {
    if (projectId && !project) {
      // If project doesn't exist, redirect to projects list
      navigate('/projects', { replace: true });
    } else {
      // Set loading false after a brief delay to simulate loading
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [projectId, project, navigate]);
  
  // Function to get filtered tasks
  const filteredTasks = useCallback(() => {
    if (!projectId) return [];
    
    // Format selected date to ISO string for comparison
    const selectedDateISO = format(selectedDate, 'yyyy-MM-dd');
    
    return tasks.filter(task => {
      // Filter by project
      if (task.projectId !== projectId) return false;
      
      // Filter by date (comparing only the date part)
      if (!task.date || task.date.slice(0, 10) !== selectedDateISO) return false;
      
      // Filter by status
      if (statusFilter !== 'All' && task.status !== statusFilter) return false;
      
      return true;
    });
  }, [projectId, tasks, selectedDate, statusFilter]);
  
  // Project name and color helpers for TaskList
  const getProjectName = useCallback((id: string) => {
    const project = getProjectById(id);
    return project ? project.name : '';
  }, [getProjectById]);
  
  const getProjectColor = useCallback((id: string) => {
    const project = getProjectById(id);
    return project ? project.color : 'bg-gray-100 text-gray-800';
  }, [getProjectById]);
  
  // Handlers
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleStatusChange = (status: TaskStatus) => {
    setStatusFilter(status);
  };
  
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    // Only process valid status values (exclude 'All')
    if (newStatus !== 'All') {
      // Cast to StoreTaskStatus to ensure compatibility
      updateTask(taskId, { status: newStatus as StoreTaskStatus });
    }
  };
  
  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
  };
  
  const handleAddTask = () => {
    // Open task modal
    setIsTaskModalOpen(true);
  };
  
  const handleBack = () => {
    navigate(`/projects/${projectId}`);
  };
  
  if (!project) {
    return null; // Or a loading spinner
  }
  
  return (
    <>
      <ProjectTasksTemplate
        projectId={projectId || ''}
        projectName={project.name}
        selectedDate={selectedDate}
        onSelectDate={handleDateChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        tasks={filteredTasks()}
        isLoading={isLoading}
        onTaskStatusChange={handleTaskStatusChange}
        onTaskDelete={handleTaskDelete}
        onAddTask={handleAddTask}
        onBack={handleBack}
        getProjectName={getProjectName}
        getProjectColor={getProjectColor}
      />
      
      {/* Task Modal will be added here when implemented */}
      {/* {isTaskModalOpen && (
        <TaskModal
          projectId={projectId}
          initialDate={format(selectedDate, 'yyyy-MM-dd')}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={(taskData) => {
            // Add task to store
            addTask({
              ...taskData,
              projectId,
              date: taskData.date || format(selectedDate, 'yyyy-MM-dd'),
              status: 'To-do'
            });
            setIsTaskModalOpen(false);
          }}
        />
      )} */}
    </>
  );
};

export default ProjectTasksPage;
