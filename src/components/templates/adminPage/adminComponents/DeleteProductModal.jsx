import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// deleteProduct function
import { deleteProduct } from "../../../../services/admin";

const DeleteProductModal = ({
  openDeleteModal,
  onClose,
  product,
  openSnackbar,
  setOpenSnackbar,
  snackbarMessage,
  setSnackbarMessage,
  snackbarSeverity,
  setSnackbarSeverity,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] }),
        setSnackbarMessage("محصول با موفقیت حذف شد");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: () => {
      setSnackbarMessage("خطا در حذف محصول");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });
  const deleteHandler = () => {
    mutate(product.id);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <div>
      <Dialog open={openDeleteModal} onClose={onClose}>
        <DialogTitle>حذف محصول</DialogTitle>
        <DialogContent>
          <DialogContentText>محصول مورد نظر حذف شود؟</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: 2 }}>
          <Button onClick={onClose} color="primary" variant="outlined">
            لغو
          </Button>
          <Button onClick={deleteHandler} color="error" variant="contained">
            {isPending ? "درحال حذف ..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%", gap: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeleteProductModal;
