import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-[#111B30] border border-[#263449] text-[#8B5CF6] mb-6 shadow-glow-violet">
        <Layers className="w-12 h-12" />
      </div>
      <h1 className="text-5xl font-extrabold text-[#F8FAFC] tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-[#F8FAFC] mt-2 mb-3">
        Page Not Found
      </h2>
      <p className="text-sm text-[#94A3B8] max-w-md mb-8">
        The workspace path or task resource you are attempting to access does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft} size="lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
