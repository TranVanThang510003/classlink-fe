'use client';

import { Table, Tag, Tooltip, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import {Timestamp} from "firebase/firestore";

type ClassItem = {
    id: string;
    name: string;
    description?: string;
    studentCount: number;
    createdAt: Timestamp|null ;
    status?: 'active' | 'archived';
};

export default function ClassListTable({
                                           classes,
                                           onDelete,
                                       }: {
    classes: ClassItem[];
    onDelete: (id: string) => void;
}) {
    const router = useRouter();

    return (
        <Table
            rowKey="id"
    dataSource={classes}
    pagination={false}
    columns={[
            {
                title: 'Class Name',
                dataIndex: 'name',
            },
    {
        title: 'Students',
            dataIndex: 'studentCount',
        render: (v) => <Tag color="blue">{v}</Tag>,
    },
        {
            title: "Description",
            dataIndex: "description",
            render: (v) => v || <Tag>None</Tag>,
        },
    {
        title: 'Created At',
            dataIndex: 'createdAt',
        render: (v) =>
        dayjs(v?.toDate?.() ?? v).format('DD/MM/YYYY'),
    },
    {
        title: 'Status',
            dataIndex: 'status',
        render: (v) =>
        v === 'archived' ? (
            <Tag color="default">Archived</Tag>
        ) : (
            <Tag color="green">Active</Tag>
        ),
    },
    {
        title: 'Action',
            render: (_, record) => (
        <div className="flex gap-4 text-lg">
        <Tooltip title="View students">
        <EyeOutlined
            className="cursor-pointer !text-yellow-500"
        onClick={() =>
        router.push(`/instructor/manage-classes/${record.id}`)
    }
        />
        </Tooltip>

        <Tooltip title="Edit class">
    <EditOutlined
        className="cursor-pointer !text-yellow-500"
        onClick={() =>
        router.push(`/instructor/manage-classes/${record.id}/edit`)
    }
        />
        </Tooltip>

        <Popconfirm
        title="Delete this class?"
        onConfirm={() => onDelete(record.id)}
    >
        <DeleteOutlined className="cursor-pointer !text-yellow-500" />
            </Popconfirm>
            </div>
    ),
    },
]}
    />
);
}
