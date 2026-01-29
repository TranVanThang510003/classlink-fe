// ================================
// COMPONENT: components/assignments/AssignmentSubmissionList.tsx
// ================================
'use client';

import {Table, Button, Tag, Tooltip} from 'antd';
import dayjs from 'dayjs';
import type { TeacherSubmissionListItem } from '@/types/assignment';
import {useParams, useRouter} from "next/navigation";
import {EditOutlined, EyeOutlined} from "@ant-design/icons";

export default function AssignmentSubmissionList({
                                                     submissions,
                                                 }: {
    submissions: TeacherSubmissionListItem[];
}) {
    const router = useRouter();
    const params = useParams();


    return (
        <Table
            rowKey="id"
            dataSource={submissions}
            pagination={false}
            columns={[
                {
                    title: 'Student',
                    dataIndex: 'studentName',
                },
                {
                    title: 'Submitted At',
                    dataIndex: 'submittedAt',
                    render: (v) => dayjs(v?.toDate?.() ?? v).format('DD/MM/YYYY HH:mm'),
                },
                {
                    title: 'Status',
                    render: (_, record) => {
                        const isLate =
                            record.dueDate &&
                            dayjs(record.submittedAt ?? record.submittedAt)
                                .isAfter(dayjs(record.dueDate));

                        return isLate ? (
                            <Tag color="red">Late</Tag>
                        ) : (
                            <Tag color="green">On time</Tag>
                        );
                    },
                },

                {
                    title: 'Score',
                    dataIndex: 'score',
                    render: (v) => (v !== undefined ? <Tag color="green">{v}</Tag> : <Tag>Not graded</Tag>),
                },
                {
                    title: "Action",
                    render: (_, record) => {

                        return (
                            <div className="flex gap-4 text-yellow-500 text-lg">
                                <Tooltip title="View">
                                    <EyeOutlined className="cursor-pointer"
                                                 onClick={() =>
                                                     router.push(
                                                         `/instructor/assignments/${params.assignmentId}/submissions/${record.id}`
                                                     )
                                                 }/>
                                </Tooltip>

                            </div>
                        );
                    },
                }

            ]}
        />
    );
}
