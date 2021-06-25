import { toast } from 'react-toastify';

export const alertError = (message: string) => {
  toast.error(message);
};

export const alertSuccess = (message: string) => {
  toast(message);
};
