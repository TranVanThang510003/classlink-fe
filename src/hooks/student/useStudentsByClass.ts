'use client';

import {
    collection,
    doc,
    getDoc,
    query,
    where,
    onSnapshot,
    documentId,
} from "firebase/firestore";
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

        // 1️⃣ Lấy class document
        const classRef = doc(db, "classes", classId);

        const unsub = onSnapshot(classRef, async (classSnap) => {
            if (!classSnap.exists()) {
                setStudents([]);
                setLoading(false);
                return;
            }

            const studentIds: string[] = classSnap.data().studentIds || [];

            if (studentIds.length === 0) {
                setStudents([]);
                setLoading(false);
                return;
            }

            // 2️⃣ Query users theo studentIds
            const q = query(
                collection(db, "users"),
                where(documentId(), "in", studentIds)
            );

            const unsubStudents = onSnapshot(q, (snap) => {
                const list: Student[] = snap.docs.map((d) => ({
                    id: d.id,
                    ...(d.data() as Omit<Student, "id">),
                }));

                setStudents(list);
                setLoading(false);
            });

            return () => unsubStudents();
        });

        return () => unsub();
    }, [classId]);

    return { students, loading };
}
