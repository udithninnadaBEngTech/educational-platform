import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { IoFolder, IoBook, IoVideocam, IoPeople } from 'react-icons/io5';

const DashboardHome = () => {
  const { categories, courses, lessons, liveClasses } = useData();

  const stats = [
    { title: 'Categories', value: categories.length, icon: IoFolder, color: 'bg-blue-500' },
    { title: 'Courses', value: courses.length, icon: IoBook, color: 'bg-green-500' },
    { title: 'Lessons', value: lessons.length, icon: IoVideocam, color: 'bg-purple-500' },
    { title: 'Live Classes', value: liveClasses.length, icon: IoPeople, color: 'bg-orange-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-gray-600">{stat.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Categories</h2>
          <div className="space-y-3">
            {categories.slice(0, 5).map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>{cat.title}</span>
                <span className="text-sm text-gray-500">
                  {new Date(cat.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Courses</h2>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>{course.title}</span>
                <span className="text-sm text-gray-500">
                  {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;