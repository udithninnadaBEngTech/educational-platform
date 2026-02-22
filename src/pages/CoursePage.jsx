import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { extractYouTubeId } from '../utils/helpers';
import { IoPlay } from 'react-icons/io5';

const CoursePage = () => {
  const { categoryId, courseId } = useParams();
  const navigate = useNavigate();
  const { categories, courses, lessons } = useData();

  const category = categories.find(c => c.id === categoryId);
  const course = courses.find(c => c.id === courseId);
  const courseLessons = lessons.filter(l => l.courseId === courseId);

  if (!course) {
    return (
      <div className="pt-16 text-center py-20">
        <h2 className="text-2xl">Course not found</h2>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-gray-600">{course.instructor}</p>
            </div>
            <div>
              <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            </div>
          </div>

          {course.thumbnail && (
            <div className="mb-6 h-56 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${course.thumbnail})` }} />
          )}

          <div className="prose max-w-none text-gray-700 mb-8">
            {course.description}
          </div>

          <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
            {courseLessons.length === 0 ? (
            <p className="text-gray-500">No lessons available for this course.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseLessons.map(lesson => {
                const videoId = extractYouTubeId(lesson.youtubeUrl);
                const thumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
                return (
                  <Card key={lesson.id} hoverable className="cursor-pointer" onClick={() => navigate(`/category/${categoryId}/course/${courseId}/lesson/${lesson.id}`)}>
                    <div className="flex items-stretch">
                      {thumb && (
                        <div className="relative w-40 h-28 flex-shrink-0">
                          <div className="absolute inset-0 bg-cover bg-center rounded-l-lg" style={{ backgroundImage: `url(${thumb})` }} />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-l-lg">
                            <IoPlay className="text-white text-2xl opacity-90" />
                          </div>
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <h3 className="text-lg font-medium mb-1">{lesson.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{lesson.description}</p>
                        {lesson.youtubeUrl && <span className="inline-block text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Video</span>}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default CoursePage;
