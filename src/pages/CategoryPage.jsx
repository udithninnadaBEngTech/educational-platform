import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoSearch } from 'react-icons/io5';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categories, courses, liveClasses } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const category = categories.find(c => c.id === categoryId);
  const categoryCourses = courses.filter(c => c.categoryId === categoryId);
  const categoryLiveClasses = liveClasses.filter(l => l.categoryId === categoryId);

  const filteredCourses = categoryCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!category) {
    return (
      <div className="pt-16 text-center py-20">
        <h2 className="text-2xl">Category not found</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section with Category Image */}
      <section 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${category.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {category.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-200"
            >
              {category.longDescription}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search courses in this category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
            <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </section>

      {/* Ongoing Live Classes */}
      {categoryLiveClasses.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Ongoing Online Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryLiveClasses.map((liveClass) => (
                <Card key={liveClass.id} className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{liveClass.title}</h3>
                  <p className="text-gray-600 mb-2">Instructor: {liveClass.instructor}</p>
                  <p className="text-gray-600 mb-4">Time: {liveClass.time}</p>
                  <Button
                    variant="primary"
                    onClick={() => window.open(liveClass.meetingLink, '_blank')}
                  >
                    Join Class
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Courses List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Courses in {category.title}</h2>
          
          {filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No courses found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  hoverable
                  onClick={() => navigate(`/category/${categoryId}/course/${course.id}`)}
                  className="cursor-pointer"
                >
                  {course.thumbnail && (
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${course.thumbnail})` }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-2">{course.instructor}</p>
                    <p className="text-gray-500 text-sm">{course.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default CategoryPage;