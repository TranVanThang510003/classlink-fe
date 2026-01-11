'use client';

import { Button, Form, Input } from 'antd';
import { useAddStudent } from "@/hooks/useStudents";
import type { Student } from '@/types/student';
import toast from "react-hot-toast";

type Props = {
  classId?: string;
};

const AddStudentForm = ({ classId }: Props) => {
  const [form] = Form.useForm<Student>();
  const mutation = useAddStudent();

  const onFinish = (values: Student) => {
    if (!classId) {
      toast.error("Please select class first");
      return;
    }

    const payload: Student = {
      ...values,
      classId,          // ✅ gắn class
      role: "student",  // ✅ fix cứng
      status: "active", // ✅ default
    };

    mutation.mutate(payload, {
      onSuccess: (data: any) => {
        toast.success(data?.message || "Student added successfully!");
        form.resetFields();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to add student");
      },
    });
  };

  return (
      <div className="flex flex-col">
        <div className="flex w-full justify-center mb-4 text-3xl font-semibold">
          Create Student
        </div>

        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ padding: '0 20px' }}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* NAME */}
            <Form.Item
                name="name"
                label="Student Name"
                rules={[
                  { required: true, message: "Please enter student name" },
                  { min: 4, message: "Name must be at least 4 characters" },
                ]}
            >
              <Input />
            </Form.Item>

            {/* EMAIL */}
            <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
            >
              <Input />
            </Form.Item>

            {/* ADDRESS */}
            <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter address" },
                  { min: 6, message: "Address must be at least 6 characters" },
                ]}
            >
              <Input />
            </Form.Item>

            {/* PHONE */}
            <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^[0-9]{9,11}$/,
                    message: "Phone must contain 9–11 digits",
                  },
                ]}
            >
              <Input />
            </Form.Item>

            {/* ROLE – READ ONLY */}
            <Form.Item label="Role">
              <Input
                  value="student"
                  readOnly
                  style={{ backgroundColor: "#f0f2f5" }}
              />
            </Form.Item>
          </div>

          {/* SUBMIT */}
          <Form.Item className="mt-6">
            <div className="text-right">
              <Button
                  type="primary"
                  htmlType="submit"
                  style={{ fontSize: 18, padding: "10px 32px" }}
                  loading={mutation.isPending}
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
  );
};

export default AddStudentForm;
