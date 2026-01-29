'use client';

import { Spin, Button, Input, InputNumber, Tag, Avatar } from "antd";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useSubmissionDetail } from "@/hooks/assignment/useInstructorAssignmentSubmissions";
import { useAssignmentDetail } from "@/hooks/assignment/useAssignmentDetail";

import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SubmissionDetailPage() {
    const params = useParams();
    const router = useRouter();

    const assignmentId = params.assignmentId as string;
    const submissionId = params.submissionId as string;

    const { assignment, loading: assignmentLoading } =
        useAssignmentDetail(assignmentId);

    const { submission, loading: submissionLoading } =
        useSubmissionDetail(submissionId);

    const [score, setScore] = useState<number | null>(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (submission) {
            setScore(submission.score ?? null);
            setComment(submission.teacherComment ?? "");
        }
    }, [submission]);

    if (assignmentLoading || submissionLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center ">
                <Spin size="large" />
            </div>
        );
    }

    if (!assignment || !submission) {
        return (
            <div className="text-center text-red-500">
                Data not found
            </div>
        );
    }

    const isLate =
        assignment.dueDate &&
        submission.submittedAt &&
        dayjs(submission.submittedAt.toDate?.() ?? submission.submittedAt).isAfter(
            dayjs(assignment.dueDate)
        );

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
        <div className="min-h-screen  p-8">
            {/* ===== HEADER ===== */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold  ">
                    Submission Review
                </h1>
                <div >
                    <Button className="hover:!border-none  hover:!bg-yellow-500 hover:!text-white" onClick={() => router.back()}>Back</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ================= LEFT CONTENT ================= */}
                <div className="lg:col-span-2 space-y-6 ">
                    {/* ===== STUDENT INFO CARD ===== */}
                    <div className="bg-white rounded-xl shadow-sm border-1 border-yellow-300 p-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={48}
                                className="bg-yellow-400 text-black font-semibold"
                            >
                                {submission.studentName?.[0]?.toUpperCase()}
                            </Avatar>

                            <div>
                                <p className="font-semibold text-lg">
                                    {submission.studentName}
                                </p>
                                {submission.studentEmail && (
                                    <p className="text-sm text-gray-500">
                                        {submission.studentEmail}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    Submitted at{" "}
                                    {dayjs(
                                        submission.submittedAt?.toDate?.() ??
                                        submission.submittedAt
                                    ).format("DD/MM/YYYY HH:mm")}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Tag color={isLate ? "red" : "green"}>
                                {isLate ? "LATE" : "ON TIME"}
                            </Tag>

                            {submission.score !== undefined && (
                                <Tag color="gold">
                                    Score: {submission.score}/10
                                </Tag>
                            )}
                        </div>
                    </div>

                    {/* ===== ASSIGNMENT INFO ===== */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            {assignment.title}
                        </h2>

                        <div
                            className="prose max-w-none text-sm text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: assignment.description || "",
                            }}
                        />

                        <div className="flex gap-6 text-sm text-gray-500 mt-4">
                            <span>
                                Created:{" "}
                                {assignment.createdAt
                                    ? dayjs(assignment.createdAt).format(
                                        "DD/MM/YYYY HH:mm"
                                    )
                                    : "—"}
                            </span>
                            <span>
                                Deadline:{" "}
                                {assignment.dueDate
                                    ? dayjs(assignment.dueDate).format(
                                        "DD/MM/YYYY HH:mm"
                                    )
                                    : "No deadline"}
                            </span>
                        </div>
                    </div>

                    {/* ===== STUDENT ANSWER ===== */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold mb-3">
                            Student Answer
                        </h3>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: submission.content || "",
                            }}
                        />
                    </div>

                    {/* ===== ATTACHMENTS ===== */}
                    {submission.attachments?.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-semibold mb-3">
                                Attachments
                            </h4>
                            <ul className="space-y-2 text-sm">
                                {submission.attachments.map((f: any) => (
                                    <li key={f.publicId}>
                                        <a
                                            href={f.fileUrl}
                                            target="_blank"
                                            className="text-blue-600 hover:underline"
                                        >
                                            📎 {f.fileName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="bg-white rounded-xl p-6 h-fit shadow-sm space-y-5">
                    <h3 className="text-lg font-semibold">
                        Grading
                    </h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Score (0 – 10)
                        </label>
                        <InputNumber
                            min={0}
                            max={10}
                            value={score}
                            onChange={(v) => setScore(v)}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Teacher feedback
                        </label>
                        <Input.TextArea
                            rows={4}
                            placeholder="Write feedback for student"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 pt-2">

                        <Button
                            type="primary"
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                            onClick={handleGrade}
                        >
                            Save Grade
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
