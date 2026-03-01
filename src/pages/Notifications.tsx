import { useEffect, useState } from 'react';
import { useApi } from '../services/api';
import { motion } from 'motion/react';
import { Bell, CheckCircle, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function Notifications() {
  const api = useApi();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/issues/notifications').then(setNotifications).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-slate-500">Stay updated on your reported issues</p>
        </div>
        <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-brand-500">
          <Bell size={24} />
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center">
          <p className="text-slate-500">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 rounded-3xl flex items-start space-x-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                n.message.includes('resolved') ? 'bg-emerald-100 text-emerald-600' :
                n.message.includes('in-progress') ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {n.message.includes('resolved') ? <CheckCircle size={20} /> :
                 n.message.includes('in-progress') ? <Clock size={20} /> :
                 <Info size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-slate-800 dark:text-slate-200 font-medium">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {format(new Date(n.createdAt), 'MMM dd, yyyy • hh:mm a')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
