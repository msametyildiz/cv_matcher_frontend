// src/components/common/Modal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  closeOnOverlayClick = true,
  footer
}) => {
  useEffect(() => {
    // Prevent page scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Modal size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className={clsx(
            'bg-white rounded-lg shadow-xl transform transition-all w-full',
            'overflow-hidden relative z-10',
            sizeClasses[size] || sizeClasses.md
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>
          
          {/* Modal Footer (optional) */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
