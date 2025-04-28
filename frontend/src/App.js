import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:3001/api/fetchAllTasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskText.trim()) return;
    
    try {
      await axios.post('http://localhost:3001/api/simulate-mqtt', { message: taskText });
      setTaskText('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200 overflow-hidden">
        {/* Note App Header */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 mr-3 rounded-lg flex-shrink-0">
            <svg className="w-full h-full rounded-lg" viewBox="0 0 24 24">
              <rect width="24" height="24" fill="#8B4513" />
              <rect y="4" width="24" height="20" fill="#FFFAF0" stroke="#8B4513" strokeWidth="1" />
              <line x1="0" y1="8" x2="24" y2="8" stroke="#8B4513" strokeWidth="1" />
              <line x1="0" y1="12" x2="24" y2="12" stroke="#8B4513" strokeWidth="0.5" />
              <line x1="0" y1="16" x2="24" y2="16" stroke="#8B4513" strokeWidth="0.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Note App</h1>
        </div>
        
        {/* New Note Form */}
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="New Note..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-800 text-white rounded-lg flex items-center hover:bg-amber-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add
          </button>
        </form>
        
        {/* Notes Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Notes</h2>
        
        {/* Notes List with Scrollbar */}
        {isLoading ? (
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-800"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            Error: {error}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-64 pr-1 -mr-1" style={{ scrollbarWidth: 'thin' }}>
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notes yet.</p>
            ) : (
              [...tasks].reverse().map((task, index) => (
                <div 
                  key={task._id || task.id || index} 
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <p className="text-gray-800">{task.text}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
