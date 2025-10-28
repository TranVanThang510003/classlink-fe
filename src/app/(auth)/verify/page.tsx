"use client";

import React from "react";
import { Button, Form, Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useVerifyOtp, useSendOtp } from "@/hooks/useOtps";

const VerifyPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const { mutateAsync: verifyOtp, isPending: verifying } = useVerifyOtp();
    const { mutateAsync: sendOtp, isPending: sending } = useSendOtp();

    // ✅ Xử lý xác thực OTP
    const onFinish = async (values: { otp: string }) => {
        try {
            const data = await verifyOtp({ email, code: values.otp });
            console.log(data);
            if (data.success ) {
                const token = data.data.accessToken
                const user = data.data.user;
                localStorage.setItem("access_token", token);
                localStorage.setItem("user", JSON.stringify(user));
                toast.success(data.message || "Xác thực OTP thành công!");
                // router.push("/chat");
            } else {
                toast.error(data.message ||  "Mã OTP không hợp lệ hoặc đã hết hạn!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi xác thực OTP!");
        }
    };

    // ✅ Gửi lại OTP
    const handleResendOtp = async () => {
        try {
            const res = await sendOtp({ email });
            if (res.success || res.EC === 0) {
                toast.success(res.message || res.EM || "OTP đã được gửi lại!");
            } else {
                toast.error(res.message || res.EM || "Không thể gửi lại OTP. Vui lòng thử lại!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi gửi lại OTP!");
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-50 h-screen">
            <div className="bg-white backdrop-blur-sm rounded-3xl shadow-lg">
                <Form
                    name="verify-otp"
                    style={{ padding: "20px 40px", width: "400px" }}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <div className="text-3xl font-bold text-center text-gray-800 mb-2">
                        Email Verification
                    </div>
                    <div className="text-sm font-normal text-center text-gray-400 mb-6">
                        Please enter the OTP sent to <b>{email}</b>
                    </div>

                    <Form.Item
                        label="OTP Code"
                        name="otp"
                        rules={[
                            { required: true, message: "Please input your OTP code!" },
                            { pattern: /^[0-9]{4,6}$/, message: "OTP must be 4–6 digits!" },
                        ]}
                    >
                        <Input
                            placeholder="Enter your OTP"
                            style={{ height: "50px", textAlign: "center", fontSize: "18px" }}
                            maxLength={6}
                        />
                    </Form.Item>

                    <Form.Item className="text-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={verifying}
                            style={{
                                width: "100%",
                                backgroundColor: "#006AFF",
                                color: "#fff",
                                height: "48px",
                                fontSize: "18px",
                                padding: "0 24px",
                                borderRadius: "12px",
                                fontWeight: 600,
                            }}
                        >
                            Verify
                        </Button>

                        <div className="text-sm font-normal text-center text-gray-400 mb-6 mt-4">
                            Didn’t receive the code?
                        </div>

                        <div className="mt-8 text-sm text-gray-700 text-center">
              <span
                  className={`text-blue-700 hover:underline cursor-pointer ${
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
