import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import heroBg from "../../../assets/images/hero-bg.jpg";

const Banner = () => {
  return (
    <Box
      sx={{
        height: {
          xs: "300px",
          sm: "350px",
          md: "400px",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        borderRadius: { xs: 0, sm: 5 },
        overflow: "hidden",
        marginTop: { xs: "30px", sm: "50px" },
        boxSizing: "border-box",
      }}
    >
      {/* dark effect */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 3 },
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
            fontSize: {
              xs: "1.5rem",
              sm: "2.25rem",
              md: "2.5rem",
            },
            textAlign: "center",
            width: "100%",
            boxSizing: "border-box",
            px: { xs: 1, sm: 2 },
          }}
        >
          فروشگاهی برای بهترین‌ها
        </Typography>
        <Typography
          variant="h6"
          mb={3}
          sx={{
            textShadow: "1px 1px 6px rgba(0, 0, 0, 0.6)",
            fontSize: {
              xs: "0.9rem",
              sm: "1.25rem",
              md: "1.5rem",
            },
            textAlign: "center",
            width: "100%",
            maxWidth: { xs: "100%", sm: "80%", md: "70%" },
            boxSizing: "border-box",
            px: { xs: 1, sm: 2 },
          }}
        >
          بهترین محصولات با بالاترین کیفیت و قیمت مناسب. همین حالا خرید کنید!
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/shop"
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: {
              xs: "0.875rem",
              sm: "1rem",
            },
            backgroundColor: "#FF6B00",
            "&:hover": { backgroundColor: "#E65A00" },
            whiteSpace: "nowrap",
          }}
        >
          مشاهده محصولات
        </Button>
      </Container>
    </Box>
  );
};

export default Banner;
