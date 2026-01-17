import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

export const useDocumentsByClass = (classId: string) => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId) return;

        const q = query(
            collection(db, "documents"),
            where("classId", "==", classId),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDocuments(data);
            setLoading(false);
        });

        return () => unsub();
    }, [classId]);

    return { documents, loading };
};
