import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Assignment } from "@/types/assignment";
import { Timestamp } from "firebase/firestore";

function toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    return null;
}

export function useStudentAssignmentsByClass(
    classId?: string,
    userId?: string
) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!classId || !userId) {
            setAssignments([]);
            return;
        }

        setLoading(true);

        const assignmentQuery = query(
            collection(db, "assignments"),
            where("classId", "==", classId),
            where("status", "==", "published"),
            orderBy("createdAt", "desc")
        );

        const submissionQuery = query(
            collection(db, "assignmentSubmissions"),
            where("classId", "==", classId),
            where("submittedBy", "==", userId)
        );

        let assignmentData: any[] = [];
        const submissionMap = new Map<string, any>();

        const unsubAssignments = onSnapshot(assignmentQuery, (snap) => {
            assignmentData = snap.docs.map((d) => {
                const raw = d.data();

                return {
                    id: d.id,
                    ...raw,
                    dueDate: toDate(raw.dueDate),
                    createdAt: toDate(raw.createdAt),
                };
            });

            merge();
        });

        const unsubSubmissions = onSnapshot(submissionQuery, (snap) => {
            submissionMap.clear();

            snap.docs.forEach((d) => {
                const s = d.data();
                submissionMap.set(s.assignmentId, {
                    id: d.id,
                    ...s,
                    submittedAt: toDate(s.submittedAt),
                    gradedAt: toDate(s.gradedAt),
                });
            });

            merge();
        });

        function merge() {
            if (!assignmentData.length) return;

            const merged = assignmentData.map((a) => ({
                ...a,
                submission: submissionMap.get(a.id) ?? null,
            }));

            setAssignments(merged);
            setLoading(false);
        }

        return () => {
            unsubAssignments();
            unsubSubmissions();
        };
    }, [classId, userId]);

    return { assignments, loading };
}
