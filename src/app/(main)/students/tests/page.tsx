
'use client';

import {Table, Tag, Spin, Space, Tooltip, Button} from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { useClassContext } from "@/contexts/ClassContext";
import { useQuizzes } from "@/hooks/quiz/useQuizzes";
import backgroundColor from "@tiptap/extension-text-style/src/background-color";

export default function StudentQuizListPage() {
    const router = useRouter();
    const { activeClassId } = useClassContext();

    const { quizzes, loading } = useQuizzes(activeClassId ?? "", true);
    const getStudentStatus = (quiz: StudentQuiz) => {
        if (quiz.isNotOpenYet) return "not_open";
        if (quiz.isClosed) return "closed";
        if (quiz.attempts >= quiz.maxAttempts) return "completed";
        return "available";
    };

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
                        title: "Open At",
                        dataIndex: "openAt",
                        render: (v) =>
                            dayjs(v?.toDate?.()).format("HH:mm DD/MM/YYYY "),
                    },
                    {
                        title: "close At",
                        dataIndex: "closeAt",
                        render: (v) =>
                            dayjs(v?.toDate?.()).format("HH:mm DD/MM/YYYY "),
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
                        render: (_, record) => {
                            const status = getStudentStatus(record);

                            switch (status) {
                                case "not_open":
                                    return <Tag color="blue">Not Open Yet</Tag>;

                                case "closed":
                                    return <Tag color="red">Closed</Tag>;

                                case "completed":
                                    return <Tag color="volcano">Completed</Tag>;

                                case "available":
                                default:
                                    return <Tag color="green">Available</Tag>;
                            }
                        },
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
                            const status = getStudentStatus(record);
                            const canStart = status === "available";
                            const canView = record.attempts > 0;

                            return (
                                <Space>
                                    {/* START QUIZ */}
                                    <Tooltip title={!canStart ? "Quiz is not available" : "Start quiz"}>
                                        <Button
                                            type="primary"
                                            size="small"
                                            disabled={!canStart}
                                            onClick={() =>
                                                router.push(`/students/tests/${record.id}`)
                                            }
                                        >
                                            Start Quiz
                                        </Button>
                                    </Tooltip>

                                    {/* VIEW ANSWERS */}
                                    <Tooltip title={!canView ? "No submission yet" : "View your answers"}>
                                        <Button
                                            size="small"
                                            type="default"
                                            style={{ backgroundColor: "green",
                                                color:"white"
                                           }}
                                            disabled={!canView}
                                            onClick={() =>
                                                router.push(`/students/tests/${record.id}/result`)
                                            }
                                        >
                                            View Answers
                                        </Button>
                                    </Tooltip>
                                </Space>
                            );
                        },
                    }


                ]}
            />
        </div>
    );
}
