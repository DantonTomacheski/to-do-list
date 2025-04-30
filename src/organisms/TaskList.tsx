import React from 'react';
import TaskCard from '../molecules/TaskCard';
import { Task, TaskStatus } from '../store/taskStore';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (taskId: string, updatedTaskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  isLoading?: boolean;
  getProjectName?: (projectId: string) => string;
  getProjectColor?: (projectId: string) => string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onStatusChange,
  onDelete,
  onEdit,
  isLoading = false,
  getProjectName,
  getProjectColor
}) => {

  if (isLoading) {
    // Return skeleton loaders when loading
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map(index => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-4 animate-pulse h-24"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3 mt-2"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return null; // EmptyState will be rendered by the parent component
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-240px)]">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onEdit={onEdit}
          projectName={task.projectId && getProjectName ? getProjectName(task.projectId) : undefined}
          projectColor={task.projectId && getProjectColor ? getProjectColor(task.projectId) : undefined}
        />
      ))}
    </div>
  );
};

export default TaskList;
