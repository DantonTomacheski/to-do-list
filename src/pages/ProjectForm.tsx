import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBar from '../molecules/HeaderBar';
import ModalTemplate from '../templates/ModalTemplate';
import ProjectForm, { ProjectData } from '../organisms/ProjectForm';
import { useTaskStore } from '../store/taskStore';

// Toast component for notifications
const Toast: React.FC<{ message: string; type?: 'success' | 'error' }> = ({ 
  message, 
  type = 'success' 
}) => {
  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg animate-fade-in
      ${type === 'success' ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'}`}
    >
      {message}
    </div>
  );
};

// Confirmation dialog for discarding changes
const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-modal flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 animate-scale-in">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        
        <div className="p-4">
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-150"
            onClick={onCancel}
          >
            {title === 'Delete Project' ? 'Cancel' : 'Keep Editing'}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-white rounded-lg transition-colors duration-150 active:scale-95
              ${title === 'Delete Project' ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            onClick={onConfirm}
          >
            {title === 'Delete Project' ? 'Delete' : 'Discard'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectFormPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // Get store actions
  const { 
    addProject, 
    updateProject, 
    deleteProject, 
    getProjectById,
    projects
  } = useTaskStore();
  
  // Combine default groups with any existing project types for dropdown
  const [groups, setGroups] = useState<{ id: string; name: string; color: string }[]>([]);
  
  // Update groups when projects change or language changes
  useEffect(() => {
    // Task groups for dropdown - defined inside useEffect to avoid dependency changes
    const defaultGroups = [
      { id: 'office', name: t('officeProject'), color: 'bg-pink-100' },
      { id: 'personal', name: t('personalProject'), color: 'bg-purple-100' },
      { id: 'study', name: t('dailyStudy'), color: 'bg-orange-100' }
    ];
    
    // Combine default groups with project groups, avoid duplicates
    const allGroups = [
      ...defaultGroups,
      ...projects
        .filter(p => !defaultGroups.some(dg => dg.id === p.id))
        .map(p => ({ id: p.id, name: p.name, color: p.color }))
    ];
    
    // Remove duplicates
    const uniqueGroups = allGroups.filter((group, index, self) => 
      index === self.findIndex(g => g.id === group.id)
    );
    
    setGroups(uniqueGroups);
  }, [projects, t]);
  
  // Get project data for edit mode
  const [initialData, setInitialData] = useState<ProjectData | undefined>(undefined);
  
  useEffect(() => {
    if (isEditMode && id) {
      const project = getProjectById(id);
      if (project) {
        setInitialData({
          id: project.id,
          name: project.name,
          description: project.description || '',
          groupId: project.id,
          logo: project.icon,
          startDate: project.createdAt.split('T')[0],
          endDate: null,
          color: project.color
        });
      }
    }
  }, [isEditMode, id, getProjectById]);
  
  // UI state
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogType, setConfirmDialogType] = useState<'discard' | 'delete'>('discard');
  
  // Track if form is dirty for confirmation
  const formDirtyRef = useRef(false);
  
  // Show toast message
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    if (formDirtyRef.current) {
      setConfirmDialogType('discard');
      setConfirmDialogOpen(true);
    } else {
      setIsModalOpen(false);
      setTimeout(() => navigate(-1), 300);
    }
  };
  
  // Handle form submission
  const handleSaveProject = async (data: ProjectData) => {
    setIsLoading(true);
    
    try {
      if (isEditMode && data.id) {
        // Update existing project
        await updateProject(data.id, {
          name: data.name,
          description: data.description,
          color: data.color || 'bg-purple-100',
          icon: data.logo || undefined
        });
        showToast(t('projectUpdated'));
      } else {
        // Add new project
        await addProject({
          name: data.name,
          description: data.description,
          color: data.color || 'bg-purple-100',
          icon: data.logo || undefined
        });
        showToast(t('projectAdded'));
      }
      
      // Close modal and navigate back
      setIsModalOpen(false);
      setTimeout(() => navigate(-1), 300);
    } catch (error) {
      console.error('Error saving project:', error);
      showToast(t('errorSavingProject'), 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle project deletion
  const handleDeleteConfirm = async () => {
    if (isEditMode && id) {
      setIsLoading(true);
      try {
        await deleteProject(id);
        showToast(t('projectDeleted'));
        setIsModalOpen(false);
        setTimeout(() => navigate(-1), 300);
      } catch (error) {
        console.error('Error deleting project:', error);
        showToast(t('errorDeletingProject'), 'error');
      } finally {
        setIsLoading(false);
        setConfirmDialogOpen(false);
      }
    }
  };
  
  // Handle discard confirmation
  const handleDiscardConfirm = () => {
    setConfirmDialogOpen(false);
    setIsModalOpen(false);
    setTimeout(() => navigate(-1), 300);
  };
  
  // Handle adding a new group
  const handleAddGroup = async (name: string) => {
    // Generate a unique ID for the new group
    const newGroupId = `group-${Date.now()}`;
    
    // Generate a random color from available colors
    const colors = ['bg-pink-100', 'bg-purple-100', 'bg-orange-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create a new group
    const newGroup = {
      id: newGroupId,
      name,
      color: randomColor
    };
    
    // Add to local state
    setGroups(prev => [...prev, newGroup]);
    
    return newGroup;
  };
  
  return (
    <>
      <ModalTemplate 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        modalId="project-form-modal"
        modalTitle={isEditMode ? t('editProject') : t('addProject')}
      >
        <div className="flex flex-col min-h-[50vh]">
          <HeaderBar 
            title={isEditMode ? t('editProject') : t('addProject')} 
            onBack={handleCloseModal} 
            titleId="project-form-title"
          />
          
          {(initialData || !isEditMode) && (
            <ProjectForm 
              initialData={initialData} 
              groups={groups}
              onAddGroup={handleAddGroup}
              onSave={handleSaveProject}
              isLoading={isLoading}
              onDelete={isEditMode ? async () => {
                setConfirmDialogType('delete');
                setConfirmDialogOpen(true);
                return Promise.resolve();
              } : undefined}
            />
          )}
        </div>
      </ModalTemplate>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog 
        isOpen={confirmDialogOpen}
        title={confirmDialogType === 'delete' ? t('deleteProject') : t('discardChanges')}
        message={confirmDialogType === 'delete' 
          ? t('deleteProjectConfirmation') 
          : t('discardChangesConfirmation')
        }
        onConfirm={confirmDialogType === 'delete' ? handleDeleteConfirm : handleDiscardConfirm}
        onCancel={() => setConfirmDialogOpen(false)}
      />
      
      {/* Toast */}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </>
  );
};

export default ProjectFormPage;
