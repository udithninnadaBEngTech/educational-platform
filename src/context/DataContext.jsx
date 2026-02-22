import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy 
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    });
    return unsubscribe;
  }, []);

  // Fetch courses
  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
    });
    return unsubscribe;
  }, []);

  // Fetch lessons
  useEffect(() => {
    const q = query(collection(db, 'lessons'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const normalized = lessonsData.map(item => ({
        ...item,
        topics: Array.isArray(item.topics)
          ? item.topics
          : (typeof item.topics === 'string'
            ? item.topics.split('\n').map(t => t.trim()).filter(Boolean)
            : []),
      }));
      setLessons(normalized);
    });
    return unsubscribe;
  }, []);

  // Fetch live classes
  useEffect(() => {
    const q = query(collection(db, 'liveClasses'), orderBy('time'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveClassesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLiveClasses(liveClassesData);
    });
    setLoading(false);
    return unsubscribe;
  }, []);

  // Category CRUD
  const addCategory = async (categoryData) => {
    try {
      const imageUrl = categoryData.imageUrl || '';
      await addDoc(collection(db, 'categories'), {
        ...categoryData,
        imageUrl,
        createdAt: new Date().toISOString()
      });
      toast.success('Category added');
    } catch (error) {
      console.error('addCategory error:', error);
      toast.error('Failed to add category: ' + (error.message || ''));
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const imageUrl = categoryData.imageUrl || '';
      await updateDoc(doc(db, 'categories', id), {
        ...categoryData,
        imageUrl
      });
      toast.success('Category updated');
    } catch (error) {
      console.error('updateCategory error:', error);
      toast.error('Failed to update category: ' + (error.message || ''));
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Category deleted');
    } catch (error) {
      console.error('deleteCategory error:', error);
      toast.error('Failed to delete category: ' + (error.message || ''));
    }
  };

  // Course CRUD
  const addCourse = async (courseData) => {
    try {
      await addDoc(collection(db, 'courses'), {
        ...courseData,
        createdAt: new Date().toISOString()
      });
      toast.success('Course added');
    } catch (error) {
      toast.error('Failed to add course');
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      await updateDoc(doc(db, 'courses', id), courseData);
      toast.success('Course updated');
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
      toast.success('Course deleted');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  // Lesson CRUD
  const addLesson = async (lessonData) => {
    try {
      const topics = Array.isArray(lessonData.topics)
        ? lessonData.topics
        : (lessonData.topics ? lessonData.topics.split('\n').map(t => t.trim()).filter(Boolean) : []);
      const youtubeUrl = lessonData.youtubeUrl || '';
      await addDoc(collection(db, 'lessons'), {
        ...lessonData,
        topics,
        youtubeUrl,
        createdAt: new Date().toISOString()
      });
      toast.success('Lesson added');
    } catch (error) {
      toast.error('Failed to add lesson');
    }
  };

  const updateLesson = async (id, lessonData) => {
    try {
      const topics = Array.isArray(lessonData.topics)
        ? lessonData.topics
        : (lessonData.topics ? lessonData.topics.split('\n').map(t => t.trim()).filter(Boolean) : []);
      const youtubeUrl = lessonData.youtubeUrl || '';
      await updateDoc(doc(db, 'lessons', id), {
        ...lessonData,
        topics,
        youtubeUrl
      });
      toast.success('Lesson updated');
    } catch (error) {
      toast.error('Failed to update lesson');
    }
  };

  const deleteLesson = async (id) => {
    try {
      await deleteDoc(doc(db, 'lessons', id));
      toast.success('Lesson deleted');
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  // Live Class CRUD
  const addLiveClass = async (liveClassData) => {
    try {
      await addDoc(collection(db, 'liveClasses'), {
        ...liveClassData,
        createdAt: new Date().toISOString()
      });
      toast.success('Live class added');
    } catch (error) {
      toast.error('Failed to add live class');
    }
  };

  const updateLiveClass = async (id, liveClassData) => {
    try {
      await updateDoc(doc(db, 'liveClasses', id), liveClassData);
      toast.success('Live class updated');
    } catch (error) {
      toast.error('Failed to update live class');
    }
  };

  const deleteLiveClass = async (id) => {
    try {
      await deleteDoc(doc(db, 'liveClasses', id));
      toast.success('Live class deleted');
    } catch (error) {
      toast.error('Failed to delete live class');
    }
  };

  const value = {
    categories,
    courses,
    lessons,
    liveClasses,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addCourse,
    updateCourse,
    deleteCourse,
    addLesson,
    updateLesson,
    deleteLesson,
    addLiveClass,
    updateLiveClass,
    deleteLiveClass,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};