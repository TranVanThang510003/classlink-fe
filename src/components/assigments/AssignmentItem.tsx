"use client";

import { Tag } from "antd";
import dayjs from "dayjs";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    UploadOutlined,
    EditOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { StudentAssignment } from "@/types/assignment";

interface Props {
    assignment: StudentAssignment;
}

export default function AssignmentItem({ assignment }: Props) {
    const router = useRouter();

    const submission = assignment.submission;
    const isSubmitted = !!submission?.submittedAt;
    const isGraded = submission?.score !== undefined;
    const isOverdue =
        assignment.dueDate &&
        dayjs().isAfter(dayjs(assignment.dueDate)) &&
        !isSubmitted;
    const isLateSubmission =
        assignment.dueDate &&
        submission?.submittedAt &&
        dayjs(submission.submittedAt).isAfter(dayjs(assignment.dueDate));
    console.log("dueDate", assignment.dueDate);
    console.log("submittedAt", submission?.submittedAt);
    console.log(
        "isLate?",
        dayjs(submission?.submittedAt).isAfter(dayjs(assignment.dueDate))
    );

    return (
        <div
            onClick={() => router.push(`/assignments/${assignment.id}`)}
            className="
        flex justify-between
        rounded-lg border border-gray-200 bg-white px-5 py-4
        hover:border-blue-400 hover:shadow-sm
        cursor-pointer
      "
        >
            <div className="space-y-1">
                <h3 className="font-medium text-gray-900">
                    {assignment.title}
                </h3>

                {assignment.dueDate && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <ClockCircleOutlined/>
                        Due {dayjs(assignment.dueDate).format("DD/MM/YYYY HH:mm")}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                    {/* Chưa nộp */}
                    {!isSubmitted && !isOverdue && (
                        <Tag icon={<EditOutlined/>}>Not submitted</Tag>
                    )}

                    {/* Quá hạn nhưng chưa nộp */}
                    {isOverdue && (
                        <Tag color="red">Overdue</Tag>
                    )}

                    {/* Đã nộp nhưng trễ */}
                    {isLateSubmission  && (
                        <Tag icon={<UploadOutlined/>} color="warning">
                            Submitted late
                        </Tag>
                    )}

                    {/* Đã nộp đúng hạn */}
                    {isSubmitted && !isLateSubmission  && (
                        <Tag icon={<UploadOutlined/>} color="processing">
                            Submitted
                        </Tag>
                    )}

                    {/* Đã chấm điểm */}
                    {isGraded && (
                        <Tag icon={<CheckCircleOutlined/>} color="success">
                            Score: {submission.score} / 10
                        </Tag>
                    )}

                    {/* Giáo viên nhận xét */}
                    {submission?.teacherComment && (
                        <Tag icon={<MessageOutlined/>} color="blue">
                            Teacher commented
                        </Tag>
                    )}
                </div>

            </div>
        </div>
    );
}
