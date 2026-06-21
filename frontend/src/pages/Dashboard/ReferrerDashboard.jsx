import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import GlassCard from '../../components/GlassCard';
import { StatsSkeleton } from '../../components/LoadingSkeleton';
import { Briefcase, MessageSquare, CheckSquare, ExternalLink, RefreshCw, Check, X, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ReferrerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await API.get('/api/dashboard/stats');
      setStats(statsRes.data);

      const requestsRes = await API.get('/api/referrals/received-requests');
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Failed to load referrer dashboard data', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await API.put(`/api/referrals/${id}/status`, null, {
        params: { status: newStatus },
      });
      toast.success(`Referral status updated to ${newStatus}`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Referrer Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage referrals requested by candidates</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors duration-200"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl border border-primary-500/20">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Jobs Posted</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.jobsPosted || 0}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Requests Received</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.requestsReceived || 0}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Referred Candidates</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.acceptedReferrals || 0}</p>
          </div>
        </GlassCard>
      </div>

      {/* Requests Table */}
      <GlassCard className="space-y-6">
        <h2 className="text-xl font-bold text-white font-sans">Received Referral Requests</h2>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No referral requests received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Candidate</th>
                  <th className="pb-3 pr-4">Job Role</th>
                  <th className="pb-3 pr-4">Message</th>
                  <th className="pb-3 pr-4">Resume</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/10">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-white">{req.requesterName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{req.requesterEmail}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-slate-200">{req.jobTitle}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{req.jobCompany}</div>
                    </td>
                    <td className="py-4 pr-4 max-w-xs truncate text-xs text-slate-400" title={req.message}>
                      {req.message}
                    </td>
                    <td className="py-4 pr-4">
                      <a
                        href={req.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary-400 hover:text-primary-300 text-xs font-semibold"
                      >
                        <span>Open Resume</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {updatingId === req.id ? (
                        <span className="text-slate-500 text-xs">Processing...</span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {req.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                                className="p-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 transition-colors"
                                title="Accept Request"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                                className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 transition-colors"
                                title="Reject Request"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {req.status === 'ACCEPTED' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(req.id, 'REFERRED')}
                                className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 text-xs font-semibold transition-colors"
                                title="Mark as Referred"
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                                <span>Mark Referred</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                                className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 transition-colors"
                                title="Reject Request"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {(req.status === 'REFERRED' || req.status === 'REJECTED') && (
                            <span className="text-slate-500 text-xs italic">Closed</span>
                          )}
                        </div>
                      )}
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

export default ReferrerDashboard;
