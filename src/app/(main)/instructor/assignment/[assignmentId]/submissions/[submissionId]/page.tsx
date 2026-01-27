'use client';

import { Spin, Button, Input, InputNumber, Tag } from "antd";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useSubmissionDetail } from "@/hooks/assignment/useTeacherAssignmentSubmissions";
import { useAssignmentDetail } from "@/hooks/assignment/useAssignmentDetail";

import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SubmissionDetailPage() {
    const params = useParams();
    const router = useRouter();

    const assignmentId = params.assignmentId as string;
    const submissionId = params.submissionId as string;

    /* ===== FETCH DATA ===== */
    const { assignment, loading: assignmentLoading } =
        useAssignmentDetail(assignmentId);

    const { submission, loading: submissionLoading } =
        useSubmissionDetail(submissionId);

    /* ===== STATE ===== */
    const [score, setScore] = useState<number | null>(null);
    const [comment, setComment] = useState("");

    /* ===== PREFILL WHEN ALREADY GRADED ===== */
    useEffect(() => {
        if (submission) {
            setScore(submission.score ?? null);
            setComment(submission.teacherComment ?? "");
        }
    }, [submission]);

    if (assignmentLoading || submissionLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!assignment || !submission) {
        return (
            <div className="text-red-500 text-center">
                Data not found
            </div>
        );
    }

    /* ===== HANDLE GRADE ===== */
    const handleGrade = async () => {
        if (score === null) {
            toast.error("Please enter score");
            return;
        }

        await updateDoc(
            doc(db, "assignmentSubmissions", submissionId),
            {
                score,
                teacherComment: comment,
                gradedAt: serverTimestamp(),
            }
        );

        toast.success("Grade saved");
        router.back();
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* ================= ASSIGNMENT INFO ================= */}
            <div className="rounded border bg-gray-50 p-4">
                <h2 className="text-xl font-semibold">
                    {assignment.title}
                </h2>

                <div
                    className="prose max-w-none text-sm mt-2"
                    dangerouslySetInnerHTML={{
                        __html: assignment.description || "",
                    }}
                />

                <div className="text-sm text-gray-600 mt-2">
                    <p>
                        Created at:{" "}
                        {assignment.createdAt
                            ? dayjs(assignment.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                            )
                            : "—"}
                    </p>

                    <p>
                        Deadline:{" "}
                        {assignment.dueDate
                            ? dayjs(assignment.dueDate).format(
                                "DD/MM/YYYY HH:mm"
                            )
                            : "No deadline"}
                    </p>
                </div>
            </div>

            {/* ================= SUBMISSION INFO ================= */}
            <div className="rounded border bg-white p-4 space-y-2">
                <p>
                    <b>Student:</b> {submission.studentName}
                </p>

                <p>
                    <b>Submitted at:</b>{" "}
                    {dayjs(
                        submission.submittedAt?.toDate?.() ??
                        submission.submittedAt
                    ).format("DD/MM/YYYY HH:mm")}
                </p>

                {submission.score !== undefined && (
                    <Tag color="green">
                        Score: {submission.score}
                    </Tag>
                )}
            </div>

            {/* ================= SUBMISSION CONTENT ================= */}
            <div className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-2">Student Answer</h4>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: submission.content || "",
                    }}
                />
            </div>

            {/* ================= ATTACHMENTS ================= */}
            {submission.attachments?.length > 0 && (
                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <ul className="list-disc pl-5">
                        {submission.attachments.map((f: any) => (
                            <li key={f.publicId}>
                                <a
                                    href={f.fileUrl}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    {f.fileName}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ================= GRADING ================= */}
            <div className="rounded border bg-white p-4 space-y-4">
                <h4 className="font-semibold">
                    {submission.score !== undefined
                        ? "Update Grade"
                        : "Grade Submission"}
                </h4>
                <div className="mb-4">
                    <InputNumber
                        min={0}
                        max={10}
                        value={score}
                        onChange={(v) => setScore(v)}
                        placeholder="Score"
                    />

                </div>


                <div>
                    <Input.TextArea
                    rows={3}
                    placeholder="Teacher comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                </div>


                <div className="flex gap-2 justify-end">

                    <Button onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleGrade}>
                        Save
                    </Button>


                </div>
            </div>
        </div>
    );
}
