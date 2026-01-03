import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import Conditional from '@/components/Conditional';
import { useTasks, useAuth } from '@/hooks';
import { TTaskFormData } from '@/types';

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { createTask, tasks, loading, updateTask, deleteTask } = useTasks();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  const handleCreateTask = async (taskData: TTaskFormData) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  function toggleDarkMode() {
    setIsDark(prevIsDark => !prevIsDark);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user && (
              <p className="mt-1 text-sm text-gray-600">
                Welcome, {user.name || user.username}!
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {showForm ? 'Cancel' : 'New Task'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Dark mode button */}
        <div className='mb-4'>
          <button onClick={toggleDarkMode} className='px-4 py-2 text-black bg-white rounded dark:bg-black dark:text-white'>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>  

        <Conditional show={showForm}>
          <div className="p-6 mb-8 bg-white rounded-lg shadow-md dark:bg-black dark:text-white">
            <TaskForm onSubmit={handleCreateTask} />
          </div>
        </Conditional>
        
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-black dark:text-white">
          <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
          <TaskList 
            tasks={tasks} 
            loading={loading}
            updateTask={updateTask}
            deleteTask={deleteTask} 
          />
        </div>
      </div>
    </div>
  );
};

