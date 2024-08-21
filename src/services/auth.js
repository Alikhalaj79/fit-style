import api from "./api"

const sendOtp = async (mobile) => {
    try {
        const response = await api.post("auth/get-otp", {mobile});
        return {response};
    } catch (error) {
        // console.log(error);
        return {error}
    }
}

export {sendOtp}