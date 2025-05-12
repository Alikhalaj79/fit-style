import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const PageNotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: { xs: "60vh", sm: "70vh", md: "80vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6, md: 8 },
        }}
      >
        <SentimentDissatisfiedIcon
          sx={{
            fontSize: { xs: 60, sm: 80, md: 100 },
            color: "#FF6B00",
            animation: "bounce 2s infinite",
          }}
        />
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "3rem", sm: "4rem", md: "6rem" },
            fontWeight: "bold",
            color: "#333",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            lineHeight: 1.2,
          }}
        >
          ۴۰۴
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: "#666",
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          صفحه مورد نظر یافت نشد
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#888",
            maxWidth: "500px",
            mb: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 3 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری
          منتقل شده است
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          sx={{
            borderRadius: 3,
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
            backgroundColor: "#FF6B00",
            "&:hover": {
              backgroundColor: "#E65A00",
            },
          }}
        >
          بازگشت به صفحه اصلی
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;
