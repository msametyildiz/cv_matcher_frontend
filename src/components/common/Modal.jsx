// src/components/common/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={clsx('w-full bg-white rounded-lg shadow-lg p-6 relative', sizeClasses[size])}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
