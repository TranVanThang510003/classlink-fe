import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { subscribeInstructorDocumentsByClass } from "@/services/document/documentInstructorService";
import type { Document } from "@/types/document";

function toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    return null;
}

export function useInstructorDocumentsByClass(classId?: string) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!classId) {
            setDocuments([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsub = subscribeInstructorDocumentsByClass(
            classId,
            (data) => {
                setDocuments(
                    data.map((raw) => ({
                        ...raw,
                        createdAt: toDate(raw.createdAt),
                        updatedAt: toDate(raw.updatedAt),
                    }))
                );
                setLoading(false);
            },
            () => {
                setDocuments([]);
                setLoading(false);
            }
        );

        return unsub;
    }, [classId]);

    return { documents, loading };
}
