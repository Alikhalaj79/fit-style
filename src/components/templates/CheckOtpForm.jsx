import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop,
  Snackbar,
} from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { checkOtp, sendOtp } from "../../services/auth";
import { setCookie } from "../../utils/cookie";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const CheckOtpForm = ({ mobile, code, setCode, setStep , startTimer , timer}) => {
  const [otp, setOtp] = useState(null); //set otp in this component for showing the code to user
  const [openDialog, setOpenDialog] = useState(false); //Control dialog open/close
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true); // handle resend button disable

  //enable resend button
  useEffect(() => {
    setResendDisabled(timer > 0);
  }, [timer]);


  //handle otp
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { response, error } = await checkOtp(mobile, code);
    setLoading(false);

    if (response) {
      console.log("کد تایید شد، می‌توانید ادامه دهید");
      console.log(response);
      setCookie(response.data.data.user);
    } else {
      setErrorMessage("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید."); // Set error message
      setErrorDialogOpen(true); // Open error dialog
      console.log(error);
    }
  };

  // Close the dialog and proceed to the next step
  const handleClose = () => {
    setOpenDialog(false);
  };

  // Handle copying OTP to clipboard
  const handleCopyOtp = () => {
    navigator.clipboard.writeText(otp).then(() => {
      setSnackbarOpen(true); // Show snackbar on successful copy
    });
  };
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  //close error dialog
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const resendHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { response, error } = await sendOtp(mobile);
    setLoading(false);
    console.log(response, error);
    if (response) {
      console.log(response);
      setOtp(response.data.data.code);// for showing code to user
      setOpenDialog(true);
      startTimer();
    } else {
      setErrorMessage("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید."); // Set error message
      setErrorDialogOpen(true); // Open error dialog
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "rgba(0,0,0,0.1) 0px 4px 12px",
          margin: "auto",
          marginTop: "100px",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <form onSubmit={submitHandler}>
            <Typography margin={"auto"} sx={{ fontSize: 20, m: 4 }}>
              تایید کد ورود
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={2}>
              <span>کد ارسال شده به شماره {mobile} را وارد کنید</span>
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              اعتبار کد: {timer} ثانیه
            <Button variant="outlined" sx={{mr: 2}} onClick={resendHandler} disabled={resendDisabled}>ارسال دوباره کد</Button>
            </Typography>
            <CacheProvider value={cacheRtl}>
              <div dir="rtl">
                <TextField
                  id="otp-code"
                  label="کد تایید"
                  variant="outlined"
                  sx={{ mb: 4, mt: 3 }}
                  fullWidth
                  type="text"
                  name="otp"
                  placeholder="*****"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </CacheProvider>
            <Button
              variant="contained"
              type="submit"
              //   fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "ورود"}
            </Button>
            <Button
              onClick={() => setStep(1)}
              variant="contained"
              sx={{ mr: 2 }}
            >
              تغیر شماره موبایل
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Backdrop with CircularProgress for loading */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Dialog for showing OTP */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>کد تایید شما</DialogTitle>
        <DialogContent>
          <Typography>
            این سایت به عنوان دمو ارائه شده است. کد تایید شما برای ورود:{" "}
            <strong style={{ cursor: "pointer" }} onClick={handleCopyOtp}>
              {otp}
            </strong>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 2 }}
            >
              اعتبار کد: {timer} ثانیه
            </Typography>
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: 2 }}
          >
            روی کد کلیک کنید تا کپی شود و برای ورود در مرحله بعد از آن استفاده
            کنید.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            تایید و ادامه
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for showing error messages */}
      <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog}>
        <DialogTitle>خطا</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for showing copy success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="کد تایید کپی شد!"
      />
    </>
  );
};

export default CheckOtpForm;