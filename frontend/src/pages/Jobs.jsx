import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Briefcase, Plus, X, Loader2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { JobCardSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submittingJob, setSubmittingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    experienceRequired: '',
    description: '',
    applyLink: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async (searchVal = '', locVal = '') => {
    setLoading(true);
    try {
      const response = await API.get('/api/jobs/search', {
        params: { search: searchVal, location: locVal },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(search, location);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmittingJob(true);
    try {
      await API.post('/api/jobs', newJob);
      toast.success('Job posted successfully!');
      setModalOpen(false);
      setNewJob({
        title: '',
        company: '',
        location: '',
        experienceRequired: '',
        description: '',
        applyLink: '',
      });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmittingJob(false);
    }
  };

  const isEligibleToPost = user && (user.role === 'REFERRER' || user.role === 'ADMIN');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 min-h-[80vh]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Find Opportunities</h1>
          <p className="text-slate-400 text-sm mt-1">Explore tech roles posted by referrers</p>
        </div>
        {isEligibleToPost && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20"
          >
            <Plus className="h-5 w-5" />
            <span>Post a Job</span>
          </button>
        )}
      </div>

      {/* Search and filter bar */}
      <form onSubmit={handleSearchSubmit} className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
            placeholder="Search titles, skills, or companies..."
          />
        </div>
        <div className="relative flex-1 w-full">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
            placeholder="Location e.g. London, Remote..."
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
        >
          Search
        </button>
      </form>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl">
          <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No Jobs Found</h3>
          <p className="text-slate-400 text-sm mt-1">Try resetting filters or expanding your terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <GlassCard
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {job.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 font-semibold">{job.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-full">
                    {job.experienceRequired} exp
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-slate-400 text-xs">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-800/40 text-xs">
                <span className="text-slate-500">Posted by {job.createdByName}</span>
                <span className="text-primary-400 font-semibold flex items-center space-x-1">
                  <span>View Details</span>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 relative border border-slate-800">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="h-6 w-6" />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-white">Post an Opportunity</h2>
              <p className="text-slate-400 text-sm mt-1">Provide job details to start receiving candidates</p>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    placeholder="e.g. Google"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Location *</label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    placeholder="e.g. Remote / New York"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Experience Required *</label>
                  <input
                    type="text"
                    required
                    value={newJob.experienceRequired}
                    onChange={(e) => setNewJob({ ...newJob, experienceRequired: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    placeholder="e.g. 2-5 years"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400">Apply / Careers URL *</label>
                  <input
                    type="url"
                    required
                    value={newJob.applyLink}
                    onChange={(e) => setNewJob({ ...newJob, applyLink: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    placeholder="https://careers.google.com/..."
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400">Job Description *</label>
                  <textarea
                    required
                    rows="5"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none resize-none"
                    placeholder="Enter complete role responsibilities..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm flex items-center space-x-1"
                >
                  {submittingJob && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Submit Opportunity</span>
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Jobs;
