import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export function useMyClasses(instructorId?: string) {
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        if (!instructorId) return;

        const q = query(
            collection(db, "classes"),
            where("instructorId", "==", instructorId)
        );

        const unsub = onSnapshot(q, (snap) => {
            setClasses(
                snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            );
        });

        return () => unsub();
    }, [instructorId]);

    return classes;
}
