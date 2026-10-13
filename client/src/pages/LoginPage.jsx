import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { TaskFlowLogo } from '../components/common/TaskFlowLogo';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleFillDemo = () => {
    setEmail('alice@example.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle pastel ambient background blurs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#F0EFFF] rounded-full blur-3xl pointer-events-none opacity-80" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#EAF2FF] rounded-full blur-3xl pointer-events-none opacity-80" />

      <div className="w-full max-w-md bg-white border border-[#E5EAF2] rounded-2xl shadow-card p-8 relative z-10">
        {/* Brand Header with TaskFlowLogo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <TaskFlowLogo size="lg" to="/login" showBadge={true} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#202B42]">
            Welcome back
          </h1>
          <p className="text-sm text-[#68758B] mt-1.5 font-normal">
            Sign in to continue to your TaskFlow workspace.
          </p>
        </div>

        {/* Demo Account Helper Banner */}
        <div className="mb-6 p-3 rounded-xl bg-[#F0EFFF] border border-[#E4E2FF] flex items-center justify-between text-xs text-[#202B42]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5B5FEF]" />
            <span className="font-medium">Need quick access?</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[#5B5FEF] hover:text-[#484BD1] hover:underline font-bold"
          >
            Fill Demo Credentials
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
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

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            size="lg"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center text-xs text-[#68758B] font-medium">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#5B5FEF] hover:text-[#484BD1] font-bold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
