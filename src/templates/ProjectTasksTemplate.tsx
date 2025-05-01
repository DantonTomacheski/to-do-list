import React, { useState } from "react";
import HeaderBar from "../molecules/HeaderBar";
import HorizontalCalendar from "../molecules/HorizontalCalendar";
import StatusFilterBar from "../molecules/StatusFilterBar";
import TaskList from "../organisms/TaskList";
import EmptyState from "../organisms/EmptyState";
import BottomNavigation from "../molecules/BottomNavigation";
import { FabAdd } from "../atoms/ProjectTasksAtoms";
import TaskFormModal from "../organisms/TaskFormModal";
import { TaskStatus, Task } from "../store/taskStore";
import { useTranslation } from "react-i18next";

// Tipo combinado para aceitar TaskStatus ou 'All'
type CombinedTaskStatus = TaskStatus | "All";

interface ProjectTasksTemplateProps {
  projectId: string;
  projectName: string;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  statusFilter: CombinedTaskStatus;
  onStatusChange: (status: CombinedTaskStatus) => void;
  tasks: Task[];
  isLoading: boolean;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onEditTask: (
    taskId: string,
    updatedTaskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => void;
  getProjectName: (projectId: string) => string;
  getProjectColor: (projectId: string) => string;
  onBack?: () => void; // Adicionando a propriedade onBack como opcional
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
  onEditTask,
  getProjectName,
  getProjectColor,
}) => {
  const { t } = useTranslation();
  const [showTaskModal, setShowTaskModal] = useState(false);
  // const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar title={projectName} titleId="projectTitle" />

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
            title={t("noTasksYet")}
            description={t("addYourFirstTaskToThisProject")}
            actionLabel={t("addTask")}
            onAction={() => setShowTaskModal(true)}
            illustration="task"
          />
        )}

        <TaskList
          tasks={tasks}
          onStatusChange={onTaskStatusChange}
          onDelete={onTaskDelete}
          onEdit={onEditTask}
          isLoading={isLoading}
          getProjectName={getProjectName}
          getProjectColor={getProjectColor}
        />
      </main>

      <BottomNavigation />
      <FabAdd onClick={() => setShowTaskModal(true)} />

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={(taskData) => {
          // A data já é formatada dentro do TaskFormModal, então podemos passar diretamente
          // Pass the task data to the parent handler
          onAddTask(taskData);
          setShowTaskModal(false);
        }}
        projectId={projectId}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default ProjectTasksTemplate;
