'use client';

import { Spin, Tag, Button } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import SubmitAssignment from '@/components/assigments/SubmitAssignment';
import { useAssignment } from '@/hooks/assigment/useAssignment';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type AuthUser = {
    uid: string;
    role: 'student' | 'instructor';
    name?: string;
};

export default function AssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params?.assignmentId as string;

    /* =========================
       ASSIGNMENT
    ========================= */
    const { assignment, loading: assignmentLoading } =
        useAssignment(assignmentId);

    /* =========================
       AUTH
    ========================= */
    const [user, setUser] = useState<AuthUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setAuthLoading(false);
                return;
            }

            const snap = await getDoc(
                doc(db, 'users', firebaseUser.uid)
            );

            setUser({
                uid: firebaseUser.uid,
                ...(snap.data() as AuthUser),
            });

            setAuthLoading(false);
        });

        return () => unsub();
    }, []);

    /* =========================
       LOADING
    ========================= */
    if (assignmentLoading || authLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!assignment || !user) return null;

    const isStudent = user.role === 'student';
    const isInstructor = user.role === 'instructor';

    /* =========================
       UI
    ========================= */
    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

            {/* ===== HEADER ===== */}
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

            {/* ===== DESCRIPTION ===== */}
            <div className="rounded-xl border bg-white p-6">
                {assignment.description ? (
                    <div
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

            {/* ===== STUDENT: SUBMIT ===== */}
            {isStudent && assignment.status === 'published' && (
                <div className="rounded-xl border bg-white p-6">
                    <SubmitAssignment
                        assignmentId={assignment.id}
                        classId={assignment.classId}
                    />
                </div>
            )}

            {/* ===== INSTRUCTOR: VIEW SUBMISSIONS ===== */}
            {isInstructor && (
                <div className="rounded-xl border bg-white p-6 flex justify-end">
                    <Button
                        type="primary"
                        onClick={() =>
                            router.push(
                                `/assignments/${assignment.id}/submissions`
                            )
                        }
                    >
                        View Student Submissions
                    </Button>
                </div>
            )}
        </div>
    );
}
