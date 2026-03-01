import { useEffect, useState } from 'react';
import { useApi } from '../services/api';
import { useAuth } from '../store/AuthContext';
import { motion } from 'motion/react';
import { 
  Filter, 
  Search, 
  MoreVertical, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';

export default function IssueList() {
  const api = useApi();
  const { user } = useAuth();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [viewingIssue, setViewingIssue] = useState<any>(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'admin' ? '/api/admin/issues' : '/api/issues';
      const data = await api.get(endpoint);
      setIssues(data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const endpoint = `/api/admin/issues/${id}/status`;
      await api.patch(endpoint, { status, remarks });
      fetchIssues();
      setSelectedIssue(null);
      setRemarks('');
    } catch (err) {
      alert('Failed to update');
    }
  };

  const filteredIssues = issues.filter(i => {
    const matchesFilter = filter === 'all' || i.status === filter;
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) || 
                          i.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div>Loading issues...</div>;

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search issues or categories..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter size={18} className="text-slate-400 mr-2" />
          {['all', 'pending', 'in-progress', 'resolved'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all whitespace-nowrap ${
                filter === s 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 group"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                issue.status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {issue.status === 'resolved' ? <CheckCircle2 size={24} /> :
                 issue.status === 'in-progress' ? <Clock size={24} /> :
                 <AlertTriangle size={24} />}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">{issue.category}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs text-slate-500">{format(new Date(issue.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{issue.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{issue.description}</p>
                {user?.role === 'admin' && (
                  <p className="text-xs text-slate-400 mt-2 flex items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-300 mr-1">Reported by:</span> {issue.userName}
                  </p>
                )}
              </div>
            </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setViewingIssue(issue)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all text-slate-600"
                >
                  <MessageSquare size={20} />
                </button>
                
                {user?.role === 'admin' && issue.status !== 'resolved' && (
                  <button 
                    onClick={() => setSelectedIssue(issue)}
                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white rounded-xl transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
          </motion.div>
        ))}
      </div>

      {/* Admin Update Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-lg p-8 rounded-3xl"
          >
            <h3 className="text-xl font-bold mb-2">Update Issue #{selectedIssue.id}</h3>
            <p className="text-slate-500 mb-6">{selectedIssue.title}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pending', 'in-progress', 'resolved'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedIssue.id, s)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white rounded-xl text-sm capitalize transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Admin Remarks</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none resize-none"
                  rows={3}
                  placeholder="Enter resolution details or remarks..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => updateStatus(selectedIssue.id, selectedIssue.status)}
                  className="flex-1 py-3 bg-brand-500 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/30"
                >
                  Save Remarks
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Details / Timeline Modal */}
      {viewingIssue && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-2xl p-8 rounded-3xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">{viewingIssue.category}</span>
                <h3 className="text-2xl font-bold mt-1">{viewingIssue.title}</h3>
              </div>
              <button 
                onClick={() => setViewingIssue(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <Search size={20} className="rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{viewingIssue.description}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 flex items-center">
                    <MapPin size={14} className="mr-1" /> {viewingIssue.location}
                  </p>
                </div>
                {viewingIssue.remarks && (
                  <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-900/50">
                    <label className="text-xs font-bold text-brand-500 uppercase tracking-wider">Admin Remarks</label>
                    <p className="text-brand-700 dark:text-brand-300 mt-1">{viewingIssue.remarks}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolution Timeline</label>
                <div className="relative pl-6 space-y-8">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />
                  
                  {/* Step 1: Reported */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-slate-900 shadow-sm" />
                    <p className="font-bold text-sm">Issue Reported</p>
                    <p className="text-xs text-slate-400">{format(new Date(viewingIssue.createdAt), 'MMM dd, yyyy • hh:mm a')}</p>
                  </div>

                  {/* Step 2: In Progress */}
                  <div className="relative">
                    <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm ${
                      viewingIssue.status !== 'pending' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`} />
                    <p className={`font-bold text-sm ${viewingIssue.status === 'pending' ? 'text-slate-400' : ''}`}>In Progress</p>
                    <p className="text-xs text-slate-400">
                      {viewingIssue.status !== 'pending' ? 'Assigned to municipal team' : 'Awaiting assignment'}
                    </p>
                  </div>

                  {/* Step 3: Resolved */}
                  <div className="relative">
                    <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm ${
                      viewingIssue.status === 'resolved' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`} />
                    <p className={`font-bold text-sm ${viewingIssue.status !== 'resolved' ? 'text-slate-400' : ''}`}>Resolved</p>
                    <p className="text-xs text-slate-400">
                      {viewingIssue.status === 'resolved' 
                        ? `Completed on ${format(new Date(viewingIssue.updatedAt), 'MMM dd, yyyy')}` 
                        : 'Pending final resolution'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {viewingIssue.imagePath && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <img 
                  src={viewingIssue.imagePath} 
                  alt="Issue evidence" 
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
