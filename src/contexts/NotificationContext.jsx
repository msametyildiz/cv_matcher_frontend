import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Create context
const NotificationContext = createContext();

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const NotificationProvider = ({ children }) => {
  // State for holding notifications
  const [notifications, setNotifications] = useState([]);
  
  // Auto-remove notifications after they expire
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(current => 
        current.filter(notification => 
          notification.persistent || Date.now() < notification.expiresAt
        )
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  /**
   * Add a new notification
   * @param {string} message - Notification message
   * @param {string} type - Type of notification (success, error, info, warning)
   * @param {Object} options - Additional options
   * @param {boolean} options.persistent - If true, notification won't auto-dismiss
   * @param {number} options.duration - Duration in ms before auto-dismiss (default: 5000)
   * @param {Function} options.onAction - Callback function for action button
   * @param {string} options.actionLabel - Label for action button
   */
  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
    const id = Date.now().toString();
    const duration = options.duration || 5000;
    
    // Create the notification object
    const notification = {
      id,
      message,
      type,
      createdAt: Date.now(),
      expiresAt: options.persistent ? Infinity : Date.now() + duration,
      persistent: !!options.persistent,
      actionLabel: options.actionLabel,
      onAction: options.onAction,
    };
    
    // Add to internal state
    setNotifications(current => [...current, notification]);
    
    // Also show toast for immediate feedback
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(message, { duration });
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(message, { duration });
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast(message, { 
          duration,
          icon: '⚠️',
          style: { 
            backgroundColor: '#FFFBEB', 
            color: '#92400E',
            border: '1px solid #FEF3C7'
          }
        });
        break;
      case NOTIFICATION_TYPES.INFO:
      default:
        toast(message, { 
          duration,
          icon: 'ℹ️',
          style: { 
            backgroundColor: '#EFF6FF', 
            color: '#1E40AF',
            border: '1px solid #DBEAFE'
          }
        });
        break;
    }
    
    return id;
  }, []);
  
  /**
   * Remove a notification by ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications(current => current.filter(notification => notification.id !== id));
  }, []);
  
  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    toast.dismiss();
  }, []);
  
  /**
   * Update an existing notification
   */
  const updateNotification = useCallback((id, updates) => {
    setNotifications(current => 
      current.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      )
    );
  }, []);
  
  /**
   * Shorthand methods for specific notification types
   */
  const success = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, options);
  }, [addNotification]);
  
  const error = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.ERROR, options);
  }, [addNotification]);
  
  const info = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, options);
  }, [addNotification]);
  
  const warning = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.WARNING, options);
  }, [addNotification]);
  
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    updateNotification,
    success,
    error,
    info,
    warning,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to use the notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;