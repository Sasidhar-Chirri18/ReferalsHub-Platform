import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, User, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ProfileSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await API.get(`/api/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Failed to fetch job details', error);
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    setDeleting(true);
    try {
      await API.delete(`/api/jobs/${id}`);
      toast.success('Job deleted successfully');
      navigate('/jobs');
    } catch (error) {
      toast.error('Failed to delete job posting');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!job) return null;

  const isOwner = user && (user.role === 'ADMIN' || job.createdById === user.id);
  const isCandidate = user && user.role === 'USER';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 min-h-[80vh]">
      <GlassCard className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
              <span className="font-semibold text-slate-200">{job.company}</span>
              <span className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-full">
            {job.experienceRequired} Experience
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
          >
            <span>Visit Career Site</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          {isCandidate && (
            <Link
              to={`/request-referral/${job.id}`}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20"
            >
              Request Referral
            </Link>
          )}

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center space-x-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-colors duration-200 ml-auto"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>Delete Post</span>
            </button>
          )}
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Job Description</h2>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center space-x-2 text-xs text-slate-500">
          <User className="h-4 w-4" />
          <span>Listed by Referrer: {job.createdByName}</span>
        </div>
      </GlassCard>
    </div>
  );
};

export default JobDetails;
