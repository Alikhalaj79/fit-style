import { Navigate, Route, Routes } from "react-router-dom";

import Homepage from "../pages/Homepage";
import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";
import PageNotFound from "../pages/404";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/users";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Favorite from "../pages/Favorite";
import ProductDetails from "../pages/ProductDetails";
import AboutUs from "../pages/AboutUs";
import ProductsByCategoryPage from "../pages/ProductsByCategoryPage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Router = () => {
  const { data, isLoading, isFetching, isPending, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  console.log({ data, isFetching, isLoading, error });

  // Show loading only if it's the first load and we're fetching
  if (isLoading && isFetching)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} thickness={2} color="primary" />
      </Box>
    );
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route
        path="/login"
        element={data ? <Navigate to="/user" /> : <AuthPage />}
      />
      <Route
        path="/admin"
        element={
          data && data?.data?.data?.user.role === "admin" ? (
            <AdminPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/user"
        element={data ? <UserPage /> : <Navigate to="/login" />}
      />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route
        path="/category/:categorySlug"
        element={<ProductsByCategoryPage />}
      />
    </Routes>
  );
};

export default Router;
