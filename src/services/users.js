import api from "../configs/api";

import { getCookie } from "../utils/cookie";
const refreshToken = getCookie()

const getUserProfile = () => api.get("user/profile" ,{headers: {Authorization: `bearer ${refreshToken}`}});

export {getUserProfile}

