'use client';

import { Spin, Tag } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import SubmitAssignment from '@/components/assigments/SubmitAssignment';
import { useAssignmentDetail } from '@/hooks/assignment/useAssignmentDetail';

import {useAuthContext} from "@/contexts/AuthContext";


export default function AssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params?.assignmentId as string;

    const { uid, role, loading: authLoading } = useAuthContext();

    const { assignment, loading: assignmentLoading } =
        useAssignmentDetail(assignmentId);


    useEffect(() => {
        if (!authLoading && role === "instructor") {
            router.replace(`/instructor/assignments/${assignmentId}`);
        }
    }, [authLoading, role, assignmentId, router]);

    if (assignmentLoading || authLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!assignment || !uid) return null;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">

            {/* ===== HEADER ===== */}
            <div className="border-b border-yellow-300 pb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {assignment.title}
                </h1>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <Tag
                        color={
                            assignment.status === 'published'
                                ? 'green'
                                : 'orange'
                        }
                    >
                        {assignment.status.toUpperCase()}
                    </Tag>

                    {assignment.dueDate && (
                        <span>
                            Due:&nbsp;
                            <b className="text-gray-900">
                                {dayjs(assignment.dueDate).format(
                                    'DD/MM/YYYY HH:mm'
                                )}
                            </b>
                        </span>
                    )}
                </div>
            </div>

            <section className="rounded-lg shadow-sm bg-white p-6">
                <h2 className="mb-3 text-lg font-medium">
                    Assignment Instructions
                </h2>

                {assignment.description ? (
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: assignment.description,
                        }}
                    />
                ) : (
                    <p className="italic text-gray-400">
                        No instructions provided.
                    </p>
                )}
            </section>

            {(assignment.attachments?.length ?? 0) > 0 && (
                <section className="rounded-lg shadow-sm bg-white p-6">
                    <h2 className="mb-3 text-lg font-medium">
                        Files
                    </h2>

                    <ul className="space-y-2">
                        {assignment.attachments?.map((file) => (
                            <li key={file.fileUrl}>
                                <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {file.fileName}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {assignment.status === 'published' && (
                <section className="rounded-lg shadow-sm bg-white p-6">
                    <h2 className="mb-4 text-lg font-medium">
                        Your Submission
                    </h2>

                    <SubmitAssignment
                        assignmentId={assignment.id}
                        classId={assignment.classId}
                    />
                </section>
            )}
        </div>
    );
}
