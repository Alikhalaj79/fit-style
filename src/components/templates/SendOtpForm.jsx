import * as React from "react";
//material ui imports
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
  Snackbar,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

//a function for handle send otp
import { sendOtp } from "../../services/auth";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

//material ui direction setting for input
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const SendOtpForm = ({ mobile, setStep, setMobile }) => {
  const [otp, setOtp] = React.useState(null); //set otp in this component for showing the code to user
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false); //Control dialog open/close
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false); // Control error dialog open/close
  const [errorMessage, setErrorMessage] = React.useState(""); // Store error message

  //handle form to submit mobile number
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { response, error } = await sendOtp(mobile);
    setLoading(false);
    console.log(response, error);
    if (response) {
      // setStep(2);
      setOtp(response.data.data.code);
      setOpenDialog(true);
    } else {
      setErrorMessage("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید."); // Set error message
      setErrorDialogOpen(true); // Open error dialog
    }
  };

  // Close the dialog and proceed to the next step
  const handleClose = () => {
    setOpenDialog(false);
    setStep(2); // Proceed to the next step (checkOtp)like redirect or navigate to another component
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

  // Close error dialog
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Grid2
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Grid2>
        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "rgba(0,0,0,0.1) 0px 4px 12px",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <form onSubmit={submitHandler}>
              <Typography margin={"auto"} sx={{ fontSize: 20, m: 4 }}>
                ورود از طریق رمز یکبار مصرف
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={2}>
                برای دریافت رمز یکبار مصرف و ورود به حساب کاربری خود ، شماره
                تلفن همراه خود را وارد کنید.
              </Typography>
              <CacheProvider value={cacheRtl}>
                <div dir="rtl">
                  <TextField
                    id="outlined-basic"
                    label="شماره تلفن همراه"
                    variant="outlined"
                    sx={{ mb: 4, mt: 4 }}
                    fullWidth
                    type="text"
                    name="mobile"
                    placeholder="*********09"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </CacheProvider>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "ارسال کد تایید"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid2>

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
    </Grid2>
  );
};

export default SendOtpForm;
