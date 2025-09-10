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
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Email,
  LocationOn,
  Home,
  LocationCity,
  Public,
  LocalPostOffice,
  CheckCircle,
  Edit,
} from "@mui/icons-material";
import { logOutUser, getUserProfile, updateProfile } from "../services/users";
import { useToast } from "../contexts/ToastContext";

const UserPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Iran",
    },
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
  console.log("User profile data:", user);

  // Extract user data for easier access
  const userData = user?.data?.data?.user;

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    const fields = [
      formData.fullName,
      formData.email,
      formData.address.street,
      formData.address.city,
      formData.address.state,
      formData.address.postalCode,
    ];
    const filledFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePostalCode = (postalCode) => {
    const postalRegex = /^\d{10}$/;
    return postalRegex.test(postalCode);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "نام و نام خانوادگی الزامی است";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "نام باید حداقل 2 کاراکتر باشد";
    }

    if (!formData.email.trim()) {
      errors.email = "ایمیل الزامی است";
    } else if (!validateEmail(formData.email)) {
      errors.email = "فرمت ایمیل صحیح نیست";
    }

    if (!formData.address.street.trim()) {
      errors.street = "آدرس خیابان الزامی است";
    }

    if (!formData.address.city.trim()) {
      errors.city = "شهر الزامی است";
    }

    if (!formData.address.state.trim()) {
      errors.state = "استان الزامی است";
    }

    if (!formData.address.postalCode.trim()) {
      errors.postalCode = "کد پستی الزامی است";
    } else if (!validatePostalCode(formData.address.postalCode)) {
      errors.postalCode = "کد پستی باید 10 رقم باشد (مثال: 1234567890)";
    }

    return errors;
  };

  const [formErrors, setFormErrors] = useState({});

  const logoutMutation = useMutation({
    mutationFn: logOutUser,
    onSuccess: () => {
      // Show success toast for logout
      showToast(" شما با موفقیت از حساب کاربری خارج شدید  ", "success");

      // Clear any stored user data
      localStorage.removeItem("user");
      sessionStorage.clear();

      // Invalidate profile queries to force refetch (same as login logic)
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // Navigate to login page
      navigate("/login");
    },
    onError: (error) => {
      console.error("خطا در خروج از حساب:", error);
      showToast("خطا در خروج از حساب کاربری", "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      console.log("✅ Profile update successful:", {
        response: data,
        timestamp: new Date().toISOString(),
      });
      showToast("اطلاعات پروفایل با موفقیت به‌روزرسانی شد", "success");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setOpenModal(false);
    },
    onError: (error) => {
      console.error("❌ Profile update failed:", {
        error: error,
        timestamp: new Date().toISOString(),
      });
      showToast("خطا در به‌روزرسانی اطلاعات", "error");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });

      // Clear error for this field
      if (formErrors[addressField]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[addressField];
          return newErrors;
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });

      // Clear error for this field
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    const formDataToSet = {
      fullName: userData?.fullName || "",
      username: userData?.username || "",
      email: userData?.email || "",
      address: {
        street: userData?.address?.street || "",
        city: userData?.address?.city || "",
        state: userData?.address?.state || "",
        postalCode: userData?.address?.postalCode || "",
        country: userData?.address?.country || "Iran",
      },
    };

    console.log("📝 Setting form data:", {
      userData: userData,
      formData: formDataToSet,
      timestamp: new Date().toISOString(),
    });

    setFormData(formDataToSet);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormErrors({}); // Clear errors when closing
  };

  const handleSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("لطفاً خطاهای فرم را برطرف کنید", "error");
      return;
    }

    // Clear any existing errors
    setFormErrors({});

    // Submit the form
    updateMutation.mutate(formData);
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

  const hasIncompleteInfo =
    !userData?.fullName ||
    !userData?.email ||
    !userData?.address?.street ||
    !userData?.address?.city ||
    !userData?.address?.state ||
    !userData?.address?.postalCode;

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
            <Avatar src={userData?.avatar || ""} sx={{ width: 80, height: 80 }}>
              {!userData?.avatar &&
                (userData?.fullName?.charAt(0) || userData?.mobile?.charAt(0))}
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
            {userData?.fullName ? `${userData.fullName} عزیز` : "کاربر عزیز"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={2}
            sx={{ textAlign: "center" }}
          >
            {userData?.mobile}
          </Typography>
          {/* Profile Completion Status */}
          {hasIncompleteInfo && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                p: 1.5,
                backgroundColor: "rgba(255, 152, 0, 0.1)",
                borderRadius: 2,
                border: "1px solid rgba(255, 152, 0, 0.2)",
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#FF9800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                !
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#FF9800", fontWeight: 600 }}
              >
                برخی اطلاعات پروفایل ناقص است
              </Typography>
            </Box>
          )}

          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userData?.fullName ? (
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#FF9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  !
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: userData?.fullName ? "inherit" : "#FF9800",
                  fontWeight: userData?.fullName ? "normal" : 600,
                }}
              >
                نام و نام خانوادگی: {userData?.fullName || "تکمیل نشده"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userData?.username ? (
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#FF9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  !
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: userData?.username ? "inherit" : "#FF9800",
                  fontWeight: userData?.username ? "normal" : 600,
                }}
              >
                نام کاربری: {userData?.username || "تکمیل نشده"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userData?.email ? (
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#FF9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  !
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: userData?.email ? "inherit" : "#FF9800",
                  fontWeight: userData?.email ? "normal" : 600,
                }}
              >
                ایمیل: {userData?.email || "تکمیل نشده"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userData?.address?.street ? (
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#FF9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  !
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: userData?.address?.street ? "inherit" : "#FF9800",
                  fontWeight: userData?.address?.street ? "normal" : 600,
                }}
              >
                آدرس: {userData?.address?.street || "تکمیل نشده"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userData?.address?.city ? (
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#FF9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  !
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: userData?.address?.city ? "inherit" : "#FF9800",
                  fontWeight: userData?.address?.city ? "normal" : 600,
                }}
              >
                شهر: {userData?.address?.city || "تکمیل نشده"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userData?.address?.state ? (
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#FF9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  !
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: userData?.address?.state ? "inherit" : "#FF9800",
                  fontWeight: userData?.address?.state ? "normal" : 600,
                }}
              >
                استان: {userData?.address?.state || "تکمیل نشده"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userData?.address?.postalCode ? (
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#FF9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  !
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: userData?.address?.postalCode ? "inherit" : "#FF9800",
                  fontWeight: userData?.address?.postalCode ? "normal" : 600,
                }}
              >
                کد پستی: {userData?.address?.postalCode || "تکمیل نشده"}
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleOpenModal}
            sx={{
              mt: 2,
              borderRadius: 2,
              backgroundColor: hasIncompleteInfo ? "#FF6B00" : "#4caf50",
              "&:hover": {
                backgroundColor: hasIncompleteInfo ? "#E65A00" : "#45a049",
                boxShadow: hasIncompleteInfo
                  ? "0 4px 12px rgba(255, 111, 0, 0.3)"
                  : "0 4px 12px rgba(76, 175, 80, 0.3)",
              },
              py: { xs: 1, sm: 1.5 },
              transition: "all 0.3s ease-in-out",
            }}
          >
            {hasIncompleteInfo ? "تکمیل اطلاعات" : "ویرایش اطلاعات"}
          </Button>
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
            borderRadius: { xs: 3, sm: 4 },
            maxWidth: { xs: "95%", sm: "600px" },
            width: "100%",
            margin: { xs: "auto", sm: "32px" },
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
            maxHeight: { xs: "95vh", sm: "calc(100% - 64px)" },
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "1.3rem", sm: "1.5rem" },
            fontWeight: 700,
            color: "#212121",
            textAlign: "center",
            padding: { xs: "24px 16px", sm: "32px 24px 20px" },
            borderBottom: "1px solid rgba(255, 111, 0, 0.1)",
            backgroundColor: "linear-gradient(135deg, #fff 0%, #fafafa 100%)",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              backgroundColor: "#FF6B00",
              borderRadius: "2px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#FF6B00",
              }}
            />
            {hasIncompleteInfo
              ? "تکمیل اطلاعات پروفایل"
              : "ویرایش اطلاعات پروفایل"}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#FF6B00",
              }}
            />
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            padding: { xs: "24px 16px", sm: "32px 24px" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#fafafa",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#FF6B00",
              borderRadius: "3px",
              "&:hover": {
                backgroundColor: "#E65A00",
              },
            },
          }}
        >
          {/* Progress Indicator */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: "#fff",
              border: "1px solid rgba(255, 111, 0, 0.1)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#666" }}
              >
                پیشرفت تکمیل اطلاعات
              </Typography>
              <Chip
                label={`${completionPercentage}%`}
                size="small"
                sx={{
                  backgroundColor:
                    completionPercentage === 100 ? "#4caf50" : "#FF6B00",
                  color: "#fff",
                  fontWeight: 600,
                }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundColor:
                    completionPercentage === 100 ? "#4caf50" : "#FF6B00",
                },
              }}
            />
            {completionPercentage === 100 && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#4caf50", fontWeight: 500 }}
                >
                  تمام اطلاعات تکمیل شده است
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Basic Information Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#fff",
              border: "1px solid rgba(255, 111, 0, 0.1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#FF6B00",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 20,
                  backgroundColor: "#FF6B00",
                  borderRadius: "2px",
                }}
              />
              اطلاعات شخصی
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="نام و نام خانوادگی"
                name="fullName"
                variant="outlined"
                fullWidth
                value={formData.fullName}
                onChange={handleChange}
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
                InputProps={{
                  startAdornment: (
                    <Person
                      sx={{
                        color: formErrors.fullName ? "#f44336" : "#FF6B00",
                        mr: 1,
                        fontSize: 20,
                      }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    pl: 1,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: formErrors.fullName ? "#f44336" : "#FF6B00",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: formErrors.fullName ? "#f44336" : "#FF6B00",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: formErrors.fullName ? "#f44336" : "#FF6B00",
                  },
                }}
              />
              <TextField
                label="نام کاربری"
                name="username"
                variant="outlined"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Edit sx={{ color: "#FF6B00", mr: 1, fontSize: 20 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    pl: 1,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF6B00",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF6B00",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FF6B00",
                  },
                }}
              />
              <TextField
                label="ایمیل"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                InputProps={{
                  startAdornment: (
                    <Email
                      sx={{
                        color: formErrors.email ? "#f44336" : "#FF6B00",
                        mr: 1,
                        fontSize: 20,
                      }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    pl: 1,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: formErrors.email ? "#f44336" : "#FF6B00",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: formErrors.email ? "#f44336" : "#FF6B00",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: formErrors.email ? "#f44336" : "#FF6B00",
                  },
                }}
              />
            </Stack>
          </Paper>

          {/* Address Information Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#fff",
              border: "1px solid rgba(255, 111, 0, 0.1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#FF6B00",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 20,
                  backgroundColor: "#FF6B00",
                  borderRadius: "2px",
                }}
              />
              اطلاعات آدرس
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="خیابان"
                name="address.street"
                variant="outlined"
                fullWidth
                value={formData.address.street}
                onChange={handleChange}
                error={!!formErrors.street}
                helperText={formErrors.street}
                InputProps={{
                  startAdornment: (
                    <Home
                      sx={{
                        color: formErrors.street ? "#f44336" : "#FF6B00",
                        mr: 1,
                        fontSize: 20,
                      }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    pl: 1,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: formErrors.street ? "#f44336" : "#FF6B00",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: formErrors.street ? "#f44336" : "#FF6B00",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: formErrors.street ? "#f44336" : "#FF6B00",
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  label="شهر"
                  name="address.city"
                  variant="outlined"
                  fullWidth
                  value={formData.address.city}
                  onChange={handleChange}
                  error={!!formErrors.city}
                  helperText={formErrors.city}
                  InputProps={{
                    startAdornment: (
                      <LocationCity
                        sx={{
                          color: formErrors.city ? "#f44336" : "#FF6B00",
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      pl: 1,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: formErrors.city ? "#f44336" : "#FF6B00",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: formErrors.city ? "#f44336" : "#FF6B00",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: formErrors.city ? "#f44336" : "#FF6B00",
                    },
                  }}
                />

                <TextField
                  label="استان"
                  name="address.state"
                  variant="outlined"
                  fullWidth
                  value={formData.address.state}
                  onChange={handleChange}
                  error={!!formErrors.state}
                  helperText={formErrors.state}
                  InputProps={{
                    startAdornment: (
                      <LocationOn
                        sx={{
                          color: formErrors.state ? "#f44336" : "#FF6B00",
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      pl: 1,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: formErrors.state ? "#f44336" : "#FF6B00",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: formErrors.state ? "#f44336" : "#FF6B00",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: formErrors.state ? "#f44336" : "#FF6B00",
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  label="کد پستی"
                  name="address.postalCode"
                  variant="outlined"
                  fullWidth
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  error={!!formErrors.postalCode}
                  helperText={formErrors.postalCode}
                  InputProps={{
                    startAdornment: (
                      <LocalPostOffice
                        sx={{
                          color: formErrors.postalCode ? "#f44336" : "#FF6B00",
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      pl: 1,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: formErrors.postalCode
                          ? "#f44336"
                          : "#FF6B00",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: formErrors.postalCode
                          ? "#f44336"
                          : "#FF6B00",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: formErrors.postalCode ? "#f44336" : "#FF6B00",
                    },
                  }}
                />

                <TextField
                  label="کشور"
                  name="address.country"
                  variant="outlined"
                  fullWidth
                  value={formData.address.country}
                  onChange={handleChange}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <Public sx={{ color: "#9e9e9e", mr: 1, fontSize: 20 }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                      pl: 1,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e0e0e0",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9e9e9e",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </DialogContent>
        <DialogActions
          sx={{
            padding: { xs: "20px 16px", sm: "24px" },
            justifyContent: "center",
            gap: { xs: 2, sm: 3 },
            borderTop: "1px solid rgba(255, 111, 0, 0.1)",
            backgroundColor: "linear-gradient(135deg, #fafafa 0%, #fff 100%)",
          }}
        >
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              minWidth: { xs: "100px", sm: "140px" },
              borderRadius: 3,
              textTransform: "none",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: 600,
              color: "#757575",
              borderColor: "#e0e0e0",
              padding: { xs: "10px 16px", sm: "12px 24px" },
              borderWidth: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#FF6B00",
                backgroundColor: "rgba(255, 107, 0, 0.05)",
                color: "#FF6B00",
                borderWidth: 2,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(255, 107, 0, 0.2)",
              },
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={updateMutation.isPending}
            sx={{
              minWidth: { xs: "100px", sm: "140px" },
              borderRadius: 3,
              textTransform: "none",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: 600,
              backgroundColor:
                completionPercentage === 100 ? "#4caf50" : "#FF6B00",
              padding: { xs: "10px 16px", sm: "12px 24px" },
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor:
                  completionPercentage === 100 ? "#45a049" : "#E65A00",
                transform: "translateY(-2px)",
                boxShadow:
                  completionPercentage === 100
                    ? "0 8px 20px rgba(76, 175, 80, 0.4)"
                    : "0 8px 20px rgba(255, 107, 0, 0.4)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(255, 107, 0, 0.5)",
                color: "#fff",
                transform: "none",
                boxShadow: "none",
              },
            }}
          >
            {updateMutation.isPending ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : completionPercentage === 100 ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle sx={{ fontSize: 18 }} />
                تکمیل و ذخیره
              </Box>
            ) : (
              "ذخیره اطلاعات"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
