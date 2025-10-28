"use client";

import React from 'react';
import { Button, Form, Input } from 'antd';
import { useSendOtp } from '@/hooks/useOtps';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
const Page: React.FC = () => {
    const router= useRouter()
    const { mutateAsync, isPending } = useSendOtp();

    // Gửi OTP khi submit form
    const onFinish = async (values: { email: string }) => {
        try {
            const data = await mutateAsync({ email: values.email });

            if (data.success || data.EC === 0) {
                toast.success(data.message || data.EM || 'Đã gửi mã OTP đến email của bạn!');
                router.push(`/verify?email=${values.email}`);

            } else {
                toast.error(data.message || data.EM || 'Gửi OTP thất bại!');
            }
        } catch (error:any) {
            toast.error(error.response?.data?.message || 'Lỗi khi gửi mã OTP. Vui lòng thử lại.');
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-50 h-screen">
            <div className="bg-white shadow-lg rounded-3xl">
                <Form
                    name="email-login"
                    style={{ padding: "20px 40px", width: "400px" }}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <div className="text-3xl font-bold text-center text-gray-800 mb-2">
                        Sign In
                    </div>
                    <div className="text-sm font-normal text-center text-gray-400 mb-6">
                        Please enter your email to sign in
                    </div>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Invalid email format!' },
                        ]}
                    >
                        <Input
                            placeholder="you@example.com"
                            style={{ height: "50px" }}
                        />
                    </Form.Item>

                    <Form.Item className="text-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            style={{
                                width: '100%',
                                backgroundColor: '#006AFF',
                                color: '#fff',
                                height: "48px",
                                fontSize: "18px",
                                padding: "0 24px",
                                borderRadius: "12px",
                                fontWeight: 600,
                            }}
                        >
                            Send OTP
                        </Button>

                        <div className="text-sm font-normal text-center text-gray-400 mb-6 mt-4">
                            We’ll send a one-time password to your email.
                        </div>

                        <div className="mt-8 text-sm text-gray-700 text-left">
                            Don’t have an account?{' '}
                            <span
                                className="text-blue-700 hover:underline cursor-pointer"
                                onClick={() => router.push('/sign-up')}
                            >
                Sign Up
              </span>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Page;
