// hooks/useOtp.ts
import { useMutation } from '@tanstack/react-query';
import { sendOtp, verifyOtp } from '@/services/auth/OtpService';

interface OtpSendPayload {
    email: string;
}

interface OtpVerifyPayload {
    email: string;
    code: string;
}

// 📩 Gửi OTP
export const useSendOtp = () => {
    return useMutation({
        mutationFn: async ({ email }: OtpSendPayload) => {
            const res = await sendOtp(email);
            return res;
        },
    });
};

//  Xác thực OTP
export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: async ({ email, code }: OtpVerifyPayload) => {
            const res = await verifyOtp(email, code);
            return res;
        },
    });
};
