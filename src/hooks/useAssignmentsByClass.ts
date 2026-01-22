import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import type { Assignment } from "@/types/assignment";

/* =======================
   HELPER
======================= */
function toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    return null;
}

/* =======================
   HOOK
======================= */
export function useAssignmentsByClass(
    classId?: string,
    role: "instructor" | "student" = "student"
) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!classId) {
            setAssignments([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // ✅ Query khác nhau theo ROLE
        const baseQuery = [
            where("classId", "==", classId),
            orderBy("createdAt", "desc"),
        ];

        const q =
            role === "student"
                ? query(
                    collection(db, "assignments"),
                    where("classId", "==", classId),
                    where("status", "==", "published"), // 🔥 QUAN TRỌNG
                    orderBy("createdAt", "desc")
                )
                : query(
                    collection(db, "assignments"),
                    ...baseQuery
                );

        const unsub = onSnapshot(
            q,
            (snap) => {
                const data: Assignment[] = snap.docs.map((doc) => {
                    const raw = doc.data();

                    return {
                        id: doc.id,
                        classId: raw.classId,
                        title: raw.title,
                        description: raw.description,
                        status: raw.status,
                        createdBy: raw.createdBy,
                        attachments: raw.attachments ?? [],
                        dueDate: toDate(raw.dueDate),
                        createdAt: toDate(raw.createdAt),
                    };
                });

                setAssignments(data);
                setLoading(false);
            },
            (err) => {
                console.error("Failed to fetch assignments", err);
                setAssignments([]);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [classId, role]);

    return { assignments, loading };
}
