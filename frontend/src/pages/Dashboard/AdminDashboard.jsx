import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import GlassCard from '../../components/GlassCard';
import { StatsSkeleton } from '../../components/LoadingSkeleton';
import { Users, Briefcase, FileText, Calendar, ExternalLink, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const statsRes = await API.get('/api/dashboard/stats');
      setStats(statsRes.data);

      const referralsRes = await API.get('/api/referrals/all');
      setReferrals(referralsRes.data);
    } catch (error) {
      console.error('Failed to load admin dashboard data', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">System Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Platform overview and activity monitoring</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl border border-primary-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Users</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.usersCount || 0}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Jobs</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.jobsCount || 0}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Referral Requests</p>
            <p className="text-2xl font-bold text-white mt-1">{stats?.referralCount || 0}</p>
          </div>
        </GlassCard>
      </div>

      {/* Global Activity Table */}
      <GlassCard className="space-y-6">
        <h2 className="text-xl font-bold text-white">System Referral Transactions</h2>

        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No referral transaction requests recorded on the platform.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Candidate</th>
                  <th className="pb-3 pr-4">Job Details</th>
                  <th className="pb-3 pr-4">Submitted On</th>
                  <th className="pb-3 pr-4">Resume</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-900/10">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-white">{ref.requesterName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{ref.requesterEmail}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-slate-200">{ref.jobTitle}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{ref.jobCompany}</div>
                    </td>
                    <td className="py-4 pr-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(ref.createdAt).toLocaleDateString()}</span>
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <a
                        href={ref.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary-400 hover:text-primary-300 text-xs font-semibold"
                      >
                        <span>Open Resume</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ref.status)}`}>
                        {ref.status}
                      </span>
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

export default AdminDashboard;
