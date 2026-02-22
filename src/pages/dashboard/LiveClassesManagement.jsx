import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useForm } from 'react-hook-form';
import { IoAdd, IoTrash, IoCreate } from 'react-icons/io5';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LiveClassesManagement = () => {
  const { categories, liveClasses, addLiveClass, updateLiveClass, deleteLiveClass } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLiveClass, setEditingLiveClass] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (editingLiveClass) {
      await updateLiveClass(editingLiveClass.id, data);
    } else {
      await addLiveClass(data);
    }
    closeModal();
  };

  const openEditModal = (liveClass) => {
    setEditingLiveClass(liveClass);
    setValue('title', liveClass.title);
    setValue('instructor', liveClass.instructor);
    setValue('time', liveClass.time);
    setValue('meetingLink', liveClass.meetingLink);
    setValue('categoryId', liveClass.categoryId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLiveClass(null);
    reset();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this live class?')) {
      await deleteLiveClass(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Live Classes Management</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <IoAdd className="inline mr-2" /> Add Live Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveClasses.map((liveClass) => {
          const category = categories.find(c => c.id === liveClass.categoryId);
          return (
            <Card key={liveClass.id} className="relative group">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{liveClass.title}</h3>
                <p className="text-gray-600 mb-1">Instructor: {liveClass.instructor}</p>
                <p className="text-gray-600 mb-1">Time: {liveClass.time}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Category: {category?.title || 'Unknown'}
                </p>
                <div className="flex justify-between items-center">
                  <a
                    href={liveClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Meeting Link
                  </a>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(liveClass)}
                    >
                      <IoCreate size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(liveClass.id)}
                    >
                      <IoTrash size={18} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingLiveClass ? 'Edit Live Class' : 'Add Live Class'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          <Input
            label="Instructor"
            {...register('instructor', { required: 'Instructor is required' })}
            error={errors.instructor?.message}
          />
          <Input
            label="Time"
            {...register('time', { required: 'Time is required' })}
            placeholder="e.g., Monday 10:00 AM EST"
            error={errors.time?.message}
          />
          <Input
            label="Meeting Link"
            {...register('meetingLink', { required: 'Meeting link is required' })}
            placeholder="https://zoom.us/j/..."
            error={errors.meetingLink?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingLiveClass ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default LiveClassesManagement;