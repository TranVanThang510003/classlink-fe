"use client";

import { Button, Tag, App, Dropdown } from "antd";
import type { Assignment } from "@/types/assignment";
import {
    publishAssignment,
    unpublishAssignment,
    deleteAssignment,
} from "@/services/assignmentService";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
    DownloadOutlined,
    ClockCircleOutlined,
    MoreOutlined,
    FileOutlined,
} from "@ant-design/icons";

interface Props {
    assignment: Assignment;
}

export default function AssignmentItem({ assignment }: Props) {
    // 🚑 HARD GUARD – production bắt buộc
    if (!assignment) return null;

    const { modal } = App.useApp();

    // ✅ Default value – không tin backend 100%
    const status = assignment.status ?? "draft";
    const isPublished = status === "published";

    const handleDelete = () => {
        modal.confirm({
            title: "Delete assignment?",
            content: (
                <div className="space-y-1">
                    <div>This action cannot be undone.</div>
                    <b className="block text-red-600">{assignment.title}</b>
                </div>
            ),
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            async onOk() {
                try {
                    await deleteAssignment(assignment.id);
                    toast.success("Assignment deleted");
                } catch {
                    toast.error("Failed to delete assignment");
                }
            },
        });
    };

    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            {/* ===== HEADER ===== */}
            <div className="flex justify-between gap-4">
                <div className="space-y-1">
                    <div className="text-base font-semibold text-gray-800">
                        {assignment.title}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
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

                {/* ===== ACTION MENU ===== */}
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            {
                                key: "toggle",
                                label: isPublished ? "Unpublish" : "Publish",
                                onClick: async () => {
                                    try {
                                        isPublished
                                            ? await unpublishAssignment(assignment.id)
                                            : await publishAssignment(assignment.id);
                                        toast.success("Status updated");
                                    } catch {
                                        toast.error("Failed to update status");
                                    }
                                },
                            },
                            { type: "divider" },
                            {
                                key: "delete",
                                label: "Delete",
                                danger: true,
                                onClick: handleDelete,
                            },
                        ],
                    }}
                >
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
            </div>

            {/* ===== DESCRIPTION ===== */}
            {assignment.description && (
                <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {assignment.description}
                </div>
            )}

            {/* ===== ATTACHMENTS ===== */}
            {assignment.attachments?.length > 0 && (
                <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                        Attachments
                    </div>

                    <div className="space-y-2">
                        {assignment.attachments.map((file, idx) => (
                            <a
                                key={idx}
                                href={file.fileUrl.replace(
                                    "/upload/",
                                    "/upload/fl_attachment/"
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FileOutlined />
                                    <span className="max-w-[240px] truncate">
                    {file.fileName}
                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    {Math.round(file.fileSize / 1024)} KB
                                    <DownloadOutlined />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
