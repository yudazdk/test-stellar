import { useState } from 'react';
import { TTaskFormData, TaskPriority, TaskStatus } from '@/types';

import './taskForm.css';

interface ITaskFormProps {
  onSubmit: (data: TTaskFormData) => void;
  initialData?: TTaskFormData;
}

export const TaskForm = ({ onSubmit, initialData }: ITaskFormProps) => {
  const [formData, setFormData] = useState<TTaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
  });

  const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
  const priorityOptions: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6 mb-8 transition-colors duration-300 bg-white rounded-lg shadow-md dark:bg-slate-800 form-wrapper">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:text-white dark:bg-slate-700"
            rows={4}
          />
        </div>
        <div>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

