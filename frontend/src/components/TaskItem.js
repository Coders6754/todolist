import React from 'react';

const TaskItem = ({ task }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <p className="text-gray-800 font-medium break-words flex-grow">{task.text}</p>
        <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
          {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default TaskItem; 