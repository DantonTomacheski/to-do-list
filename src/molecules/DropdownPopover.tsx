import React from 'react';
import { useTranslation } from 'react-i18next';

export interface TaskGroup {
  id: string;
  name: string;
  color: string;
}

interface DropdownPopoverProps {
  groups: TaskGroup[];
  selectedGroupId: string | null;
  onSelect: (group: TaskGroup) => void;
  onAddNew: () => void;
}

const DropdownPopover: React.FC<DropdownPopoverProps> = ({
  groups,
  selectedGroupId,
  onSelect,
  onAddNew,
}) => {
  const { t } = useTranslation();

  return (
    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg z-navigation overflow-hidden animate-scale-in origin-top">
      <div className="max-h-60 overflow-y-auto p-2">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`w-full flex items-center p-3 rounded-lg transition-colors duration-150 
              ${selectedGroupId === group.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
            onClick={() => onSelect(group)}
          >
            <div className={`w-4 h-4 ${group.color} rounded-full mr-3 flex-shrink-0`}></div>
            <span className="text-left text-gray-800">{group.name}</span>
            {selectedGroupId === group.id && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-600 ml-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
      
      <div className="border-t border-gray-100 p-2">
        <button
          type="button"
          className="w-full p-3 flex items-center text-purple-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          onClick={onAddNew}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>{t('newGroup')}</span>
        </button>
      </div>
    </div>
  );
};

export default DropdownPopover;
