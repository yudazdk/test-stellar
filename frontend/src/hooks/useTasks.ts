import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Task, TaskFilters, TTaskFormData } from '@/types';

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.priority) params.set('priority', filters.priority);
      if (filters?.q) params.set('q', filters.q);
      const query = params.toString();
      const data = await api.get(`/tasks${query ? `?${query}` : ''}`) as Task[];
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TTaskFormData) => {
    try {
      const newTask = await api.post('/tasks', taskData) as Task;
      setTasks([...tasks, newTask]);
      return newTask;
    } catch (error) {
      console.error('Failed to create task', error);
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: TTaskFormData) => {
    try {
      const updatedTask = (await api.put(`/tasks/${id}`, taskData)) as Task;
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
      throw error;
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};

