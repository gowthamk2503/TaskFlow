import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { TaskFlowLogo } from '../components/common/TaskFlowLogo';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="mb-6">
        <TaskFlowLogo size="lg" to="/dashboard" />
      </div>
      <h1 className="text-5xl font-extrabold text-[#202B42] tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-[#202B42] mt-2 mb-3">
        Page Not Found
      </h2>
      <p className="text-sm text-[#68758B] max-w-md mb-8 font-normal">
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
