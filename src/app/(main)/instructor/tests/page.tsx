'use client';

import {Button, Table, Tag, Spin, Dropdown, Tooltip} from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Popconfirm, Space } from "antd";
import toast from "react-hot-toast";
import { updateQuiz, deleteQuiz } from "@/services/quiz/quizService";

import { useAuthContext } from "@/contexts/AuthContext";
import { useClassContext } from "@/contexts/ClassContext";
import { useInstructorQuizzes } from "@/hooks/quiz/useInstructorQuizzes";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";

export default function InstructorQuizListPage() {
    const router = useRouter();
    const { uid } = useAuthContext();
    const { activeClassId } = useClassContext();

    const { quizzes,setQuizzes, loading } = useInstructorQuizzes(activeClassId ?? "");

    if (!activeClassId) {
        return (
            <div className="text-gray-400 italic">
                Please select a class to manage quizzes
            </div>
        );
    }


    const handleDelete = async (id: string) => {
        // 1️⃣ lưu lại state cũ để rollback
        const prev = quizzes;

        // 2️⃣ update UI ngay
        setQuizzes(prev => prev.filter(q => q.id !== id));

        try {
            // 3️⃣ delete Firestore
            await deleteQuiz(id);
            toast.success("Quiz deleted");
        } catch (err) {
            toast.error("Failed to delete quiz");

            // 4️⃣ rollback UI nếu lỗi
            setQuizzes(prev);
        }
    };

    const handleToggleStatus = async (
        quizId: string,
        currentStatus: "draft" | "published"
    ) => {
        const nextStatus = currentStatus === "published" ? "draft" : "published";

        // 1️⃣ optimistic UI
        setQuizzes(prev =>
            prev.map(q =>
                q.id === quizId ? { ...q, status: nextStatus } : q
            )
        );

        try {
            // 2️⃣ update Firestore
            await updateQuiz(quizId, { status: nextStatus });

            toast.success(
                nextStatus === "published"
                    ? "Quiz published"
                    : "Quiz unpublished"
            );
        } catch {
            toast.error("Action failed");

            // 3️⃣ rollback
            setQuizzes(prev =>
                prev.map(q =>
                    q.id === quizId ? { ...q, status: currentStatus } : q
                )
            );
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
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
                        title: "Created At",
                        dataIndex: "createdAt",
                        render: (v) =>
                            dayjs(v?.toDate?.()).format("DD/MM/YYYY"),
                    },
                    {
                        title: "Open At",
                        dataIndex: "openAt",
                        render: (v) =>
                            dayjs(v?.toDate?.()).format("HH:mm DD/MM/YYYY"),
                    },
                    {
                        title: "Close At",
                        dataIndex: "closeAt",
                        render: (v) =>
                            dayjs(v?.toDate?.()).format("HH:mm DD/MM/YYYY"),
                    },
                    {
                        title: "Status",
                        dataIndex: "status",
                        render: (status, record) => {
                            const isPublished = status === "published";

                            return (
                                <Dropdown
                                    trigger={["click"]}
                                    menu={{
                                        items: [
                                            {
                                                key: "toggle",
                                                label: isPublished ? "Unpublish" : "Publish",
                                                onClick: ({ domEvent }) => {
                                                    domEvent.stopPropagation();
                                                    handleToggleStatus(record.id, status);
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    <Popconfirm
                                        title={isPublished ? "Unpublish this quiz?" : "Publish this quiz?"}
                                        description={
                                            isPublished
                                                ? "Students will no longer see this quiz"
                                                : "This quiz will be visible to students"
                                        }
                                        okText={isPublished ? "Unpublish" : "Publish"}
                                        cancelText="Cancel"
                                        onConfirm={() => handleToggleStatus(record.id, status)}
                                    >
                                        <Tag
                                            color={isPublished ? "green" : "orange"}
                                            className="cursor-pointer select-none"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {status.toUpperCase()}
                                        </Tag>
                                    </Popconfirm>

                                </Dropdown>
                            );
                        },
                    },

                    {
                        title: "Action",
                        render: (_, record) => (
                            <Space>
                                <Tooltip title="View submissions">
                                    <EyeOutlined className="cursor-pointer !text-yellow-500 text-xl"
                                                 onClick={()=> router.push(`/instructor/tests/${record.id}/submissions`)}/>
                                </Tooltip>
                                <Tooltip title="Edit quiz">
                                    <EditOutlined className="cursor-pointer !text-yellow-500 text-xl"
                                                onClick={() => router.push(`/instructor/tests/${record.id}`)} />
                                </Tooltip>
                                <Popconfirm
                                    title="Delete quiz?"
                                    description="This action cannot be undone"
                                    onConfirm={() => handleDelete(record.id)}
                                >
                                    <DeleteOutlined className="cursor-pointer !text-yellow-500 text-xl"/>
                                </Popconfirm>

                            </Space>
                        ),
                    },


                ]}
            />
        </div>
    );
}
