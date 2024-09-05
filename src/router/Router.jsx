import { Route, Routes } from "react-router-dom";

import Homepage from "../pages/Homepage";
import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";
import PageNotFound from "../pages/404";

const Router = () => {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;
