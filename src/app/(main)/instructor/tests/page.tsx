'use client';

import { Button, Table, Tag, Spin } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { useAuthContext } from "@/contexts/AuthContext";
import { useClassContext } from "@/contexts/ClassContext";
import { useQuizzes } from "@/hooks/quiz/useQuizzes";

export default function InstructorQuizListPage() {
    const router = useRouter();
    const { uid } = useAuthContext();
    const { activeClassId } = useClassContext();

    const { quizzes, loading } = useQuizzes(activeClassId ?? "");

    if (!activeClassId) {
        return (
            <div className="text-gray-400 italic">
                Please select a class to manage quizzes
            </div>
        );
    }

    if (loading) {
        return <Spin />;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Quizzes</h2>

                <Button
                    type="primary"
                    onClick={() => router.push("/instructor/tests/create")}
                >
                    + Create Quiz
                </Button>
            </div>

            {/* TABLE */}
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
                        render: (v) =>
                            v === "published" ? (
                                <Tag color="green">Published</Tag>
                            ) : (
                                <Tag color="default">Draft</Tag>
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
                            <Button
                                size="small"
                                onClick={() =>
                                    router.push(`/instructor/quizzes/${record.id}`)
                                }
                            >
                                Manage
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    );
}
