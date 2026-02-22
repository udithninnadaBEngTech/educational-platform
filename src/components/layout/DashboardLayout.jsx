import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  IoHome, 
  IoFolder, 
  IoBook, 
  IoVideocam, 
  IoPeople,
  IoLogOut 
} from 'react-icons/io5';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', name: 'Overview', icon: IoHome },
    { path: '/dashboard/categories', name: 'Categories', icon: IoFolder },
    { path: '/dashboard/courses', name: 'Courses', icon: IoBook },
    { path: '/dashboard/lessons', name: 'Lessons', icon: IoVideocam },
    { path: '/dashboard/live-classes', name: 'Live Classes', icon: IoPeople },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen fixed">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </div>
          
          <nav className="mt-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors ${
                    isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : ''
                  }`
                }
              >
                <item.icon className="mr-3" size={20} />
                {item.name}
              </NavLink>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
            >
              <IoLogOut className="mr-3" size={20} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;