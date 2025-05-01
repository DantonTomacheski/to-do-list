import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO, isAfter, isBefore, startOfToday } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { 
  FieldLabel, 
  InputBase, 
  TextareaBase, 
  DropdownBtn, 
  DateBtn, 
  LogoTile, 
  PrimaryCTA 
} from '../atoms/FormComponents';
import DropdownPopover, { TaskGroup } from '../molecules/DropdownPopover';
import DatePickerSheet from '../molecules/DatePickerSheet';
import ImagePicker from '../molecules/ImagePicker';
import NewGroupDialog from '../molecules/NewGroupDialog';
import useDateUtils from '../hooks/useDateUtils';

// Project data interface
export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  groupId: string;
  logo?: string | null;
  startDate: string;
  endDate: string | null;
  color?: string;
}

interface ProjectFormProps {
  initialData?: ProjectData;
  groups: TaskGroup[];
  onAddGroup: (name: string) => Promise<TaskGroup>;
  onSave: (data: ProjectData) => Promise<void>;
  isLoading?: boolean;
  onDelete?: () => Promise<void>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  groups,
  onAddGroup,
  onSave,
  isLoading = false,
  onDelete
}) => {
  const { t } = useTranslation();
  const { getTodayFormatted } = useDateUtils();
  const isEditMode = !!initialData?.id;
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedGroup, setSelectedGroup] = useState<TaskGroup | null>(
    initialData?.groupId 
      ? groups.find(g => g.id === initialData.groupId) || null 
      : null
  );
  const [logo, setLogo] = useState<string | null>(initialData?.logo || null);
  const [startDate, setStartDate] = useState<string | null>(initialData?.startDate || getTodayFormatted());
  const [endDate, setEndDate] = useState<string | null>(initialData?.endDate || null);
  
  // UI state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  // Form dirty state is now tracked via window.__formDirty
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Focus name input on mount
  useEffect(() => {
    if (nameInputRef.current && !isEditMode) {
      nameInputRef.current.focus();
    }
  }, [isEditMode]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  // Track form changes and expose to parent component via ref
  useEffect(() => {
    // Use the parentRef to expose form dirty state to parent component
    if (
      name !== (initialData?.name || '') ||
      description !== (initialData?.description || '') ||
      selectedGroup?.id !== (initialData?.groupId || null) ||
      logo !== (initialData?.logo || null) ||
      startDate !== (initialData?.startDate || null) ||
      endDate !== (initialData?.endDate || null)
    ) {
      // Update parent ref if provided
      if (typeof window !== 'undefined') {
        // Store in window for parent component to access using a type-safe approach
        // First cast to unknown, then to the expected type with the property
        (window as unknown as { __formDirty: boolean }).__formDirty = true;
      }
    } else {
      if (typeof window !== 'undefined') {
        // Same approach for setting to false
        (window as unknown as { __formDirty: boolean }).__formDirty = false;
      }
    }
  }, [name, description, selectedGroup, logo, startDate, endDate, initialData]);
  
  // Validate form - wrapped in useCallback to avoid dependency changes
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    
    // Validate required fields
    if (!name.trim()) {
      errors.name = t('projectNameRequired');
    } else if (name.trim().length < 3) {
      errors.name = t('projectNameTooShort');
    } else if (name.trim().length > 40) {
      errors.name = t('projectNameTooLong');
    }
    
    if (description.length > 200) {
      errors.description = t('descriptionTooLong');
    }
    
    if (!selectedGroup) {
      errors.group = t('selectTaskGroup');
    }
    
    // Validate dates
    if (!startDate) {
      errors.startDate = t('startDateRequired');
    } else {
      const today = startOfToday();
      const parsedStartDate = parseISO(startDate);
      
      if (isBefore(parsedStartDate, today)) {
        errors.startDate = t('startDateCannotBeInPast');
      }
      
      if (endDate) {
        const parsedEndDate = parseISO(endDate);
        
        if (isBefore(parsedEndDate, parsedStartDate)) {
          errors.endDate = t('endDateMustBeAfterStart');
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [name, description, selectedGroup, startDate, endDate, t]);
  
  // Handle group selection
  const handleGroupSelect = (group: TaskGroup) => {
    setSelectedGroup(group);
    setDropdownOpen(false);
    setFormErrors(prev => ({ ...prev, group: '' }));
  };
  
  // Handle new group creation
  const handleAddNewGroup = async (name: string) => {
    try {
      const newGroup = await onAddGroup(name);
      setSelectedGroup(newGroup);
      setFormErrors(prev => ({ ...prev, group: '' }));
    } catch (error) {
      console.error('Error creating new group:', error);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSave({
        id: initialData?.id,
        name: name.trim(),
        description: description.trim(),
        groupId: selectedGroup!.id,
        logo,
        startDate: startDate!,
        endDate,
        color: selectedGroup!.color
      });
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };
  
  // Handle logo removal via long press
  const handleRemoveLogo = () => {
    setLogo(null);
  };
  
  // Handle keyboard shortcut for submission (Cmd+Enter or Ctrl+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (validateForm()) {
          // Trigger form submission
          const form = document.getElementById('project-form') as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validateForm]);
  
  // Determine form validity
  const isFormValid = name.trim() !== '' && 
                      selectedGroup !== null && 
                      startDate !== null;
                      
  // Log form validity state for debugging
  useEffect(() => {
    console.log('Form validation state:', {
      name: Boolean(name.trim()),
      selectedGroup: Boolean(selectedGroup),
      startDate: Boolean(startDate),
      formErrors,
      isFormValid
    });
  }, [name, selectedGroup, startDate, formErrors, isFormValid]);
  
  return (
    <form id="project-form" onSubmit={handleSubmit} className="p-4 space-y-6">
      {/* Task Group Selection */}
      <div className="relative" ref={dropdownRef}>
        <FieldLabel htmlFor="task-group" required>
          {t('taskGroup')}
        </FieldLabel>
        <DropdownBtn
          label={selectedGroup ? selectedGroup.name : t('selectTaskGroup')}
          isOpen={dropdownOpen}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          error={formErrors.group}
        />
        
        {dropdownOpen && (
          <DropdownPopover
            groups={groups}
            selectedGroupId={selectedGroup?.id || null}
            onSelect={handleGroupSelect}
            onAddNew={() => {
              setDropdownOpen(false);
              setNewGroupDialogOpen(true);
            }}
          />
        )}
      </div>
      
      {/* Project Name */}
      <div>
        <FieldLabel htmlFor="project-name" required>
          {t('projectName')}
        </FieldLabel>
        <InputBase
          ref={nameInputRef}
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim() && formErrors.name) {
              setFormErrors(prev => ({ ...prev, name: '' }));
            }
          }}
          placeholder={t('enterProjectName')}
          maxLength={40}
          error={formErrors.name}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">
            {name.length}/40
          </span>
        </div>
      </div>
      
      {/* Description */}
      <div>
        <FieldLabel htmlFor="project-description">
          {t('description')}
        </FieldLabel>
        <TextareaBase
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('enterDescription')}
          maxLength={200}
          characterCount={description.length}
          error={formErrors.description}
        />
      </div>
      
      {/* Start Date */}
      <div>
        <FieldLabel htmlFor="start-date" required>
          {t('startDate')}
        </FieldLabel>
        <DateBtn
          date={startDate ? format(parseISO(startDate), 'PPP', { locale: navigator.language === 'pt-BR' ? ptBR : enUS }) : null}
          onClick={() => setStartDatePickerOpen(true)}
          placeholder={t('selectStartDate')}
          error={formErrors.startDate}
        />
      </div>
      
      {/* End Date */}
      <div>
        <FieldLabel htmlFor="end-date">
          {t('endDate')}
        </FieldLabel>
        <DateBtn
          date={endDate ? format(parseISO(endDate), 'PPP', { locale: navigator.language === 'pt-BR' ? ptBR : enUS }) : null}
          onClick={() => setEndDatePickerOpen(true)}
          placeholder={t('selectEndDate')}
          error={formErrors.endDate}
        />
      </div>
      
      {/* Logo */}
      <div>
        <FieldLabel htmlFor="project-logo">
          {t('logo')}
        </FieldLabel>
        <LogoTile
          logo={logo}
          onClick={() => setImagePickerOpen(true)}
          onLongPress={handleRemoveLogo}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="pt-4">
        <PrimaryCTA 
          type="submit" 
          disabled={!isFormValid} 
          isLoading={isLoading}
        >
          {isEditMode ? t('saveChanges') : t('addProject')}
        </PrimaryCTA>
        
        {isEditMode && onDelete && (
          <button
            type="button"
            className="w-full mt-3 py-3 text-red-600 hover:text-red-700 transition-colors duration-150"
            onClick={onDelete}
          >
            {t('deleteProject')}
          </button>
        )}
      </div>
      
      {/* Date Picker Sheets */}
      {startDatePickerOpen && (
        <DatePickerSheet
          title={t('selectStartDate')}
          selectedDate={startDate}
          minDate={getTodayFormatted()}
          onSelect={(date) => {
            setStartDate(date);
            setFormErrors(prev => ({ ...prev, startDate: '' }));
            
            // Adjust end date if needed
            if (endDate && isAfter(parseISO(date), parseISO(endDate))) {
              setEndDate(date);
            }
          }}
          onClose={() => setStartDatePickerOpen(false)}
        />
      )}
      
      {endDatePickerOpen && (
        <DatePickerSheet
          title={t('selectEndDate')}
          selectedDate={endDate}
          minDate={startDate}
          onSelect={(date) => {
            setEndDate(date);
            setFormErrors(prev => ({ ...prev, endDate: '' }));
          }}
          onClose={() => setEndDatePickerOpen(false)}
        />
      )}
      
      {/* Image Picker */}
      {imagePickerOpen && (
        <ImagePicker
          onSelect={(imageData) => {
            setLogo(imageData);
          }}
          onClose={() => setImagePickerOpen(false)}
        />
      )}
      
      {/* New Group Dialog */}
      {newGroupDialogOpen && (
        <NewGroupDialog
          isOpen={newGroupDialogOpen}
          onSave={handleAddNewGroup}
          onClose={() => setNewGroupDialogOpen(false)}
        />
      )}
    </form>
  );
};

export default ProjectForm;
