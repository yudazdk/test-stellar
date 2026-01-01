import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Task, TEditFormData } from '@/types';

export const useTasks = (filters?: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(filters || {}).toString();
    const data = await api.get(`/tasks?${queryParams}`) as Task[];
    setTasks(data);
    setLoading(false);
  };

  const createTask = async (taskData: Task) => {
    const newTask = await api.post('/tasks', taskData) as Task;
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = async (id: string, taskData: TEditFormData) => {
    const updatedTask = await api.put(`/tasks/${id}`, taskData) as Task;
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    return updatedTask;
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
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

