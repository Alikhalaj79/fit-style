import React from "react";
import coverrClothes from "../../../assets/videos/coverrClothes.mp4";
import { Box, Container, Typography } from "@mui/material";

const Video = () => {
  return (
    <Container sx={{ py: 8 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          aspectRatio: "16 / 9",
          mx: "auto",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {/* ویدئو */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={coverrClothes} type="video/mp4" />
          مرورگر شما از ویدئو پشتیبانی نمی‌کند.
        </video>

        {/* لایه مشکی نیمه شفاف + متن */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{
              color: "white",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
            }}
          >
            با فیت استایل حس واقعی استایل را تجربه کن
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Video;
