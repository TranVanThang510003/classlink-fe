
'use client';

import { Table, Tag, Spin } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { useClassContext } from "@/contexts/ClassContext";
import { useQuizzes } from "@/hooks/quiz/useQuizzes";

export default function StudentQuizListPage() {
    const router = useRouter();
    const { activeClassId } = useClassContext();

    const { quizzes, loading } = useQuizzes(activeClassId ?? "", true);

    if (!activeClassId) {
        return (
            <div className="text-gray-400 italic">
                Please select a class to see quizzes
            </div>
        );
    }

    if (loading) {
        return <Spin />;
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold">Quizzes</h2>

            <Table
                rowKey="id"
                dataSource={quizzes}
                pagination={false}
                columns={[
                    {
                        title: "Title",
                        dataIndex: "title",
                        render: (v) => <strong>{v}</strong>,
                    },
                    {
                        title: "Status",
                        dataIndex: "status",
                        render: () => (
                            <Tag color="green">Published</Tag>
                        ),
                    },
                    {
                        title: "Created At",
                        dataIndex: "createdAt",
                        render: (v) =>
                            dayjs(v?.toDate?.()).format("DD/MM/YYYY"),
                    },
                    {
                        title: "Action",
                        render: (_, record) => (
                            <a
                                className="text-blue-600 hover:underline"
                                onClick={() =>
                                    router.push(`/students/tests/${record.id}`)
                                }
                            >
                                Start Quiz
                            </a>
                        ),
                    },
                ]}
            />
        </div>
    );
}
