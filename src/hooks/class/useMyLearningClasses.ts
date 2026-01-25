import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
export function useMyLearningClasses(studentId?: string) {
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        if (!studentId) return;

        const q = query(
            collection(db, "classes"),
            where("studentIds", "array-contains", studentId)
        );

        const unsub = onSnapshot(q, (snap) => {
            setClasses(snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
            })));
        });

        return () => unsub();
    }, [studentId]);

    return classes;
}
