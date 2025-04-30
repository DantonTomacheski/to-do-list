import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalTemplate from "../templates/ModalTemplate";
import { Task, TaskStatus } from "../store/taskStore";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  projectId: string;
  selectedDate: Date;
  initialTask?: Task;
  isEditing?: boolean;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  selectedDate,
  initialTask,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(initialTask?.priority || "Medium");
  const [time, setTime] = useState(initialTask?.time || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError(t("taskTitleRequired"));
      return;
    }
    
    if (title.length < 3) {
      setError(t("taskTitleTooShort"));
      return;
    }
    
    // Se estiver editando, manter a data original da tarefa
    // Caso contrário, usar a data selecionada no calendário
    let formattedDate;
    
    if (isEditing && initialTask?.date) {
      // Manter a data original da tarefa durante a edição
      formattedDate = initialTask.date;
    } else {
      // Usar o formato ISO localizado (YYYY-MM-DD) utilizando a data em UTC
      // para garantir que não ocorra mudança de dia devido ao fuso horário
      const year = selectedDate.getUTCFullYear();
      const month = String(selectedDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getUTCDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    // Create task data
    const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: title.trim(),
      description: description.trim() || undefined,
      projectId,
      status: initialTask?.status || "To-do" as TaskStatus,
      date: formattedDate,
      time: time || undefined,
      priority,
    };
    
    // Submit and close
    onSubmit(taskData);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setTime("");
    setError(null);
  };
  
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalTemplate 
      isOpen={isOpen} 
      onClose={handleCancel}
      modalId="task-form-modal"
      modalTitle={t(isEditing ? "editTask" : "addTask")}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6" id="task-form-modal">
          {t(isEditing ? "editTask" : "addTask")}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
              {t("taskTitle")}
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={t("enterTaskTitle")}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
              {t("description")}
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={t("enterTaskDescription")}
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="task-time" className="block text-sm font-medium text-gray-700 mb-1">
              {t("time")} ({t("optional")})
            </label>
            <input
              id="task-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("priority")}
            </label>
            <div className="flex space-x-2">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as "Low" | "Medium" | "High")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
                    priority === p 
                      ? "bg-purple-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t(p.toLowerCase())}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              type="button" 
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
              onClick={handleCancel}
            >
              {t("cancel")}
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              {t(isEditing ? "update" : "save")}
            </button>
          </div>
        </form>
      </div>
    </ModalTemplate>
  );
};

export default TaskFormModal;
