import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Aurora Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#22D3EE]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#111B30] border border-[#263449] rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] text-white shadow-lg shadow-purple-500/25 mb-3">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Sign in to <span className="aurora-gradient-text">TaskFlow</span>
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Engineered for high-performing modern development teams
          </p>
        </div>

        {/* Demo Account Helper Banner */}
        <div className="mb-6 p-3 rounded-xl bg-[#17233B] border border-[#263449] flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            <span>Need quick access?</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[#22D3EE] hover:underline font-semibold"
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

          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

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
        <div className="mt-6 text-center text-xs text-[#94A3B8]">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#8B5CF6] hover:text-[#22D3EE] font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
