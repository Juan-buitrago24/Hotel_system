import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast = ({ id, message, type, duration }) => {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(id), 300);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const config = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 border-green-500 text-green-800',
      iconClassName: 'text-green-500'
    },
    error: {
      icon: XCircle,
      className: 'bg-red-50 border-red-500 text-red-800',
      iconClassName: 'text-red-500'
    },
    warning: {
      icon: AlertCircle,
      className: 'bg-yellow-50 border-yellow-500 text-yellow-800',
      iconClassName: 'text-yellow-500'
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-500 text-blue-800',
      iconClassName: 'text-blue-500'
    }
  };

  const { icon: Icon, className, iconClassName } = config[type] || config.info;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 
        min-w-[320px] max-w-[480px] pointer-events-auto
        transform transition-all duration-300 ease-out
        ${className}
        ${isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100 animate-slideIn'
        }
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconClassName}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
