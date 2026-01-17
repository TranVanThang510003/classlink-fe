"use client";

import { Button, Tag, App } from "antd";
import type { Assignment } from "@/types/assignment";
import {
    publishAssignment,
    unpublishAssignment,
    deleteAssignment,
} from "@/services/assignmentService";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function AssignmentItem({
                                           assignment,
                                       }: {
    assignment: Assignment;
}) {
    const { modal } = App.useApp();
    const isPublished = assignment.status === "published";

    const handleDelete = () => {
        modal.confirm({
            title: "Delete assignment?",
            content: (
                <div>
                    Are you sure you want to delete assignment:
                    <b className="block mt-1">{assignment.title}</b>
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
        <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div className="space-y-1">
                <div className="font-medium text-base">
                    {assignment.title}
                </div>

                <div className="flex items-center gap-2">
                    <Tag color={isPublished ? "green" : "orange"}>
                        {assignment.status}
                    </Tag>

                    {assignment.dueDate && (
                        <span className="text-xs text-gray-500">
                            Due:{" "}
                            {dayjs(assignment.dueDate).format(
                                "DD/MM/YYYY HH:mm"
                            )}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    size="small"
                    onClick={() =>
                        isPublished
                            ? unpublishAssignment(assignment.id)
                            : publishAssignment(assignment.id)
                    }
                >
                    {isPublished ? "Unpublish" : "Publish"}
                </Button>

                <Button danger size="small" onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
}
