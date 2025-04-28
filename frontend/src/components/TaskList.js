import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-8 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>Error loading tasks: {error}</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No tasks yet. Add your first task!</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {tasks.map((task, index) => (
        <TaskItem key={task._id || index} task={task} />
      ))}
    </div>
  );
};

export default TaskList; 