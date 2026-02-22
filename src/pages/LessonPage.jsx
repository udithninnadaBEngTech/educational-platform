import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

const LessonPage = () => {
  const { categoryId, courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { categories, courses, lessons } = useData();

  const course = courses.find(c => c.id === courseId);
  const lesson = lessons.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="pt-16 text-center py-20">
        <h2 className="text-2xl">Lesson not found</h2>
      </div>
    );
  }

  // normalize topics to an array
  const topics = Array.isArray(lesson.topics)
    ? lesson.topics
    : (typeof lesson.topics === 'string'
      ? lesson.topics.split('\n').map(t => t.trim()).filter(Boolean)
      : []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="pt-16 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              <p className="text-gray-600">Course: {course?.title || 'Unknown'}</p>
            </div>
            <div>
              <button className="text-sm text-primary" onClick={() => navigate(-1)}>Back</button>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700 mb-6">
            {lesson.description}
          </div>

          {topics.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Topics</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {topics.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}

          {lesson.youtubeUrl && (
            <div className="mt-6">
              <iframe
                width="100%"
                height="480"
                src={lesson.youtubeUrl.includes('embed') ? lesson.youtubeUrl : `https://www.youtube.com/embed/${lesson.youtubeUrl.split('v=')[1] || ''}`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default LessonPage;
