
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
                        title: "Attempts",
                        render: (_, record) => (
                            <span>
                              {record.attempts} / {record.maxAttempts}
                            </span>
                        ),
                    },
                    {
                        title: "Status",
                        render: (_, record) => (
                            <Tag color={record.isLocked ? "red" : "green"}>
                                {record.isLocked ? "Completed" : "Available"}
                            </Tag>
                        ),
                    },

                    {
                        title: "Score",
                        render: (_, record) => (
                            record.bestScore != null
                                ? <strong>{record.bestScore}/ 10</strong>
                                : <span className="text-gray-400">—</span>
                        ),
                    },

                    {
                        title: "Action",
                        render: (_, record) => {
                            const hasAttempted = record.attempts > 0;
                            const isLocked = record.isLocked;

                            return (
                                <div className="flex gap-3">
                                    {/* START QUIZ */}
                                    <a
                                        className={`
            ${isLocked
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-blue-600 hover:underline"}
          `}
                                        onClick={() => {
                                            if (isLocked) return;
                                            router.push(`/student/quizzes/${record.id}`);
                                        }}
                                    >
                                        Start Quiz
                                    </a>

                                    {/* VIEW RESULT */}
                                    <a
                                        className={`
                                          ${!hasAttempted
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-emerald-600 hover:underline"}
                                             `}
                                        onClick={() => {
                                            if (!hasAttempted) return;
                                            router.push(`/students/tests/${record.id}/result`);
                                        }}
                                    >
                                        View Answers
                                    </a>
                                </div>
                            );
                        },
                    }


                ]}
            />
        </div>
    );
}
