import { useEffect, useState } from 'react';
import { useApi } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Map as MapIcon,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const api = useApi();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/analytics').then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const statCards = [
    { label: 'Total Issues', value: stats.total, icon: AlertCircle, color: 'bg-indigo-600' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-emerald-600' },
    { label: 'Avg. Resolution', value: `${stats.avgTimeHours}h`, icon: Clock, color: 'bg-violet-600' },
    { label: 'Pending', value: stats.pending, icon: TrendingUp, color: 'bg-rose-600' },
  ];

  const exportCSV = () => {
    const headers = ['ID', 'User', 'Title', 'Category', 'Status', 'Priority', 'Created At'];
    const rows = stats.recentIssues.map((i: any) => [
      i.id, i.userName, i.title, i.category, i.status, i.priority, i.createdAt
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "civic_issues_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">City Overview</h2>
          <p className="text-slate-500">Real-time municipal performance metrics</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl card-hover"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
              <span className="text-3xl font-bold">{card.value}</span>
            </div>
            <p className="mt-4 text-slate-500 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-semibold mb-6">Issues by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-semibold mb-6">Location Heatmap (Simulated)</h3>
          <div className="space-y-4">
            {stats.locationStats?.map((loc: any, i: number) => (
              <div key={loc.location} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{loc.location}</span>
                  <span className="text-brand-500">{loc.count} reports</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(loc.count / stats.total) * 100}%` }}
                    className="h-full bg-brand-500"
                  />
                </div>
              </div>
            ))}
            {(!stats.locationStats || stats.locationStats.length === 0) && (
              <p className="text-center text-slate-500 py-12">No location data available yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-8 rounded-3xl">
        <h3 className="text-lg font-semibold mb-6">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-4 font-medium">Issue</th>
                <th className="pb-4 font-medium">Citizen</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentIssues.map((issue: any) => (
                <tr key={issue.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{issue.title}</p>
                    <p className="text-xs text-slate-500">{issue.location}</p>
                  </td>
                  <td className="py-4 text-sm">{issue.userName}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium">
                      {issue.category}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      issue.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${
                      issue.priority === 'high' ? 'bg-red-500' :
                      issue.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm capitalize">{issue.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
