// Simple wrapper around toast functionality
import { useNotification } from '../contexts/NotificationContext';

// Export a simple object with the toast methods
export const toast = {
  success: (message) => {
    if (window.notificationApi) {
      window.notificationApi.success(message);
    } else {
      console.log('Success:', message);
    }
  },
  error: (message) => {
    if (window.notificationApi) {
      window.notificationApi.error(message);
    } else {
      console.error('Error:', message);
    }
  },
  info: (message) => {
    if (window.notificationApi) {
      window.notificationApi.info(message);
    } else {
      console.info('Info:', message);
    }
  },
  warning: (message) => {
    if (window.notificationApi) {
      window.notificationApi.warning(message);
    } else {
      console.warn('Warning:', message);
    }
  }
};

// Mock ToastContainer that does nothing
export const ToastContainer = () => null;
