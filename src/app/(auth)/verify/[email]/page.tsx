"use client";

import React from "react";
import { Button, Form, Input } from "antd";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { signInWithCustomToken } from "firebase/auth";

import { useVerifyOtp, useSendOtp } from "@/hooks/auth/useOtps";
import { auth } from "@/lib/firebase";

const VerifyPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const email = decodeURIComponent(params?.email as string);

    const { mutateAsync: verifyOtp, isPending: verifying } = useVerifyOtp();
    const { mutateAsync: sendOtp, isPending: sending } = useSendOtp();


    const onFinish = async (values: { otp: string }) => {
        try {
            console.log("hah",{ email, code: values.otp });
            const res = await verifyOtp({
                email,
                code: values.otp,
            });

            if (!res.success) {
                toast.error(res.message || "OTP không hợp lệ");
                return;
            }

            const { firebaseToken, user } = res.data;

            //  Đăng nhập Firebase bằng Custom Token
            await signInWithCustomToken(auth, firebaseToken);

            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Đăng nhập thành công!");
            router.push("/chat");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Lỗi khi xác thực OTP!"
            );
        }
    };


    const handleResendOtp = async () => {
        try {
            const res = await sendOtp({ email });

            if (res.success) {
                toast.success(res.message || "OTP đã được gửi lại!");
            } else {
                toast.error(res.message || "Không thể gửi OTP");
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Lỗi khi gửi lại OTP!"
            );
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-50 h-screen">
            <div className="bg-white rounded-3xl shadow-lg">
                <Form
                    name="verify-otp"
                    style={{ padding: "20px 40px", width: 400 }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <div className="text-3xl font-bold text-center mb-2">
                        Email Verification
                    </div>

                    <div className="text-sm text-center text-gray-400 mb-6">
                        Please enter the OTP sent to <b>{email}</b>
                    </div>

                    <Form.Item
                        label="OTP Code"
                        name="otp"
                        rules={[
                            { required: true, message: "Please input OTP!" },
                            { pattern: /^[0-9]{4,6}$/, message: "OTP must be 4–6 digits" },
                        ]}
                    >
                        <Input
                            placeholder="Enter OTP"
                            maxLength={6}
                            style={{
                                height: 50,
                                textAlign: "center",
                                fontSize: 18,
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={verifying}
                            style={{
                                width: "100%",
                                height: 48,
                                fontSize: 18,
                                borderRadius: 12,
                                fontWeight: 600,
                            }}
                        >
                            Verify
                        </Button>

                        <div className="text-sm text-center text-gray-400 mt-4">
                            Didn’t receive the code?
                        </div>

                        <div className="mt-2 text-center">
              <span
                  className={`text-blue-600 cursor-pointer hover:underline ${
                      sending ? "opacity-50 pointer-events-none" : ""
                  }`}
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
