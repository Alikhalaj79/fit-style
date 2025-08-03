import React, { useState } from "react";
import CategoryListForAdmin from "../components/templates/adminPage/adminComponents/CategoryListForAdmin";
import CategoryForm from "../components/templates/adminPage/adminComponents/CategoryForm";
import DeleteCategory from "../components/templates/adminPage/adminComponents/DeleteCategory";
import AddProductForm from "../components/templates/adminPage/adminComponents/AddProductsForm";
import ProductsView from "../components/templates/adminPage/ProductsView";
import Container from "@mui/material/Container";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { getProducts, fetchCategories } from "../services/productsApi";
import { useQuery } from "@tanstack/react-query";

const sidebarItems = [
  {
    label: "داشبورد",
    id: "dashboard",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    label: "محصولات",
    id: "products",
    icon: <Inventory2Icon fontSize="small" />,
  },
  {
    label: "افزودن محصول",
    id: "addProduct",
    icon: <AddBoxIcon fontSize="small" />,
  },
  {
    label: "دسته‌بندی‌ها",
    id: "categories",
    icon: <CategoryIcon fontSize="small" />,
  },
];

const AdminPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch products and categories for dashboard stats (always at top level)
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["dashboardProducts"],
    queryFn: getProducts,
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["dashboardCategories"],
    queryFn: fetchCategories,
  });
  // Extract counts
  const productsCount = productsData?.data?.data?.products?.length || 0;
  const categoriesCount = categoriesData?.data?.data?.categories?.length || 0;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Box p={2}>
            {/* Large welcome card with dashboard icon */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "#fff",
                borderRadius: 3,
                maxWidth: 600,
              }}
            >
              <DashboardIcon sx={{ fontSize: 48, color: "primary.main" }} />
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="primary.main"
                  mb={0.5}
                >
                  خوش آمدید!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  به داشبورد مدیریت فروشگاه خوش آمدید. از اینجا می‌توانید همه
                  بخش‌های فروشگاه را مدیریت کنید.
                </Typography>
              </Box>
            </Paper>
            {/* Quick action cards */}
            <Grid container spacing={2} sx={{ maxWidth: 900 }}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Inventory2Icon
                    sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    مدیریت محصولات
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    mb={1}
                  >
                    مشاهده، ویرایش و حذف محصولات فروشگاه
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => setActiveSection("products")}
                  >
                    برو به محصولات
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <AddBoxIcon
                    sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    افزودن محصول
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    mb={1}
                  >
                    ثبت سریع محصول جدید برای فروشگاه
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => setActiveSection("addProduct")}
                  >
                    افزودن محصول
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <CategoryIcon
                    sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    دسته‌ بندی‌ ها
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    mb={1}
                  >
                    مدیریت و ساخت دسته‌بندی‌ های جدید
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => setActiveSection("categories")}
                  >
                    مدیریت دسته‌ بندی
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            {/* TODO: Add dashboard stats and charts here */}
          </Box>
        );
      case "products":
        return <ProductsView />;
      case "addProduct":
        return <AddProductForm />;
      case "categories":
        return (
          <Box>
            <CategoryListForAdmin />
            <Divider sx={{ my: 2 }} />
            <CategoryForm />
            <Divider sx={{ my: 2 }} />
            <DeleteCategory />
          </Box>
        );
      default:
        return null;
    }
  };

  //sidebar
  const drawer = (
    <Box
      sx={{
        width: 230,
        bgcolor: "#fff",
        height: "100vh",
        p: 2,
        boxShadow: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            button
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => {
              setActiveSection(item.id);
              setMobileOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: activeSection === item.id ? "primary.main" : "#fff",
              color: activeSection === item.id ? "#fff" : "text.primary",
              "&:hover": { bgcolor: "primary.main", color: "#fff" },
              transition: "all 0.2s",
              boxShadow: activeSection === item.id ? 2 : 0,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              sx={{
                color: activeSection === item.id ? "#fff" : "primary.main",
                minWidth: 36,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ textAlign: "center", fontWeight: 700 }}
            />
          </ListItem>
        ))}
      </List>
      <Box flexGrow={1} />
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Typography
        variant="caption"
        color="divider"
        sx={{ textAlign: "center", width: "100%" }}
      >
        © {new Date().getFullYear()} FitStyle Admin
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Desktop sidebar */}
      {!isMobile && <Box sx={{ minWidth: 230 }}>{drawer}</Box>}
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 4 },
          maxWidth: "100vw",
          transition: "all 0.3s",
          background: "#F9F9F9",
          minHeight: "100vh",
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { xs: 0, md: 2 },
        }}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <Paper
            elevation={2}
            sx={{
              mb: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              position: "sticky",
              top: 0,
              zIndex: 1100,
              background: "#fff",
            }}
          >
            {/* <Typography
              variant="h6"
              sx={{ color: "primary.main", fontWeight: 900, letterSpacing: 2 }}
            >
              FIT STYLE
            </Typography> */}
            <IconButton color="primary" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Paper>
        )}
        {renderSection()}
      </Box>
      {/* Mobile menu */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 230,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminPage;
