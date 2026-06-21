import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import GlassCard from '../../components/GlassCard';
import { StatsSkeleton } from '../../components/LoadingSkeleton';
import { FileText, Hourglass, CheckCircle2, UserCheck, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await API.get('/api/dashboard/stats');
        setStats(statsRes.data);

        const requestsRes = await API.get('/api/referrals/my-requests');
        setRequests(requestsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'ACCEPTED':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'REFERRED':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 min-h-[80vh]">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Candidate Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor your active referral applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl border border-primary-500/20">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Requests</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.totalRequests || 0}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Hourglass className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.pendingRequests || 0}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Accepted</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.acceptedRequests || 0}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Referred</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.referredRequests || 0}</p>
          </div>
        </GlassCard>
      </div>

      {/* Submitted Requests List */}
      <GlassCard className="space-y-6">
        <h2 className="text-xl font-bold text-white">Your Referral Requests</h2>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">You haven't submitted any referral requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Job Info</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Submitted On</th>
                  <th className="pb-3 pr-4">Resume</th>
                  <th className="pb-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
                {requests.map((req) => (
                  <tr key={req.id} className="group hover:bg-slate-900/10">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-white">{req.jobTitle}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{req.jobCompany}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <a
                        href={req.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary-400 hover:text-primary-300 text-xs font-semibold"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="py-4 max-w-xs truncate text-xs text-slate-400" title={req.message}>
                      {req.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default UserDashboard;
