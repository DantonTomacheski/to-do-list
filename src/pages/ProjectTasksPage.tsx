import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTaskStore, TaskStatus as StoreTaskStatus, Task } from '../store/taskStore';
import ProjectTasksTemplate from '../templates/ProjectTasksTemplate';
import { TaskStatus } from '../atoms/ProjectTasksAtoms';

// Criamos um tipo intermediário que é compatível com ambos os tipos de status
type CombinedTaskStatus = StoreTaskStatus | 'All';

const ProjectTasksPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // useTranslation é usado pelos componentes filhos, não precisamos extrair o 't' aqui
  useTranslation();
  
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<CombinedTaskStatus>('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Zustand store
  const {
    tasks,
    getProjectById,
    updateTask,
    deleteTask,
    addTask,
    addTaskToProject
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
    
    // Formatamos a data usando o mesmo método que usamos no TaskFormModal para manter consistência
    // Isso evita problemas de fuso horário que podem fazer com que a data seja deslocada em um dia
    const selectedDateISO = [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, '0'),
      String(selectedDate.getDate()).padStart(2, '0')
    ].join('-');

    // Habilitamos logs em modo de desenvolvimento apenas quando necessário
    // const debug = (message: string, data: any) => console.log(message, data);
    
    return tasks.filter(task => {
      // Filter by project
      if (task.projectId !== projectId) {
        return false;
      }
      
      // Filter by date (comparing only the date part)
      // Certifique-se de que a data da tarefa é tratada corretamente
      if (!task.date) {
        return false;
      }
      
      // Normalizar a data da tarefa para garantir que é YYYY-MM-DD
      const taskDate = task.date.slice(0, 10);
      
      if (taskDate !== selectedDateISO) {
        return false;
      }
      
      // Filter by status
      if (statusFilter !== 'All' && task.status !== statusFilter) {
        return false;
      }
      
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
  
  const handleStatusChange = (status: CombinedTaskStatus) => {
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
  
  const handleEditTask = (taskId: string, updatedTaskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    updateTask(taskId, updatedTaskData);
  };
  
  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (projectId) {
      // Adicionando a tarefa ao Zustand
      const taskId = addTask(taskData);
      // Associando a tarefa ao projeto
      addTaskToProject(projectId, taskId);
    }
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
        onEditTask={handleEditTask}
        onBack={handleBack}
        getProjectName={getProjectName}
        getProjectColor={getProjectColor}
      />
      
      {/* TaskFormModal é agora integrado diretamente no ProjectTasksTemplate */}
    </>
  );
};

export default ProjectTasksPage;
