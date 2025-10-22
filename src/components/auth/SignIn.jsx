import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { useNavigate } from "react-router-dom";


const SignIn = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { phone } = values;
    navigate('/Sign-in/verify')
  }
  return (
    <div className="flex justify-center items-center bg-gray-50 h-screen  ">
      <div className="bg-white backdrop-blur-sm rounded-3xl">
        <Form
          name="basic"
          style={{ padding: "20px 40px", width: "400px" }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div className="text-3xl font-bold text-center text-gray-800 mb-2">Sign In</div>
          <div className="text-sm font-normal text-center text-gray-400 mb-6">Please enter your phone to sign in</div>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone!' },
              { pattern: /^[0-9]{10}$/, message: 'Invalid phone number format!' }
            ]}
          >
            <Input style={{"height": "50px"}} placeholder="Phone Number" />
          </Form.Item>


          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
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
              Next
            </Button>
            <div className="text-sm font-normal text-center text-gray-400 mb-6 mt-4">passwordless authentication methods.</div>
            <div className="mt-8 text-sm text-gray-700 text-left">
              Don't having account?{' '}
              <span
                className="text-blue-700 hover:underline cursor-pointer"
                onClick={() => navigate('/Sign-in')}
              >
            Sign Up
            </span>
            </div>


          </Form.Item>
        </Form>
      </div>
    </div>
  )
};

export default SignIn;
