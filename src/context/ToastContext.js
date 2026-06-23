// Lightweight toast system. Any screen calls useToast().showToast(message, opts)
// and a snackbar slides up from the bottom. Rendered once here so it overlays
// the whole app regardless of which screen is active.
import React, { createContext, useCallback, useContext, useState } from 'react';

import Toast from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  // options: { actionLabel, onAction }
  const showToast = useCallback((message, options = {}) => {
    setToast({
      id: Date.now(),
      message,
      actionLabel: options.actionLabel,
      onAction: options.onAction,
    });
  }, []);

  const hide = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toast={toast} onHide={hide} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider');
  }
  return context;
}
