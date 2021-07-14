import { toast } from 'react-toastify';

export const alertError = (message: string) => {
  toast.error(message);
};

export const alertErrorHTML = (message: any) => {
  toast.error(message, {autoClose: false});
};

export const alertSuccess = (message: string) => {
  toast(message);
};
