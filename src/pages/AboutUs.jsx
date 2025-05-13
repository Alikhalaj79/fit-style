import React from "react";
import {
  Box,
  Typography,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AboutUs = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* Main Title */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            color: "#333",
          }}
        >
          درباره ما
        </Typography>

        <Divider
          sx={{
            width: 80,
            height: 4,
            backgroundColor: "#FF6B00",
            borderRadius: 2,
            mx: "auto",
          }}
        />

        {/* Brand Introduction */}
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            lineHeight: 1.8,
            maxWidth: "700px",
          }}
        >
          ما اینجا هستیم تا خرید پوشاک را ساده‌تر، لذت‌بخش‌تر و هوشمندانه‌تر
          کنیم. هدف ما ساخت یک تجربه منحصربه‌فرد در دنیای مد دیجیتال است؛ جایی
          که سبک شخصی، کیفیت و سادگی با هم ترکیب می‌شوند.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#666",
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            lineHeight: 1.8,
            maxWidth: "700px",
            mt: 2,
          }}
        >
          ما باور داریم که مد باید در خدمت شما باشد، نه برعکس. به همین دلیل،
          مجموعه‌ی ما با دقت انتخاب می‌شود تا لباس‌هایی ارائه دهیم که در عین
          زیبایی، کاربردی و راحت باشند. در هر قطعه، ردپای توجه به جزئیات، سادگی
          در طراحی و کیفیت واقعی را خواهید دید.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#666",
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            lineHeight: 1.8,
            maxWidth: "700px",
            mt: 2,
          }}
        >
          فروشگاه ما فقط یک ویترین نیست؛ یک مسیر برای کشف سبک شخصی شماست. اینجا
          جایی‌ست برای کسانی که به دنبال هویت، اصالت و انتخاب‌های آگاهانه هستند.
          با ما، مد فقط درباره‌ی ظاهر نیست—درباره‌ی حس خوبیه که از انتخاب‌هاتون
          می‌گیرین.
        </Typography>

        {/* Mission and Vision */}
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "#999",
            fontStyle: "italic",
            fontSize: "0.95rem",
            maxWidth: 650,
          }}
        >
          مأموریت ما خلق دنیایی است که در آن مد، نه فقط برای زیبایی، بلکه برای
          ابراز هویت شما باشد.
        </Typography>

        {/* Core Values */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              mt: 4,
              mb: 2,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            آنچه برای ما مهم است
          </Typography>

          <List
            sx={{
              maxWidth: 600,
              mx: "auto",
              textAlign: "right",
            }}
          >
            {[
              "لباس‌هایی که واقعاً پوشیدنی و کاربردی هستند",
              "طراحی‌های ساده، ماندگار و قابل ست",
              "توجه به جزئیات و کیفیت دوخت و پارچه",
              "احترام به انتخاب و سبک شخصی مشتری",
            ].map((value, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                  <CheckCircleIcon sx={{ color: "#FF6B00" }} />
                </ListItemIcon>
                <ListItemText
                  primary={value}
                  primaryTypographyProps={{
                    sx: {
                      color: "#555",
                      textAlign: "right",
                      //   direction: "rtl",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Our Differences */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            ما چه تفاوتی داریم؟
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: (
                  <EmojiObjectsIcon sx={{ fontSize: 40, color: "#FF6B00" }} />
                ),
                title: "سبک طراحی منحصر به‌فرد",
              },
              {
                icon: (
                  <WorkspacePremiumIcon
                    sx={{ fontSize: 40, color: "#FF6B00" }}
                  />
                ),
                title: "کیفیت واقعی، بدون ادعا",
              },
              {
                icon: <FavoriteIcon sx={{ fontSize: 40, color: "#FF6B00" }} />,
                title: "ارتباط صادقانه با مشتری",
              },
            ].map((item, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                >
                  {item.icon}
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#555", fontWeight: "medium" }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Final Call to Action */}
        <Typography
          variant="body2"
          sx={{
            mt: 6,
            maxWidth: 600,
            color: "#999",
            fontStyle: "italic",
            fontSize: "0.95rem",
          }}
        >
          از این‌که با ما همراه هستید سپاسگزاریم. اگر به استایلی ساده، باکیفیت و
          معنادار اهمیت می‌دهید، اینجا خانه‌ی شماست.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
