"use client";

import { Button, Tag, App, Dropdown } from "antd";
import type { Assignment } from "@/types/assignment";
import {
    publishAssignment,
    unpublishAssignment,
    deleteAssignment,
} from "@/services/student/assignmentService";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
    DownloadOutlined,
    ClockCircleOutlined,
    MoreOutlined,
    FileOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface Props {
    assignment: Assignment;
}

export default function AssignmentItem({ assignment }: Props) {
    if (!assignment) return null;

    const router = useRouter();
    const { modal } = App.useApp();

    const status = assignment.status ?? "draft";
    const isPublished = status === "published";

    const handleDelete = () => {
        modal.confirm({
            title: "Delete assignment?",
            content: (
                <div>
                    This action cannot be undone.
                    <b className="block text-red-600">{assignment.title}</b>
                </div>
            ),
            okType: "danger",
            async onOk() {
                await deleteAssignment(assignment.id);
                toast.success("Deleted");
            },
        });
    };

    return (
        <div
            onClick={() => router.push(`/assignments/${assignment.id}`)}
            className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm hover:shadow-md"
        >
            {/* HEADER */}
            <div className="flex justify-between">
                <div>
                    <div className="font-semibold">{assignment.title}</div>

                    <div className="flex gap-3 text-sm text-gray-500 mt-1">
                        <Tag color={isPublished ? "green" : "orange"}>
                            {status.toUpperCase()}
                        </Tag>

                        {assignment.dueDate && (
                            <span className="flex items-center gap-1">
                                <ClockCircleOutlined />
                                {dayjs(assignment.dueDate).format("DD/MM/YYYY HH:mm")}
                            </span>
                        )}
                    </div>
                </div>

                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            {
                                key: "toggle",
                                label: isPublished ? "Unpublish" : "Publish",
                                onClick: async (e) => {
                                    e.domEvent.stopPropagation();
                                    isPublished
                                        ? await unpublishAssignment(assignment.id)
                                        : await publishAssignment(assignment.id);
                                },
                            },
                            { type: "divider" },
                            {
                                key: "delete",
                                label: "Delete",
                                danger: true,
                                onClick: (e) => {
                                    e.domEvent.stopPropagation();
                                    handleDelete();
                                },
                            },
                        ],
                    }}
                >
                    <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
            </div>

            {/* DESCRIPTION (CLAMP) */}
            {assignment.description && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                    {assignment.description}
                </p>
            )}

            {/* ATTACHMENTS */}
            {assignment.attachments?.length > 0 && (
                <div className="mt-3 flex gap-2 text-xs text-gray-500">
                    <FileOutlined />
                    {assignment.attachments.length} attachment(s)
                </div>
            )}
        </div>
    );
}
