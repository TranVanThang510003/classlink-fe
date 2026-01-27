// ================================
// COMPONENT: components/assignments/AssignmentSubmissionList.tsx
// ================================
'use client';

import { Table, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import type { TeacherSubmissionListItem } from '@/types/assignment';
import {useParams, useRouter} from "next/navigation";

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
                    title: 'Score',
                    dataIndex: 'score',
                    render: (v) => (v !== undefined ? <Tag color="green">{v}</Tag> : <Tag>Not graded</Tag>),
                },
                {
                    title: "Action",
                    render: (_, record) => {

                        return (
                            <Button
                                type="link"
                                onClick={() =>
                                    router.push(
                                        `/instructor/assignment/${params.assignmentId}/submissions/${record.id}`
                                    )
                                }
                            >
                                View
                            </Button>
                        );
                    },
                }

            ]}
        />
    );
}
