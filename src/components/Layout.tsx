import React, { ReactNode, useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  User as UserIcon,
  PlusCircle,
  Menu,
  X,
  Moon,
  Sun,
  Info,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: FileText, label: 'All Issues', path: '/admin/issues' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Info, label: 'Project Info', path: '/about' },
  ];

  const citizenMenuItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', path: '/citizen' },
    { icon: PlusCircle, label: 'Report Issue', path: '/citizen/report' },
    { icon: FileText, label: 'My Issues', path: '/citizen/issues' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Info, label: 'Project Info', path: '/about' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : citizenMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ items, isAdmin }: { items: any[], isAdmin: boolean }) => (
    <>
      <div className="p-6 flex items-center justify-between">
        {isSidebarOpen && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "font-bold text-xl",
              isAdmin ? "text-indigo-600 dark:text-indigo-400" : "text-brand-600 dark:text-brand-400"
            )}
          >
            CivicTrack {isAdmin && <span className="text-[10px] align-top ml-1 opacity-50">ADMIN</span>}
          </motion.span>
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center p-3 rounded-xl transition-all group",
              location.pathname === item.path 
                ? (isAdmin ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-brand-500 text-white shadow-lg shadow-brand-500/30")
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            )}
          >
            <item.icon size={22} className={cn(isSidebarOpen ? "mr-3" : "mx-auto")} />
            {isSidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen flex transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className={cn(
          "fixed left-0 top-0 h-full glass z-50 flex flex-col border-r shadow-sm",
          user?.role === 'admin' ? "border-indigo-500/20 shadow-indigo-500/5" : "border-white/20"
        )}
      >
        {user?.role === 'admin' ? (
          <SidebarContent items={adminMenuItems} isAdmin={true} />
        ) : (
          <SidebarContent items={citizenMenuItems} isAdmin={false} />
        )}

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {theme === 'light' ? <Moon size={22} className={isSidebarOpen ? "mr-3" : "mx-auto"} /> : <Sun size={22} className={isSidebarOpen ? "mr-3" : "mx-auto"} />}
            {isSidebarOpen && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
          >
            <LogOut size={22} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          isSidebarOpen ? "ml-[260px]" : "ml-[80px]"
        )}
      >
        <header className="h-20 glass sticky top-0 z-40 px-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {menuItems.find(m => m.path === location.pathname)?.label || 'CivicTrack'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]}
            </div>
          </div>
        </header>

        <div className="p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
