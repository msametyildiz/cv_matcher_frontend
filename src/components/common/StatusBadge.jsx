import React from 'react';

const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in progress':
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-1.5 text-sm';
      case 'md':
      default:
        return 'px-3 py-1 text-xs';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${getStatusStyles()} ${getSizeClasses()} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
