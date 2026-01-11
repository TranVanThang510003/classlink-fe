'use client';

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import type { Student } from "@/types/student";

export function useStudentsByClass(classId?: string) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId) {
            setStudents([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const q = query(
            collection(db, "users"),
            where("role", "==", "student"),
            where("classId", "==", classId)
        );

        const unsub = onSnapshot(q, (snap) => {
            const list: Student[] = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Student, "id">),
            }));

            setStudents(list);
            setLoading(false);
        });

        return () => unsub();
    }, [classId]);

    return { students, loading };
}
