import { Box, Typography, Grid, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        bgcolor: "#1a1a1a",
        color: "white",
        py: 6,
        px: { xs: 2, md: 4 },
        boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* ستون اول - اطلاعات تماس */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: "#FF6F00" }} // تیتر نارنجی
          >
            تماس با ما
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            📍 آدرس: تهران، ایران
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            📞 021-12345678
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            ✉️ example@email.com
          </Typography>
        </Grid>

        {/* ستون دوم - لینک‌های مهم */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: "#FF6F00" }} // تیتر نارنجی
          >
            لینک‌های مهم
          </Typography>
          {["درباره ما", "تماس با ما", "سوالات متداول", "شرایط و قوانین"].map(
            (text) => (
              <Link
                key={text}
                href="#"
                color="inherit"
                display="block"
                sx={{
                  mb: 2, // فاصله بیشتر
                  opacity: 0.8,
                  transition: "all 0.3s",
                  "&:hover": { opacity: 1, color: "#FF6F00", pl: 1 }, // هاور نارنجی
                }}
              >
                {text}
              </Link>
            )
          )}
        </Grid>

        {/* ستون سوم - شبکه‌های اجتماعی */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: "#FF6F00" }} // تیتر نارنجی
          >
            ما را دنبال کنید
          </Typography>
          <Box>
            {[
              { icon: <Instagram />, href: "#" },
              { icon: <Twitter />, href: "#" },
              { icon: <Facebook />, href: "#" },
              { icon: <LinkedIn />, href: "#" },
            ].map((social, index) => (
              <IconButton
                key={index}
                color="inherit"
                href={social.href}
                sx={{
                  m: 0.5,
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "#FF6F00", // هاور نارنجی
                    transform: "scale(1.1)",
                    transition: "all 0.3s",
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Grid>

        
      </Grid>

      {/* کپی‌رایت */}
      <Box
        sx={{
          mt: 5,
          pt: 2,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} تمامی حقوق محفوظ است.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
