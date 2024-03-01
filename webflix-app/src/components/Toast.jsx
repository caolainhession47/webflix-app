import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const configureToast = () => {
  toast.configure();
};

const Toast = ({ type, text }) => {
  const showToast = () => {
    switch (type) {
      case "success":
        toast.success(text);
        break;
      case "info":
        toast.info(text);
        break;
      case "warning":
        toast.warn(text);
        break;
      case "error":
        toast.error(text);
        break;
      default:
        toast(text);
    }
  };

  React.useEffect(() => {
    showToast();
  }, []);

  return null;
};

export default Toast;
