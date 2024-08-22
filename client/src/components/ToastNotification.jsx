import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => (
    <ToastContainer toastStyle={{color: "white", backgroundColor: "#00263d"}} closeButton={{color: "white"}} theme="dark"/>
  );
  
  export const showErrorToast = (message) => {
    toast.error(message);
  };
  
  export const showSuccessToast = (message) => {
    toast.success(message);
  };


export default ToastNotification;