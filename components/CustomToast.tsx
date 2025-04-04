// components/CustomToast.tsx
"use client";

import { useEffect, useState } from "react";

export const CustomToast = () => {
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | null}>({
    message: '',
    type: null
  });

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: '', type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  if (!toast.message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
      toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      {toast.message}
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | null}>({
    message: '',
    type: null
  });

  return {
    toast: (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type });
    },
    error: (message: string) => {
      setToast({ message, type: 'error' });
    }
  };
};
