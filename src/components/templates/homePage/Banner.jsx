import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import heroBg from "../../../assets/images/hero-bg.jpg"; 

const Banner = () => {
  return (
    <Box
      sx={{
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        position: "relative",
        px: 2,
        borderRadius: 5,
        overflow: "hidden",
        marginTop: "50px",
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

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
          }}
        >
          فروشگاهی برای بهترین‌ها
        </Typography>
        <Typography
          variant="h6"
          mb={3}
          sx={{
            textShadow: "1px 1px 6px rgba(0, 0, 0, 0.6)",
          }}
        >
          بهترین محصولات با بالاترین کیفیت و قیمت مناسب. همین حالا خرید کنید!
        </Typography>
        <Button
          variant="contained"
          // color="primary"
          size="large"
          component={Link}
          to="/shop"
          sx={{
            borderRadius: 3,
            px: 4,
            backgroundColor: "#FF6B00",
            "&:hover": { backgroundColor: "#E65A00" },
          }}
        >
          مشاهده محصولات
        </Button>
      </Container>
    </Box>
  );
};

export default Banner;
