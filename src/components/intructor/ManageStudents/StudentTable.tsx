import React from "react";
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from "antd/es/table";
interface Student {
  key: string;
  name: string;
  email: string;
  status: string;
}
const studentTable:React.FC =()=>{
  const columns: ColumnsType<Student>  = [
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },

    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_,record) => (
              <Tag color={'green'}>{record.status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <button className="bg-[#2C7BE5] px-4 py-2 rounded-sm  text-white">Edit</button>
          <button className='bg-[#EA5656] px-4 py-2 rounded-sm text-white'>Delete</button>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      email: "email@gmail.com",
      status: 'active',
    },
    {
      key: '2',
      name: 'Jim Green',
      email: "email@gmail.com",
      status: 'active',
    },
    {
      key: '3',
      name: 'Joe Black',
      email: "email@gmail.com",
      status: 'active',
    },
  ];



  return (
    <Table dataSource={data} columns={columns} />
  )
}

export default studentTable