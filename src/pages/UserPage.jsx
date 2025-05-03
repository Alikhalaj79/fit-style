import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { logOutUser, getUserProfile } from "../services/users";

const UserPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    // select: (response) => response?.data?.user || {},
  });
  console.log(user.data.data.user);

  const logoutMutation = useMutation({
    mutationFn: logOutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.removeQueries({ queryKey: ["profile"] });
      navigate("/login");
    },
    onError: (error) => {
      console.error("خطا در خروج از حساب:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put("user/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setOpenModal(false);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        خطایی در بارگذاری اطلاعات پروفایل رخ داد. لطفاً دوباره تلاش کنید.
      </Typography>
    );
  }

  const hasIncompleteInfo = !user?.fullName || !user?.username || !user?.email;

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 4 }, direction: "rtl" }}>
      <Typography
        variant="h5"
        // fontWeight="bold"
        mb={4}
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        پروفایل کاربر
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 4 },
        }}
      >
        {/* Profile Card */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: 400 },
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            height: "fit-content",
            backgroundColor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar src={user?.avatar || ""} sx={{ width: 80, height: 80 }}>
              {!user?.avatar &&
                (user?.fullName?.charAt(0) || user?.mobile?.charAt(0))}
            </Avatar>
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={1}
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              textAlign: "center",
            }}
          >
            {user?.fullName ? `${user.fullName} عزیز` : "کاربر عزیز"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={2}
            sx={{ textAlign: "center" }}
          >
             {user?.data?.data?.user?.mobile }
          </Typography>
          <Stack spacing={1}>
            {user?.fullName && (
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                نام و نام خانوادگی: {user.fullName}
              </Typography>
            )}
            {user?.username && (
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                نام کاربری: {user.username}
              </Typography>
            )}
            {user?.email && (
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                ایمیل: {user.email}
              </Typography>
            )}
           
          </Stack>
          {hasIncompleteInfo && (
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleOpenModal}
              sx={{
                mt: 2,
                borderRadius: 2,
                backgroundColor: "#FF6B00",
                "&:hover": {
                  backgroundColor: "#E65A00",
                  boxShadow: "0 4px 12px rgba(255, 111, 0, 0.3)",
                },
                py: { xs: 1, sm: 1.5 },
                transition: "all 0.3s ease-in-out",
              }}
            >
              تکمیل اطلاعات
            </Button>
          )}
          <Button
            variant="outlined"
            fullWidth
            size="large"
            color="error"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            sx={{
              mt: 2,
              borderRadius: 2,
              py: { xs: 1, sm: 1.5 },
              transition: "all 0.3s ease-in-out",
            }}
          >
            {logoutMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              "خروج از حساب"
            )}
          </Button>
        </Paper>
        
      </Box>

      {/* Modal for Completing Profile */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullScreen={false}
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 2 },
            maxWidth: { xs: "90%", sm: "400px" },
            width: "100%",
            margin: { xs: "auto", sm: "32px" },
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
            maxHeight: { xs: "90vh", sm: "calc(100% - 64px)" },
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            fontWeight: 600,
            color: "#212121",
            textAlign: "center",
            padding: { xs: "16px", sm: "24px 24px 16px" },
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: "#fafafa",
          }}
        >
          تکمیل اطلاعات پروفایل
        </DialogTitle>
        <DialogContent
          sx={{
            padding: { xs: "24px 16px", sm: "32px 24px" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
            flex: 1,
            overflowY: "auto",
          }}
        >
          <TextField
            label="نام و نام خانوادگی"
            name="fullName"
            variant="outlined"
            fullWidth
            value={formData.fullName}
            onChange={handleChange}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            label="نام کاربری"
            name="username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            label="ایمیل"
            name="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{ borderRadius: 2 }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            padding: { xs: "16px", sm: "24px" },
            justifyContent: "center",
            gap: { xs: 1, sm: 2 },
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: "#fafafa",
          }}
        >
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              minWidth: { xs: "90px", sm: "120px" },
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              color: "#757575",
              borderColor: "#e0e0e0",
              padding: { xs: "6px 12px", sm: "10px 20px" },
              "&:hover": {
                borderColor: "#bdbdbd",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={() => updateMutation.mutate(formData)}
            variant="contained"
            disabled={updateMutation.isPending}
            sx={{
              minWidth: { xs: "90px", sm: "120px" },
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              backgroundColor: "#FF6F00",
              padding: { xs: "6px 12px", sm: "10px 20px" },
              "&:hover": {
                backgroundColor: "#F57C00",
                boxShadow: "0 4px 12px rgba(255, 111, 0, 0.3)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(255, 111, 0, 0.5)",
                color: "#fff",
              },
            }}
          >
            {updateMutation.isPending ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "ذخیره"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
