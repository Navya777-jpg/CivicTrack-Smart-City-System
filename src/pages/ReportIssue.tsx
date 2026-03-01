import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../services/api';
import { motion } from 'motion/react';
import { Send, MapPin, Image as ImageIcon, Info } from 'lucide-react';

const CATEGORIES = [
  'Waste Management',
  'Road Damage',
  'Streetlight',
  'Water Leakage',
  'Public Transport',
  'Drainage Issue',
  'Other'
];

export default function ReportIssue() {
  const api = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    location: '',
    imagePath: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/issues', formData);
      navigate('/citizen/issues');
    } catch (err) {
      alert('Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Report an Issue</h2>
        <p className="text-slate-500">Help us make the city better by reporting problems in your area.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Issue Title</label>
              <input
                type="text"
                required
                placeholder="Briefly describe the problem"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Street, Area, or Landmark"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Provide more details about the issue..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Image URL (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                  value={formData.imagePath}
                  onChange={e => setFormData({ ...formData, imagePath: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-start space-x-3 text-brand-700 dark:text-brand-300 text-sm">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p>Our smart system will automatically prioritize your request based on the category and description provided.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold shadow-xl shadow-brand-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : (
              <>
                <Send size={20} />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
