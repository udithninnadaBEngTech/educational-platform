import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch } from 'react-icons/io5';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import SearchResults from './SearchResults';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ categories: [], courses: [], lessons: [] });
  const [showResults, setShowResults] = useState(false);
  const { categories, courses, lessons } = useData();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults({ categories: [], courses: [], lessons: [] });
      return;
    }

    const searchTerm = query.toLowerCase();
    
    const filteredCategories = categories.filter(cat =>
      cat.title.toLowerCase().includes(searchTerm) ||
      cat.shortDescription?.toLowerCase().includes(searchTerm)
    );

    const filteredCourses = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description?.toLowerCase().includes(searchTerm)
    );

    const filteredLessons = lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm) ||
      lesson.description?.toLowerCase().includes(searchTerm)
    );

    setResults({
      categories: filteredCategories,
      courses: filteredCourses,
      lessons: filteredLessons
    });
    setShowResults(true);
  }, [query, categories, courses, lessons]);

  const handleResultClick = (type, item) => {
    setShowResults(false);
    setQuery('');
    
    if (type === 'category') {
      navigate(`/category/${item.id}`);
    } else if (type === 'course') {
      navigate(`/category/${item.categoryId}/course/${item.id}`);
    } else if (type === 'lesson') {
      navigate(`/category/${item.categoryId}/course/${item.courseId}/lesson/${item.id}`);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories, courses, lessons..."
          className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <AnimatePresence>
        {showResults && (query.trim() !== '') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
          >
            <SearchResults results={results} onItemClick={handleResultClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;