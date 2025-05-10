// src/components/auth/OAuthButtons.jsx
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const OAuthButtons = () => {
  const handleOAuth = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/${provider}`;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleOAuth('google')}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FcGoogle className="mr-2 h-5 w-5" /> Sign in with Google
      </button>

      <button
        onClick={() => handleOAuth('github')}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FaGithub className="mr-2 h-5 w-5" /> Sign in with GitHub
      </button>
    </div>
  );
};

export default OAuthButtons;