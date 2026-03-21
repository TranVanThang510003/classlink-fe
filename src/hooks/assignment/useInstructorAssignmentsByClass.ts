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

function toDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    return null;
}
type AssignmentUI = Omit<Assignment, "dueDate" | "createdAt"> & {
    dueDate: Date | null;
    createdAt: Date | null;
};

export function useInstructorAssignmentsByClass(classId?: string) {
    const [assignments, setAssignments] = useState<AssignmentUI[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!classId) {
            setAssignments([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const q = query(
            collection(db, "assignments"),
            where("classId", "==", classId),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(
            q,
            (snap) => {

                const data: AssignmentUI[] = snap.docs.map((doc) => {
                    const raw = doc.data()  as Assignment;;
                    return {
                        ...raw,
                        dueDate: toDate(raw.dueDate),
                        createdAt: toDate(raw.createdAt),
                    };
                });

                setAssignments(data);
                setLoading(false);
            },
            () => {
                setAssignments([]);
                setLoading(false);
            }
        );

        return unsub;
    }, [classId]);

    return { assignments, loading };
}
