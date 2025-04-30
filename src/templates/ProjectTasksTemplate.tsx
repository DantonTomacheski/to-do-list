import React from 'react';
// import { format } from 'date-fns';
import HeaderBar from '../molecules/HeaderBar';
import HorizontalCalendar from '../molecules/HorizontalCalendar';
import StatusFilterBar from '../molecules/StatusFilterBar';
import TaskList from '../organisms/TaskList';
import EmptyState from '../organisms/EmptyState';
import BottomNavStub from '../organisms/BottomNavStub';
import { TaskStatus, Task } from '../store/taskStore';
import { useTranslation } from 'react-i18next';

interface ProjectTasksTemplateProps {
  projectId: string;
  projectName: string;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  statusFilter: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  tasks: Task[];
  isLoading: boolean;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: () => void;
  onBack: () => void;
  getProjectName: (projectId: string) => string;
  getProjectColor: (projectId: string) => string;
}

const ProjectTasksTemplate: React.FC<ProjectTasksTemplateProps> = ({
  // projectId is used by child components
  projectId,
  projectName,
  selectedDate,
  onSelectDate,
  statusFilter,
  onStatusChange,
  tasks,
  isLoading,
  onTaskStatusChange,
  onTaskDelete,
  onAddTask,
  onBack,
  getProjectName,
  getProjectColor
}) => {
  const { t } = useTranslation();
  // const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar
        title={projectName}
        onBack={onBack}
        showBell={true}
        titleId="projectTitle"
      />
      
      <main aria-labelledby="projectTitle">
        <HorizontalCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
        
        <StatusFilterBar
          activeStatus={statusFilter}
          onStatusChange={onStatusChange}
        />
        
        {!isLoading && tasks.length === 0 && (
          <EmptyState
            title={t('noTasksYet')}
            description={t('addYourFirstTaskToThisProject')}
            actionLabel={t('addTask')}
            onAction={onAddTask}
            illustration="task"
          />
        )}
        
        <TaskList
          tasks={tasks}
          onStatusChange={onTaskStatusChange}
          onDelete={onTaskDelete}
          isLoading={isLoading}
          getProjectName={getProjectName}
          getProjectColor={getProjectColor}
        />
      </main>
      
      <BottomNavStub onAddClick={onAddTask} />
    </div>
  );
};

export default ProjectTasksTemplate;
