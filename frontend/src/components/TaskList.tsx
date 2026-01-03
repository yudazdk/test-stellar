import { useRef, useState } from 'react';
import { Task, TTaskFormData } from '@/types';
import { statusOptions, priorityOptions } from '@/constants';
import Modal from '@/components/Modal';

interface ITaskListProps {
  tasks: Task[];
  loading: boolean;
  updateTask: (id: string, taskData: TTaskFormData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

export const TaskList = ({ tasks, loading, updateTask, deleteTask }: ITaskListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<TTaskFormData>>({});
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const taskIdToDeleteRef = useRef("");

  const handleEditClick = (task: Task) => {
    setEditingId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (taskId: string) => {
    try {
      await updateTask(taskId, editFormData as TTaskFormData);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  async function handleDelete() {
    setShowConfirmDelete(false);
    await deleteTask(taskIdToDeleteRef.current);
    taskIdToDeleteRef.current = "";
  }

  function cancelDelete() {
    setShowConfirmDelete(false);
    taskIdToDeleteRef.current = "";
  } 

  function onDelete(taskId: string) {
    taskIdToDeleteRef.current = taskId;
    setShowConfirmDelete(true);
  }

  if (loading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 transition-shadow border rounded-lg hover:shadow-md"
          >
            {editingId === task.id ? (
              // Edit mode
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border rounded dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Priority</label>
                    <select
                      value={editFormData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(task.id)}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-start justify-between dark:bg-slate-700">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="mt-1 text-gray-600 dark:text-white" dangerouslySetInnerHTML={{ __html: task.description || '' }}></p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded">
                      {task.status}
                    </span>
                    <span className="px-2 py-1 text-sm text-gray-800 bg-gray-100 rounded">
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal show={showConfirmDelete}>
        <>
          <h1 className='mt-3 font-bold '>Are you sure you want to delete this task ?</h1>
          <div className='flex gap-2 mt-4'>
            <button 
              onClick={handleDelete} 
              className='px-3 py-1 mb-3 text-white bg-red-500 rounded hover:bg-red-600'
            >
                Confirm
              </button>
            <button 
              onClick={cancelDelete} 
              className='px-3 py-1 mb-3 text-white bg-blue-500 rounded hover:bg-blue-600'
            >
              Cancel
            </button>
          </div>
        </>  
      </Modal>    
    </>
  );
};

