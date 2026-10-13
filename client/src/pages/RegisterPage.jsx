import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { TaskFlowLogo } from '../components/common/TaskFlowLogo';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    );
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle pastel ambient background blurs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#F0EFFF] rounded-full blur-3xl pointer-events-none opacity-80" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#EAF2FF] rounded-full blur-3xl pointer-events-none opacity-80" />

      <div className="w-full max-w-md bg-white border border-[#E5EAF2] rounded-2xl shadow-card p-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4">
            <TaskFlowLogo size="lg" to="/register" showBadge={true} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#202B42]">
            Create your workspace
          </h1>
          <p className="text-sm text-[#68758B] mt-1.5 font-normal">
            Get started with TaskFlow in seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            placeholder="Alice Cooper"
            required
            error={errors.name}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            error={errors.email}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-8 text-[#96A0B2] hover:text-[#202B42] transition-colors p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              error={errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-8 text-[#96A0B2] hover:text-[#202B42] transition-colors p-1"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            size="lg"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Create Workspace Account
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#68758B] font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#5B5FEF] hover:text-[#484BD1] font-bold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
