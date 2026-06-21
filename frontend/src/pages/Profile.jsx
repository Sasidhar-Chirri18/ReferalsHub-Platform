import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Linkedin, Globe, FileText, Loader2, Save } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ProfileSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfileContext } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/api/users/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'yearsOfExperience' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user.role === 'REFERRER') {
        const response = await API.put('/api/users/profile/referrer', profile);
        setProfile(response.data);
        updateProfileContext({ name: response.data.name });
      } else {
        const response = await API.put('/api/users/profile/user', profile);
        setProfile(response.data);
        updateProfileContext({ name: response.data.name });
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 min-h-[80vh]">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Your Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your identity and details</p>
      </div>

      <GlassCard>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={profile.name || ''}
                  onChange={handleInputChange}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  disabled
                  value={profile.email || ''}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-slate-500 cursor-not-allowed text-sm focus:outline-none bg-slate-950/40"
                />
              </div>
            </div>

            {/* Candidate layout */}
            {user.role !== 'REFERRER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Skills (Comma-separated)</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="skills"
                      value={profile.skills || ''}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="React, Java, Spring Boot, MySQL"
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
                      value={profile.linkedinUrl || ''}
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
                      value={profile.portfolioUrl || ''}
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
                      value={profile.resumeUrl || ''}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400">Experience Description</label>
                  <textarea
                    name="experience"
                    rows="4"
                    value={profile.experience || ''}
                    onChange={handleInputChange}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none resize-none"
                    placeholder="Describe your history and accomplishments..."
                  ></textarea>
                </div>
              </>
            )}

            {/* Referrer layout */}
            {user.role === 'REFERRER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Company Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="companyName"
                      value={profile.companyName || ''}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="Google"
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
                      value={profile.designation || ''}
                      onChange={handleInputChange}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    min="0"
                    value={profile.yearsOfExperience || 0}
                    onChange={handleInputChange}
                    className="w-full glass-input px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2 flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-sm font-semibold text-white">Accepting Referral Requests</label>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle whether candidates can send you new requests.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="referralAvailability"
                    checked={profile.referralAvailability || false}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-primary-600/10"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Profile;
