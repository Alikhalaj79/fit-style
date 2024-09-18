import { Navigate, Route, Routes } from "react-router-dom";

import Homepage from "../pages/Homepage";
import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";
import PageNotFound from "../pages/404";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/users";

const Router = () => {
  
  const {data, isLoading,isFetching,error,} = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });
  console.log({data, isFetching, isLoading, error});
  
  return (
    <Routes>
      <Route index element={<Homepage data={data} />} />
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/admin"
        element={
          data && data.data.data.user.role === "admin" ? (
            <AdminPage />
          ) : (
            <Navigate to="/user" />
          )
        }
      />
      <Route
        path="/user"
        element={data ? <UserPage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;
