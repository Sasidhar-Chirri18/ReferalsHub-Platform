import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Users, Zap, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-glow-blue rounded-full animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-glow-purple rounded-full animate-pulse-slow pointer-events-none" style={{ animationDelay: '-5s' }}></div>

      {/* Hero Section */}
      <div className="max-w-4xl text-center space-y-8 py-16 md:py-24 z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Get Referred to Your <br />
          <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">
            Dream Tech Job
          </span>
        </h1>
        <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Skip the resumes screening blackhole. Connect directly with referrers at top tech companies and accelerate your career.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/jobs"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-250 shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          {!user && (
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 glass-panel hover:bg-white/5 text-slate-200 hover:text-white font-semibold rounded-xl transition-all duration-200"
            >
              Sign Up to Request
            </Link>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16 z-10">
        <GlassCard className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-primary-500/10 text-primary-400 rounded-2xl border border-primary-500/20">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Direct Connections</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Get your application referred directly to internal recruiters by working referrers.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-accent-500/10 text-accent-400 rounded-2xl border border-accent-500/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Verified Referrers</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every referrer is verified with corporate credentials ensuring authentic leads.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Zap className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Real-Time Tracking</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Track status of your referral requests in real-time with instant notifications.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Home;
