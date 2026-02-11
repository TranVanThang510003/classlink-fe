import {useEffect, useState} from "react";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "@/lib/firebase";

export const usePublishedDocumentsByClass = (classId: string | null) => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId) {
            setDocuments([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "documents"),
            where("classId", "==", classId),
            where("status", "==", "published"),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((doc) => ({
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
