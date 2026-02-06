
"use client";

import {Table, Tooltip, Tag, Dropdown, Popconfirm} from "antd";
import {EyeOutlined, EditOutlined, PaperClipOutlined, DeleteOutlined} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
    deleteDocument,
    publishDocument,
    unpublishDocument,
} from "@/services/document/documentInstructorService";
import toast from "react-hot-toast";
import type { DocumentItem } from "@/types/document";

export default function InstructorDocumentTable({
                                                    documents,
                                                    onEdit,
                                                }: {
    documents: DocumentItem[];
    onEdit: (doc: DocumentItem) => void;
})
 {
    const router = useRouter();

    return (
        <Table
            pagination={false}
            dataSource={documents}
            rowKey="id"
            columns={[
                {
                    title: "Title",
                    dataIndex: "title",
                },

                {
                    title: "Description",
                    dataIndex: "description",
                    render: (text?: string) => (
                        <span className="text-gray-500 text-sm">{text || "-"}</span>
                    ),
                },
                {
                    title: "Files",
                    dataIndex: "attachments",
                    render: (attachments?: DocumentItem["attachments"]) => {
                        if (!attachments || attachments.length === 0) return "-";

                        return (
                            <div className="flex flex-col gap-1">
                                {attachments.map((file, i) => (
                                    <a
                                        key={i}
                                        href={file.fileUrl}
                                        target="_blank"
                                        className="flex items-center gap-1 text-blue-600 hover:underline"
                                    >
                                        <PaperClipOutlined />
                                        {file.fileName}
                                    </a>
                                ))}
                            </div>
                        );
                    },
                },

                {
                    title: "Status",
                    dataIndex: "status",
                    render: (status: "draft" | "published", record: DocumentItem) => {
                        const isPublished = status === "published";

                        return (
                            <Dropdown
                                trigger={["click"]}
                                menu={{
                                    items: [
                                        {
                                            key: "toggle",
                                            label: isPublished ? "Unpublish" : "Publish",
                                            onClick: async (e) => {
                                                e.domEvent.stopPropagation();
                                                try {
                                                    isPublished
                                                        ? await unpublishDocument(record.id)
                                                        : await publishDocument(record.id);

                                                    toast.success(
                                                        isPublished ? "Unpublished" : "Published"
                                                    );
                                                } catch {
                                                    toast.error("Action failed");
                                                }
                                            },
                                        },
                                    ],
                                }}
                            >
                                <Tag
                                    color={isPublished ? "green" : "orange"}
                                    className="cursor-pointer select-none"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {status.toUpperCase()}
                                </Tag>
                            </Dropdown>
                        );
                    },
                },
                {
                    title: "",
                    align: "right",
                    render: (_, record: DocumentItem) => (
                        <div className="flex gap-4 text-yellow-500 text-lg">

                            <Popconfirm
                                title="Delete document?"
                                description="This action cannot be undone"
                                okText="Delete"
                                okButtonProps={{ danger: true }}
                                onConfirm={async () => {
                                    try {
                                        await deleteDocument(record.id);
                                        toast.success("Deleted successfully");
                                    } catch {
                                        toast.error("Delete failed");
                                    }
                                }}
                            >
                                <Tooltip title="Delete">
                                    <DeleteOutlined className="cursor-pointer text-red-500" />
                                </Tooltip>
                            </Popconfirm>
                            <Tooltip title="Edit">
                                <EditOutlined
                                    className="cursor-pointer"
                                    onClick={() => onEdit(record)}
                                />
                            </Tooltip>

                        </div>
                    ),
                }

            ]}
        />
    );
}
