import api from "../configs/api";

const sendOtp = async (mobile) => {
  try {
    const response = await api.post("auth/get-otp", { mobile });
    return { response };
  } catch (error) {
    // console.log(error);
    return { error };
  }
};

const checkOtp = async (mobile, code) => {
  try {
    const response = await api.post("auth/check-otp", { mobile, code });
    // Reset logout state on successful login
    api.login();
    return { response };
  } catch (error) {
    // console.log(error);
    return { error };
  }
};

const logout = async () => {
  try {
    await api.logout();
    return { success: true };
  } catch (error) {
    return { error };
  }
};

export { sendOtp, checkOtp, logout };
