import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Button,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../../../assets/logoImage/logo.jpg";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../../services/users";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { fetchCart } from "../../../services/cartApi";
import { useState } from "react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60,
  });

  const getTotalQuantity = (cartData) => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => total + item.quantity, 0);
  };

  const totalQuantity = getTotalQuantity(cartData);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "صفحه اصلی", path: "/" },
    { text: "فروشگاه", path: "/shop" },
    { text: "دسته بندی", path: "/categories" },
    { text: "درباره ما", path: "/about-us" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box component="img" src={Logo} alt="لوگو" sx={{ height: 40, my: 2 }} />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#F9F9F9",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "black",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* logo */}
          <Link to="/">
            <Box
              component="img"
              src={Logo}
              alt="لوگو"
              sx={{
                height: { xs: 30, sm: 40 },
                cursor: "pointer",
                display: { xs: "none", sm: "block" },
              }}
            />
          </Link>

          {/* Desktop menu */}
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "center",
              color: "#333",
              display: { xs: "none", sm: "block" },
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                to={item.path}
                sx={{
                  mx: 1,
                  fontSize: { sm: "0.9rem", md: "1rem" },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* right icons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              // alignItems: "center",
            }}
          >
            {/* admin btn */}
            {profileData?.data?.data?.user?.role === "admin" && (
              <Link to="/admin">
                <SettingsApplicationsIcon
                  sx={{
                    fontSize: { xs: 20, sm: 24 },
                    color: "#FF6B00",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#E65A00",
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Link>
            )}

            {/* login/user btn */}
            {profileData ? (
              <Link to="/user">
                <PersonOutlineIcon
                  sx={{
                    color: "black",
                    fontSize: { xs: 20, sm: 24 },
                  }}
                />
              </Link>
            ) : (
              <Link
                to="/login"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FF6B00",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#E65A00" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  }}
                >
                  ورود
                </Button>
              </Link>
            )}

            {/* favorite icon */}
            <Link to="/favorite">
              <FavoriteBorderIcon
                sx={{
                  color: "black",
                  fontSize: { xs: 20, sm: 24 },
                }}
              />
            </Link>

            {/* cart icon with badge */}
            <Link to="/cart">
              <Badge
                badgeContent={totalQuantity > 0 ? totalQuantity : null}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#FF6B00",
                    paddingTop: "2px",
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  },
                }}
                overlap="circular"
              >
                <ShoppingBagOutlinedIcon
                  sx={{
                    color: "black",
                    fontSize: { xs: 20, sm: 24 },
                  }}
                />
              </Badge>
            </Link>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            direction: "rtl",
            transition: "all 0.3s ease-in-out",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            right: 0,
          },
          "& .MuiBackdrop-root": {
            transition: "opacity 0.3s ease-in-out",
          },
        }}
      >
        <Box
          onClick={handleDrawerToggle}
          sx={{
            textAlign: "center",
            direction: "rtl",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: "black",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={Logo}
              alt="لوگو"
              sx={{
                height: 40,
                display: { xs: "block", sm: "none" },
              }}
            />
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  textAlign: "right",
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 0, 0.1)",
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
