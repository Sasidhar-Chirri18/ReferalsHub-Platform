import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Briefcase, Send, FileText, Loader2, ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import toast from 'react-hot-toast';

const RequestReferral = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [fetchingJob, setFetchingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobAndProfile = async () => {
      try {
        const jobResponse = await API.get(`/api/jobs/${jobId}`);
        setJob(jobResponse.data);

        const profileResponse = await API.get('/api/users/profile');
        if (profileResponse.data.resumeUrl) {
          setResumeUrl(profileResponse.data.resumeUrl);
        }
      } catch (error) {
        console.error('Error fetching job details or profile', error);
        toast.error('Failed to load referral details');
        navigate('/jobs');
      } finally {
        setFetchingJob(false);
      }
    };
    fetchJobAndProfile();
  }, [jobId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      return toast.error('Please enter a message for the referrer');
    }
    if (!resumeUrl) {
      return toast.error('Please provide a resume URL');
    }

    setSubmitting(true);
    try {
      await API.post('/api/referrals', {
        jobId: parseInt(jobId),
        message,
        resumeUrl,
      });
      toast.success('Referral request submitted successfully!');
      navigate('/user-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetchingJob) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-6 min-h-[80vh]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Job</span>
      </button>

      <GlassCard className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary-400" />
            <span>Request Referral</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Applying for <span className="text-slate-200 font-semibold">{job.title}</span> at{' '}
            <span className="text-slate-200 font-semibold">{job.company}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Resume Link (Drive, Dropbox, PDF URL) *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="url"
                required
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Make sure the link sharing permissions are set to public.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Message to Referrer *</label>
            <textarea
              required
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none resize-none"
              placeholder="Hi, I noticed your post for this job. I have 3 years of experience in Java and React and would love a referral..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex justify-center items-center space-x-2"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Request</span>
              </>
            )}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default RequestReferral;
