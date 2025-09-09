import api from "../configs/api";

const getUserProfile = () => {
  return api
    .get("user/profile")
    .then((res) => res)
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      return null;
    });
};

const logOutUser = () => api.post("auth/logout").then((res) => res || false);

const updateProfile = (profileData) => {
  return api.patch("user/update-profile", profileData).then((res) => {
    return res.data;
  });
};

export { getUserProfile, logOutUser, updateProfile };
