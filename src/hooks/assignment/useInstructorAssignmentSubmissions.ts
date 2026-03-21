
'use client';
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    documentId,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {TeacherSubmissionListItem} from "@/types/assignment";


/* ================================
   HOOK
================================ */

export function useInstructorAssignmentSubmissions(
    assignmentId?: string,
    classId?: string
) {
    const [submissions, setSubmissions] = useState<TeacherSubmissionListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [dueDate, setDueDate] = useState<any>(null);

    useEffect(() => {
        if (!assignmentId) return;

        const fetchAssignment = async () => {
            const snap = await getDoc(
                doc(db, 'assignments', assignmentId)
            );

            setDueDate(snap.exists() ? snap.data().dueDate : null);
        };

        fetchAssignment();
    }, [assignmentId]);

    useEffect(() => {
        if (!assignmentId || !classId) {
            setSubmissions([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const q = query(
            collection(db, 'assignmentSubmissions'),
            where('classId', '==', classId),
            where('assignmentId', '==', assignmentId),
            orderBy('submittedAt', 'desc')
        );

        const unsub = onSnapshot(
            q,
            async (snap) => {
                const raw = snap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                })) as TeacherSubmissionListItem[];

                /* MAP STUDENT NAMES */
                const userIds = Array.from(
                    new Set(raw.map((s) => s.submittedBy))
                );

                const userMap: Record<string, string> = {};

                if (userIds.length > 0) {
                    const usersSnap = await getDocs(
                        query(
                            collection(db, 'users'),
                            where(documentId(), 'in', userIds)
                        )
                    );

                    usersSnap.forEach((doc) => {
                        userMap[doc.id] = doc.data().name;
                    });
                }

                const merged = raw.map((s) => ({
                    ...s,
                    dueDate: dueDate?.toDate ? dueDate.toDate() : dueDate,
                    studentName: userMap[s.submittedBy] ?? 'Unknown',
                }));

                setSubmissions(merged);
                setLoading(false);
            },
            (error) => {
                console.error('🔥 Assignment submissions snapshot error:', error);
                setSubmissions([]);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [assignmentId, classId, dueDate]);

    return { submissions, loading };
}



export function useSubmissionDetail(submissionId: string) {
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!submissionId) return;

        const fetch = async () => {
            setLoading(true);

            // 1. Get submission
            const snap = await getDoc(
                doc(db, "assignmentSubmissions", submissionId)
            );

            if (!snap.exists()) {
                setSubmission(null);
                setLoading(false);
                return;
            }

            const submissionData = {
                id: snap.id,
                ...snap.data(),
            } as any;

            // 2. Get student info
            if (submissionData.submittedBy) {
                const userSnap = await getDoc(
                    doc(db, "users", submissionData.submittedBy)
                );

                submissionData.studentName = userSnap.exists()
                    ? userSnap.data().name
                    : "Unknown";
            }

            setSubmission(submissionData);
            setLoading(false);
        };

        fetch();
    }, [submissionId]);

    return { submission, loading };
}
