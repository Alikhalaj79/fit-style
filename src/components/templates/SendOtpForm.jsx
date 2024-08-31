import * as React from "react";
//material ui imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

//a function for handle send otp
import { sendOtp } from "../../services/auth";

//material ui setting for input
// const theme = (outerTheme) =>
//   createTheme({
//     direction: "rtl",
//     palette: {
//       mode: outerTheme.palette,
//     },
//   });
  
  //material ui setting for input
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const SendOtpForm = ({ mobile, setStep, setMobile }) => {
    //handle form to submit mobile number
    const submitHandler = async (event) => {
      event.preventDefault();
      const { response, error } = await sendOtp(mobile);
    console.log(response, error);
    if (response) {
      setStep(2);
    } else {
      console.log("مشکلی پیش آمده است");
    }
  };
  
  return (
    <Grid
      sx={{ minHeight: "100vh" }}
      container
      alignItems="center"
      justifyContent="center"
    >
      <Card
        sx={{ minWidth: 500, maxWidth: 700, minHeight: 450 }}
        variant="outlined"
        >
        <CardContent
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          >
          <Grid>
            <form onSubmit={submitHandler}>
              <Typography margin={"auto"} sx={{ fontSize: 20, m: 4 }}>
                ورود از طریق رمز یکبار مصرف
              </Typography>
              <label htmlFor="input">شماره موبایل خود را وارد کنید</label>
              <CacheProvider value={cacheRtl}>
              
                  <div dir="rtl">
                    <TextField
                      id="outlined-basic"
                      label="شماره تلفن همراه"
                      variant="outlined"
                      sx={{ m: 4 }}
                      type="text"
                      name="mobile"
                      placeholder="*********09"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
              </CacheProvider>
              <Button variant="contained" type="submit">
                ارسال کد تایید
              </Button>
            </form>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
    
  );
};

export default SendOtpForm;
