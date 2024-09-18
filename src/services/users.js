import api from "../configs/api";

const getUserProfile = () => api.get("user/profile").then((res) => res || false)

export { getUserProfile };
