'use client';

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
export function useTeacherAssignmentSubmissions(
    assignmentId?: string,
    classId?: string
) {
    const [submissions, setSubmissions] = useState<TeacherSubmissionListItem[]>([]);
    const [loading, setLoading] = useState(true);

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

                /* =========================
                   MAP USER NAMES
                ========================= */
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
    }, [assignmentId, classId]);

    return { submissions, loading };
}
