import { useEffect, useState } from 'react';
import { useApi } from '../services/api';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function CitizenDashboard() {
  const api = useApi();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/issues').then(setIssues).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: issues.length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    pending: issues.filter(i => i.status === 'pending').length,
  };

  if (loading) return <div>Loading your dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-slate-500">Track and manage your reported civic issues</p>
        </div>
        <Link 
          to="/citizen/report"
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30"
        >
          <PlusCircle size={20} />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Reported', value: stats.total, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Pending Action', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl flex items-center space-x-4"
          >
            <div className={`w-12 h-12 ${stat.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Issues List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Recent Reports</h3>
          <Link to="/citizen/issues" className="text-brand-500 text-sm font-medium hover:underline flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {issues.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <AlertCircle size={32} />
            </div>
            <p className="text-slate-500">You haven't reported any issues yet.</p>
            <Link to="/citizen/report" className="text-brand-500 font-medium mt-2 inline-block">Report your first issue</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issues.slice(0, 4).map((issue, i) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl card-hover relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-wider ${
                  issue.status === 'resolved' ? 'bg-emerald-500 text-white' :
                  issue.status === 'in-progress' ? 'bg-amber-500 text-white' :
                  'bg-rose-500 text-white'
                }`}>
                  {issue.status}
                </div>

                <div className="flex flex-col h-full">
                  <span className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-2">{issue.category}</span>
                  <h4 className="text-lg font-bold mb-2 line-clamp-1">{issue.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{issue.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {issue.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {format(new Date(issue.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
