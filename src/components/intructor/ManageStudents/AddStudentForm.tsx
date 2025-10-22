'use client';

import { Button, Form, Input, message  } from 'antd'
import {useAddStudent} from "@/hooks/useStudents";
import type { Student } from '@/types/student';
import toast from "react-hot-toast";
const AddStudentForm = () => {
  const [form] = Form.useForm<Student>();
  const mutation = useAddStudent();
  const onFinish = (values: Student) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        toast.success(data.message||"Student added successfully!");
        form.resetFields();
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to add student');
      },
    });
  };
  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-center mb-4 text-3xl font-semibold ">Create Student</div>

      <Form
          form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ padding: '0px 20px' }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="name" label="Student Name" rules={[{ required: true },
            { min: 4, message: 'Name must be at least 4 characters' },
          ]}>
            <Input/>
          </Form.Item>

          <Form.Item name="email" label="Email Address" rules={[{ required: true },
            { type: 'email', message: 'Invalid email format' }]}>
            <Input/>
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true },
            { min: 6, message: 'Name must be at least 6 characters' }]}>
            <Input/>
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true },
            {
              pattern: /^[0-9]{9,11}$/,
              message: 'Phone must contain 9–11 digits',
            }]}>
            <Input/>
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Input/>
          </Form.Item>
        </div>

          <Form.Item>
            <div className="text-right">
              <Button type="primary" htmlType="submit" style={{fontSize:'20px', padding:'20px '}}>
                Create
              </Button>
            </div>
          </Form.Item>
      </Form>
    </div>
)
}

export default AddStudentForm;