import api from "../configs/api";

const getUserProfile = () =>
  api
    .get("user/profile")
    .then((res) => res)
    .catch(() => null);

const logOutUser = () => api.post("auth/logout").then((res) => res || false);

export { getUserProfile, logOutUser };
