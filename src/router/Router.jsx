import { Navigate, Route, Routes } from "react-router-dom";

import Homepage from "../pages/Homepage";
import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";
import PageNotFound from "../pages/404";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/users";

const Router = () => {
  
  const {data, isLoading,isFetching,isPending,error,} = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });
  console.log({data, isFetching, isLoading, error});
  
  if (isLoading) return <h3>Loading...</h3>
  
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/login" element={data? <Navigate to="/user" />:<AuthPage />} />
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
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;
