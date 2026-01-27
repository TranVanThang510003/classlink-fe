// components/assigments/InstructorAssignmentTable.tsx
"use client";

import { Table, Tooltip, Tag } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";

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
                    render: (status) => (
                        <Tag color={status === "draft" ? "orange" : "green"}>
                            {status.toUpperCase()}
                        </Tag>
                    ),
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
                                    `/instructor/assignment/${record.id}`
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
