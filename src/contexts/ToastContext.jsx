import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'error', 'warning', 'info', 'success'
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const value = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          marginTop: 2,
          "& .MuiSnackbarContent-root": {
            padding: 0,
          },
        }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            fontSize: "0.9rem",
            fontWeight: 500,
            padding: "12px 20px",
            margin: "8px",
            minWidth: "300px",
            maxWidth: "500px",
            "& .MuiAlert-message": {
              textAlign: "center",
              width: "100%",
              padding: "4px 8px",
              lineHeight: 1.5,
            },
            "& .MuiAlert-action": {
              paddingLeft: 2,
              marginRight: 1,
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
