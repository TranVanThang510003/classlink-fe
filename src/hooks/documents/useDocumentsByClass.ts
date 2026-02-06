import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

export const useDocumentsByClass = (classId: string|null) => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    console.log("Subscribing to documents for classId:", classId);
    useEffect(() => {
        if (!classId) {
            setDocuments([]);
            setLoading(true);
            return;
        }

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
