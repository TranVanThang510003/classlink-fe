// components/assigments/InstructorAssignmentTable.tsx
"use client";

import { Table, Tooltip, Tag, Dropdown } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {publishAssignment, unpublishAssignment} from "@/services/assignment/assignmentInstructorService";
import toast from "react-hot-toast";

export default function InstructorAssignmentTable({
                                                      assignments,
                                                  }: {
    assignments: any[];
}) {
    const router = useRouter();
    return (
        <Table
            pagination={false}
            dataSource={assignments}
            rowKey="id"
            columns={[
                {
                    title: "Title",
                    dataIndex: "title",
                },
                {
                    title: "Class",
                    dataIndex: "classId",
                },
                {
                    title: "Description",
                    dataIndex: "description",
                    render: (text) => (
                        <span className="text-gray-500 text-sm">
                            {text}
                        </span>
                    ),
                },
                {
                    title: "Due Date",
                    dataIndex: "dueDate",
                    render: (date) =>
                        date ? dayjs(date).format("DD/MM/YYYY") : "-",
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
                                            onClick: async (e) => {
                                                e.domEvent.stopPropagation();
                                                try {
                                                    isPublished
                                                        ? await unpublishAssignment(record.id)
                                                        : await publishAssignment(record.id);

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
                    render: (_, record) => (
                        <div className="flex gap-4 text-yellow-500 text-lg">
                            <Tooltip title="View" >
                                <EyeOutlined className="cursor-pointer"
                                    onClick={() =>
                                    router.push(
                                    `/instructor/assignments/${record.id}`
                                    )
                                } />
                            </Tooltip>
                            <Tooltip title="Edit">
                                <EditOutlined className="cursor-pointer" />
                            </Tooltip>
                        </div>
                    ),
                },
            ]}
        />
    );
}
