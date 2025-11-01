import { useNotificationStore } from '@/store';
import { Notification } from '@/types';

export const useToast = () => {
  const addNotification = useNotificationStore(state => state.addNotification);

  const toast = {
    success: (title: string, message?: string) => {
      addNotification({
        type: 'success',
        title,
        message: message || '',
      });
    },
    error: (title: string, message?: string) => {
      addNotification({
        type: 'error',
        title,
        message: message || '',
      });
    },
    warning: (title: string, message?: string) => {
      addNotification({
        type: 'warning',
        title,
        message: message || '',
      });
    },
    info: (title: string, message?: string) => {
      addNotification({
        type: 'info',
        title,
        message: message || '',
      });
    },
  };

  return toast;
};