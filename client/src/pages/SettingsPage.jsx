import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Palette,
  Shield,
  Save,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    bio: user?.bio || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsUpdatingProfile(true);
    await updateProfile(profileData);
    setIsUpdatingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    const result = await updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );
    setIsUpdatingPassword(false);

    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#263449]/50">
        <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">Settings</h2>
        <p className="text-sm text-[#94A3B8] mt-1">
          Manage your account credentials, workspace profile, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information Card */}
        <Card>
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#263449]">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-[#8B5CF6] border border-purple-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Profile Details</h3>
              <p className="text-xs text-[#94A3B8]">Your identity across projects and team tasks</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />

            <Input
              label="Professional Role / Title"
              value={profileData.title}
              onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
              placeholder="e.g. Lead Frontend Engineer"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Bio / Focus</label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Briefly describe your responsibilities..."
                className="w-full rounded-lg bg-[#0F172A] border border-[#263449] text-[#F8FAFC] text-sm p-3 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                isLoading={isUpdatingProfile}
                className="w-full"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card>
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#263449]">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-[#22D3EE] border border-cyan-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Security & Password</h3>
              <p className="text-xs text-[#94A3B8]">Update your account login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              placeholder="Min. 6 characters"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
              }
              placeholder="Repeat new password"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="secondary"
                icon={Lock}
                isLoading={isUpdatingPassword}
                className="w-full"
              >
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* System Theme & Session Management */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#F8FAFC]">
              Design System Theme: Midnight Aurora
            </h4>
            <p className="text-xs text-[#94A3B8]">
              High-contrast dark mode tailored for deep work productivity and reduced eye strain.
            </p>
          </div>
        </div>

        <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
          Sign Out of Session
        </Button>
      </Card>
    </div>
  );
};
