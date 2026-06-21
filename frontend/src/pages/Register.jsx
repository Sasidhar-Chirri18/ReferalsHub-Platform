import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Briefcase, Linkedin, Globe, FileText, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';

const Register = () => {
  const [role, setRole] = useState('USER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    skills: '',
    experience: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    companyName: '',
    designation: '',
    yearsOfExperience: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      return toast.error('Please fill in all required fields (Name, Email, Password)');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setSubmitting(true);
    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        role: role,
        name: formData.name,
      };

      if (role === 'USER') {
        registerData.skills = formData.skills;
        registerData.experience = formData.experience;
        registerData.linkedinUrl = formData.linkedinUrl;
        registerData.portfolioUrl = formData.portfolioUrl;
        registerData.resumeUrl = formData.resumeUrl;
      } else {
        registerData.companyName = formData.companyName;
        registerData.designation = formData.designation;
        registerData.yearsOfExperience = formData.yearsOfExperience;
      }

      const response = await register(registerData);
      toast.success(`Account created! Welcome, ${response.name}!`);

      if (role === 'REFERRER') {
        navigate('/referrer-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-glow-blue rounded-full animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-glow-purple rounded-full animate-pulse-slow pointer-events-none"></div>

      <GlassCard className="max-w-2xl w-full space-y-6 z-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="text-slate-400 text-sm">
            Join ReferalsHub to start getting referred or sharing job posts
          </p>
        </div>

        {/* Role selection */}
        <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('USER')}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all duration-200 ${
              role === 'USER'
                ? 'bg-primary-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I am a Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('REFERRER')}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all duration-200 ${
              role === 'REFERRER'
                ? 'bg-primary-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I am a Referrer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            {/* Candidate section */}
            {role === 'USER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Skills (Comma-separated)</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="React, Java, Spring, MySQL"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Portfolio URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="https://myportfolio.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Resume Link</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="url"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400">Experience Summary</label>
                  <textarea
                    name="experience"
                    rows="3"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none resize-none"
                    placeholder="Briefly describe your professional experience..."
                  ></textarea>
                </div>
              </>
            )}

            {/* Referrer section */}
            {role === 'REFERRER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Company Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="Google, Meta, Netflix"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Designation</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    placeholder="e.g. 5"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex justify-center items-center space-x-2 shadow-lg shadow-primary-600/20"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Register;
