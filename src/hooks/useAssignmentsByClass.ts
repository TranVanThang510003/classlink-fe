import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Assignment {
    id: string;
    classId: string;
    title: string;
    description?: string;
    status: "draft" | "published";
    dueDate?: any;
    createdBy: string;
    createdAt?: any;
    updatedAt?: any;
}

export function useAssignmentsByClass(classId?: string) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!classId) {
            setAssignments([]);
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
                const data: Assignment[] = snap.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Assignment, "id">),
                }));
                setAssignments(data);
                setLoading(false);
            },
            (err) => {
                console.error("Failed to fetch assignments", err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [classId]);

    return {
        assignments,
        loading,
    };
}
