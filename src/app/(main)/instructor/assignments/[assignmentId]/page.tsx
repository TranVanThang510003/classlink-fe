'use client';

import { Spin, Button, Tag } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import { useAssignmentDetail } from '@/hooks/assignment/useAssignmentDetail';
import { useAuthContext } from '@/contexts/AuthContext';

export default function InstructorAssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params?.assignmentId as string;

    const { role, loading: authLoading, isLoggedIn } = useAuthContext();
    const { assignment, loading } = useAssignmentDetail(assignmentId);

    if (authLoading || loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!isLoggedIn || role !== 'instructor' || !assignment) return null;

    return (
        <div className="min-h-screen  px-6 py-10">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* ===== HEADER ===== */}
                <div className="rounded-xl bg-white px-8 py-6 shadow-sm">
                    <div className="flex items-start justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold text-[#0B1C3D]">
                                {assignment.title}
                            </h1>

                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Tag
                                    color={assignment.status === 'published' ? 'green' : 'orange'}
                                >
                                    {assignment.status.toUpperCase()}
                                </Tag>

                                {assignment.dueDate && (
                                    <span>
                    Due date:{' '}
                                        <b className="text-gray-800">
                      {dayjs(assignment.dueDate).format('DD/MM/YYYY HH:mm')}
                    </b>
                  </span>
                                )}
                            </div>
                        </div>

                        <Button
                            size="large"
                            className="bg-[#F6C21C] font-medium text-[#08183A] hover:!bg-[#eab308] hover:!text-white"
                            onClick={() =>
                                router.push(
                                    `/instructor/assignments/${assignment.id}/submissions`
                                )
                            }
                        >
                            View submissions
                        </Button>
                    </div>
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="rounded-xl bg-white px-8 py-6 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Assignment description
                    </h2>

                    {assignment.description ? (
                        <div
                            className="prose max-w-none text-sm"
                            dangerouslySetInnerHTML={{
                                __html: assignment.description,
                            }}
                        />
                    ) : (
                        <p className="italic text-gray-400">
                            No description provided.
                        </p>
                    )}
                </div>

                {/* ===== ATTACHMENTS ===== */}
                {assignment.attachments?.length > 0 && (
                    <div className="rounded-xl bg-white px-8 py-6 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Attachments
                        </h2>

                        <div className="space-y-3">
                            {assignment.attachments.map((file) => (
                                <a
                                    key={file.fileUrl}
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm transition hover:border-[#F6C21C] hover:bg-yellow-50"
                                >
                  <span className="truncate text-gray-800">
                    {file.fileName}
                  </span>
                                    <span className="font-medium text-[#0B1C3D]">
                    Open
                  </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
