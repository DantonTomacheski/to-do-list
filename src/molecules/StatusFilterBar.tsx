import React from 'react';
import { StatusChip, TaskStatus } from '../atoms/ProjectTasksAtoms';

interface StatusFilterBarProps {
  activeStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

const StatusFilterBar: React.FC<StatusFilterBarProps> = ({
  activeStatus,
  onStatusChange
}) => {
  const statuses: TaskStatus[] = ['All', 'To-do', 'In Progress', 'Done'];

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100 overflow-x-auto">
      <div className="flex gap-2">
        {statuses.map(status => (
          <StatusChip
            key={status}
            status={status}
            isActive={status === activeStatus}
            onClick={() => onStatusChange(status)}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusFilterBar;
