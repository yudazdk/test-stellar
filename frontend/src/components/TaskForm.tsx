import { useState } from 'react';
import { TTaskFormData } from '@/types';
import { statusOptions, priorityOptions } from '@/constants';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          rows={4}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
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
        className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        {initialData ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

