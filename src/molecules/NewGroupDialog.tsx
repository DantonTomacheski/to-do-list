import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InputBase } from '../atoms/FormComponents';

interface NewGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const NewGroupDialog: React.FC<NewGroupDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setError(null);
    }
  }, [isOpen]);
  
  // Handle save
  const handleSave = () => {
    // Validate
    if (!name.trim()) {
      setError(t('groupNameRequired'));
      return;
    }
    
    if (name.trim().length < 3) {
      setError(t('groupNameTooShort'));
      return;
    }
    
    onSave(name.trim());
    onClose();
  };
  
  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-modal flex items-center justify-center animate-fade-in">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 animate-scale-in"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="new-group-dialog-title"
      >
        <div className="p-4 border-b border-gray-100">
          <h2 
            id="new-group-dialog-title" 
            className="text-lg font-semibold text-gray-800"
          >
            {t('newGroup')}
          </h2>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="group-name" className="text-sm text-gray-700 mb-1 block">
              {t('groupName')}
            </label>
            <InputBase
              ref={inputRef}
              id="group-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterGroupName')}
              error={error || undefined}
              maxLength={30}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-150"
            onClick={onClose}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150 active:scale-95"
            onClick={handleSave}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupDialog;
