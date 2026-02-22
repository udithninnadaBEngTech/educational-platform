import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useForm } from 'react-hook-form';
import { IoAdd, IoTrash, IoCreate } from 'react-icons/io5';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const CoursesManagement = () => {
  const { categories, courses, addCourse, updateCourse, deleteCourse } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, data);
    } else {
      await addCourse(data);
    }
    closeModal();
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setValue('title', course.title);
    setValue('description', course.description);
    setValue('instructor', course.instructor);
    setValue('categoryId', course.categoryId);
    setValue('thumbnail', course.thumbnail);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    reset();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Courses Management</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <IoAdd className="inline mr-2" /> Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const category = categories.find(c => c.id === course.categoryId);
          return (
            <Card key={course.id} className="relative group">
              {course.thumbnail && (
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-1">Instructor: {course.instructor}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Category: {category?.title || 'Unknown'}
                </p>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(course)}
                  >
                    <IoCreate size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                  >
                    <IoTrash size={18} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCourse ? 'Edit Course' : 'Add Course'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          <Input
            label="Description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />
          <Input
            label="Instructor"
            {...register('instructor', { required: 'Instructor is required' })}
            error={errors.instructor?.message}
          />
          <Input
            label="Thumbnail URL"
            {...register('thumbnail')}
            placeholder="https://example.com/image.jpg"
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
              {editingCourse ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default CoursesManagement;