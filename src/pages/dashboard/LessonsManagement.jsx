import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useForm } from 'react-hook-form';
import { IoAdd, IoTrash, IoCreate } from 'react-icons/io5';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { extractYouTubeId } from '../../utils/helpers';

const LessonsManagement = () => {
  const { categories, courses, lessons, addLesson, updateLesson, deleteLesson } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const filteredCourses = courses.filter(c => c.categoryId === selectedCategory);

  const onSubmit = async (data) => {
    if (editingLesson) {
      await updateLesson(editingLesson.id, data);
    } else {
      await addLesson(data);
    }
    closeModal();
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setValue('title', lesson.title);
    setValue('description', lesson.description);
    setValue('topics', (lesson.topics || []).join('\n'));
    setValue('youtubeUrl', lesson.youtubeUrl);
    setValue('courseId', lesson.courseId);
    
    // Find course to set category
    const course = courses.find(c => c.id === lesson.courseId);
    if (course) {
      setSelectedCategory(course.categoryId);
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
    setSelectedCategory('');
    reset();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      await deleteLesson(id);
    }
  };

  const watchYoutubeUrl = watch('youtubeUrl');
  const videoId = extractYouTubeId(watchYoutubeUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lessons Management</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <IoAdd className="inline mr-2" /> Add Lesson
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => {
          const course = courses.find(c => c.id === lesson.courseId);
          return (
            <Card key={lesson.id} className="relative group">
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Course: {course?.title || 'Unknown'}
                </p>
                <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                {lesson.youtubeUrl && (
                  <div className="mb-2">
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      YouTube Video
                    </span>
                  </div>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(lesson)}
                  >
                    <IoCreate size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(lesson.id)}
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
        title={editingLesson ? 'Edit Lesson' : 'Add Lesson'}
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                {...register('courseId', { required: 'Course is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select a course</option>
                {filteredCourses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
              {errors.courseId && (
                <p className="mt-1 text-sm text-red-500">{errors.courseId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topics (one per line)
            </label>
            <textarea
              {...register('topics')}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
            />
          </div>

          <Input
            label="YouTube Video URL"
            {...register('youtubeUrl')}
            placeholder="https://www.youtube.com/watch?v=..."
          />

          {videoId && (
            <div className="mt-2">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingLesson ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default LessonsManagement;