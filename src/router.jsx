import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import Login from './pages/dashboard/Login';
import DashboardHome from './pages/dashboard/DashboardHome';
import CategoriesManagement from './pages/dashboard/CategoriesManagement';
import CoursesManagement from './pages/dashboard/CoursesManagement';
import LessonsManagement from './pages/dashboard/LessonsManagement';
import LiveClassesManagement from './pages/dashboard/LiveClassesManagement';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuth } from './context/AuthContext';

/* ================= ADMIN EMAIL ALLOWLIST ================= */
const ADMIN_ALLOWLIST = (import.meta.env.VITE_ADMIN_ALLOWLIST || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowlist exists → only allowed emails
  if (ADMIN_ALLOWLIST.length > 0 && !isAdmin(ADMIN_ALLOWLIST)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ================= ROUTER ================= */
export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'courses', element: <Courses /> },
      { path: 'category/:categoryId', element: <CategoryPage /> },
      { path: 'category/:categoryId/course/:courseId', element: <CoursePage /> },
      { path: 'category/:categoryId/course/:courseId/lesson/:lessonId', element: <LessonPage /> },
      { path: 'contact', element: <Contact /> },
    ],
  },

  /* LOGIN */
  {
    path: '/login',
    element: <Login />,
  },

  /* DASHBOARD */
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'categories', element: <CategoriesManagement /> },
      { path: 'courses', element: <CoursesManagement /> },
      { path: 'lessons', element: <LessonsManagement /> },
      { path: 'live-classes', element: <LiveClassesManagement /> },
    ],
  },
]);