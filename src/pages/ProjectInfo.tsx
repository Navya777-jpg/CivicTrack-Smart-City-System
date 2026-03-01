import React from 'react';
import { motion } from 'motion/react';
import { 
  FolderTree, 
  Database as DatabaseIcon, 
  Network, 
  Layout as LayoutIcon, 
  FileText, 
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function ProjectInfo() {
  const sections = [
    {
      title: "1. Folder Structure",
      icon: FolderTree,
      content: (
        <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-xl overflow-x-auto">
{`├── src/
│   ├── components/      # Reusable UI (Layout, Sidebar)
│   ├── pages/           # Feature views (Dashboards, Auth)
│   ├── store/           # Global state (AuthContext)
│   ├── services/        # API abstraction layer
│   ├── hooks/           # Custom hooks (useTheme)
│   └── App.tsx          # Main router & provider setup
├── server.ts            # Express server & SQLite DB logic
├── civictrack.db        # Persistent SQLite database
└── tailwind.config.js   # Custom theme configuration`}
        </pre>
      )
    },
    {
      title: "2. Database Schema (SQLite)",
      icon: DatabaseIcon,
      content: (
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-bold text-brand-500">Users Table</p>
            <p className="text-slate-500 italic">id, email (unique), password (hashed), name, role (citizen/admin)</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-bold text-brand-500">Issues Table</p>
            <p className="text-slate-500 italic">id, userId, title, description, category, location, imagePath, status, priority, remarks, createdAt, updatedAt</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-bold text-brand-500">Notifications Table</p>
            <p className="text-slate-500 italic">id, userId, message, isRead, createdAt</p>
          </div>
        </div>
      )
    },
    {
      title: "3. API Endpoint List",
      icon: Network,
      content: (
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
            <span className="font-mono text-brand-600">POST /api/auth/login</span>
            <span className="text-slate-400">User authentication</span>
          </li>
          <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
            <span className="font-mono text-brand-600">GET /api/issues</span>
            <span className="text-slate-400">Fetch issues (role-based)</span>
          </li>
          <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
            <span className="font-mono text-brand-600">PATCH /api/issues/:id</span>
            <span className="text-slate-400">Update status (Admin only)</span>
          </li>
          <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
            <span className="font-mono text-brand-600">GET /api/stats</span>
            <span className="text-slate-400">Dashboard analytics</span>
          </li>
        </ul>
      )
    },
    {
      title: "4. Project Description",
      icon: FileText,
      content: (
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          CivicTrack is a next-generation municipal governance platform designed for the modern smart city. 
          It empowers citizens to report infrastructure and service issues directly to local authorities 
          while providing administrators with a data-driven dashboard to track resolution progress, 
          analyze trends, and improve city-wide efficiency. Built with a focus on transparency and 
          accountability, CivicTrack transforms civic engagement into a streamlined digital experience.
        </p>
      )
    },
    {
      title: "5. Scalability & Future Scope",
      icon: TrendingUp,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Zap size={16} className="text-amber-500 mt-1 shrink-0" />
            <p><span className="font-bold">AI Integration:</span> Automated image recognition for issue verification.</p>
          </div>
          <div className="flex items-start space-x-2">
            <Network size={16} className="text-blue-500 mt-1 shrink-0" />
            <p><span className="font-bold">WebSockets:</span> Real-time live updates for admin dispatching.</p>
          </div>
          <div className="flex items-start space-x-2">
            <ShieldCheck size={16} className="text-emerald-500 mt-1 shrink-0" />
            <p><span className="font-bold">Blockchain:</span> Immutable audit logs for high-priority resolutions.</p>
          </div>
          <div className="flex items-start space-x-2">
            <LayoutIcon size={16} className="text-purple-500 mt-1 shrink-0" />
            <p><span className="font-bold">Mobile App:</span> Native iOS/Android apps with GPS-tagged reporting.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">Project Documentation</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Technical specifications and architecture overview for the CivicTrack Hackathon project.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl flex flex-col h-full"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white">
                <section.icon size={20} />
              </div>
              <h3 className="text-xl font-bold">{section.title}</h3>
            </div>
            <div className="flex-1">
              {section.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
