import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import Conditional from '@/components/Conditional';
import { useTasks, useAuth } from '@/hooks';
import { TTaskFormData, TaskFilterPreset, TaskFilters } from '@/types';
import { priorityOptions, statusOptions } from '@/constants';

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilters: TaskFilters = useMemo(() => ({
    status: (searchParams.get('status') as TaskFilters['status']) || '',
    priority: (searchParams.get('priority') as TaskFilters['priority']) || '',
    q: searchParams.get('q') || '',
  }), []); 
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [presets, setPresets] = useState<TaskFilterPreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const { createTask, tasks, loading, updateTask, deleteTask } = useTasks(filters);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('taskFilterPresets');
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse filter presets', e);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.q) params.set('q', filters.q);
    setSearchParams(params, { replace: true });
  }, [filters]);

  const handleCreateTask = async (taskData: TTaskFormData) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', q: '' });
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    const next = [...presets.filter((p) => p.name !== presetName.trim()), { name: presetName.trim(), filters }];
    setPresets(next);
    localStorage.setItem('taskFilterPresets', JSON.stringify(next));
    setPresetName('');
  };

  const applyPreset = (name: string) => {
    const preset = presets.find((p) => p.name === name);
    if (preset) {
      setFilters(preset.filters);
    }
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
        <div className='flex flex-wrap gap-3 mb-4'>
          <button onClick={toggleDarkMode} className='px-4 py-2 text-black bg-white rounded dark:bg-black dark:text-white'>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>  

        {/* Filters */}
        <div className="p-4 mb-6 bg-white rounded shadow-sm dark:bg-black dark:text-white">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-white border rounded dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="">All</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 bg-white border rounded dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="">All</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">Search</label>
              <input
                type="text"
                value={filters.q}
                onChange={(e) => handleFilterChange('q', e.target.value)}
                placeholder="Search title or description"
                className="w-full px-3 py-2 bg-white border rounded dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Clear filters
            </button>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name"
              className="px-3 py-2 text-sm bg-white border rounded dark:bg-gray-900 dark:border-gray-700"
            />
            <button
              onClick={savePreset}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Save preset
            </button>
            {presets.length > 0 && (
              <select
                onChange={(e) => applyPreset(e.target.value)}
                defaultValue=""
                className="px-3 py-2 text-sm bg-white border rounded dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="" disabled>Apply preset</option>
                {presets.map((preset) => (
                  <option key={preset.name} value={preset.name}>{preset.name}</option>
                ))}
              </select>
            )}
          </div>
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

