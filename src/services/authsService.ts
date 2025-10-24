import axios from "../util/axios.custom";

export const sendOtp = async (email: string) => {
    const res = await axios.post("/api/auth/login/send-otp", { email });
    return res.data;
};

export const verifyOtp = async (email: string, code : string) => {
    const res = await axios.post("/api/auth/login/verify-otp", { email, code });
    return res.data;
};
