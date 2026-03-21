'use client';
import React from 'react';
import { Button, Form, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { signInWithCustomToken } from 'firebase/auth';
import { useVerifyOtp, useSendOtp } from '@/hooks/auth/useOtps';
import { auth } from '@/lib/firebase';

const VerifyPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") ?? "";

    const { mutateAsync: verifyOtp, isPending: verifying } = useVerifyOtp();
    const { mutateAsync: sendOtp, isPending: sending } = useSendOtp();

    const onFinish = async (values: { otp: string }) => {
        try {
            const res = await verifyOtp({ email, code: values.otp });
            if (!res.success) return toast.error(res.message || "OTP không hợp lệ");

            await signInWithCustomToken(auth, res.data.firebaseToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            toast.success("Đăng nhập thành công!");
            router.push("/chat");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi khi xác thực OTP!");
        }
    };

    const handleResendOtp = async () => {
        try {
            const res = await sendOtp({ email });
            if (res.success) toast.success(res.message || "OTP đã gửi lại!");
            else toast.error(res.message || "Không thể gửi OTP");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi khi gửi lại OTP!");
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-50 h-screen">
            <div className="bg-white rounded-3xl shadow-lg p-10 w-96">
                <Form onFinish={onFinish} layout="vertical">
                    <h2 className="text-3xl font-bold text-center mb-2">Email Verification</h2>
                    <p className="text-sm text-gray-400 text-center mb-6">
                        Please enter OTP sent to <b>{email}</b>
                    </p>
                    <Form.Item
                        name="otp"
                        label="OTP Code"
                        rules={[
                            { required: true, message: "Please input OTP!" },
                            { pattern: /^[0-9]{4,6}$/, message: "OTP must be 4–6 digits" },
                        ]}
                    >
                        <Input placeholder="Enter OTP" maxLength={6} style={{ height: 50, textAlign: "center", fontSize: 18 }} />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary" loading={verifying} className="w-full h-12 rounded-lg font-semibold">
                            Verify
                        </Button>
                        <div className="text-center mt-4 text-sm text-gray-400">Didn't receive the code?</div>
                        <div className="text-center mt-2">
              <span
                  className={`text-blue-600 cursor-pointer ${sending ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={handleResendOtp}
              >
                {sending ? "Sending..." : "Send again"}
              </span>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default VerifyPage;