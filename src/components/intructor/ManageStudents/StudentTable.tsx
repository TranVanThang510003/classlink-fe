import React from "react";
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from "antd/es/table";

type Props = {
  data: any[];
  loading: boolean;
};

const StudentTable: React.FC<Props> = ({ data, loading }) => {
  const columns: ColumnsType<any> = [
    { title: 'student Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },

    {
      title: 'Action',
      render: () => (
          <Space>
            <button className="bg-blue-500 text-white px-3 py-1">Edit</button>
            <button className="bg-red-500 text-white px-3 py-1">Delete</button>
          </Space>
      ),
    },
  ];

  return <Table rowKey="id" dataSource={data} columns={columns} loading={loading} />;
};

export default StudentTable;
