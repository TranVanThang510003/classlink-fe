'use client';

import { Spin, Tag, Button } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import { useAssignmentDetail } from '@/hooks/assignment/useAssignmentDetail';
import { useAuthContext } from '@/contexts/AuthContext';

export default function InstructorAssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params?.assignmentId as string;

    /* ===== AUTH ===== */
    const {
        role,
        loading: authLoading,
        isLoggedIn,
    } = useAuthContext();

    /* ===== ASSIGNMENT ===== */
    const { assignment, loading: assignmentLoading } =
        useAssignmentDetail(assignmentId);

    /* ===== LOADING ===== */
    if (authLoading || assignmentLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    /* ===== GUARD ===== */
    if (!isLoggedIn || role !== 'instructor' || !assignment) {
        return null; // hoặc redirect
    }

    /* ===== UI ===== */
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

            {/* ===== HEADER ===== */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {assignment.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
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
                                Due:{' '}
                                <b>
                                    {dayjs(assignment.dueDate).format(
                                        'DD/MM/YYYY HH:mm'
                                    )}
                                </b>
                            </span>
                        )}
                    </div>
                </div>

                <Button
                    type="primary"
                    onClick={() =>
                        router.push(
                            `/instructor/assignment/${assignment.id}/submissions`
                        )
                    }
                >
                    View Submissions
                </Button>
            </div>

            {/* ===== DESCRIPTION ===== */}
            <div className="rounded-xl border bg-white p-6">
                {assignment.description ? (
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: assignment.description,
                        }}
                    />
                ) : (
                    <span className="italic text-gray-400">
                        No description provided.
                    </span>
                )}
            </div>

            {/* ===== ATTACHMENTS ===== */}
            {assignment.attachments?.length > 0 && (
                <div className="rounded-xl border bg-white p-6 space-y-2">
                    <h3 className="font-medium">Attachments</h3>

                    {assignment.attachments.map((file) => (
                        <a
                            key={file.fileUrl}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:underline"
                        >
                            {file.fileName}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
