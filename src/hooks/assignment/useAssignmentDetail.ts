import { useEffect, useState } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Assignment } from "@/types/assignment";

/* =======================
   HELPER
======================= */
function toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    return null;
}

/* =======================
   HOOK
======================= */
export function useAssignmentDetail(assignmentId?: string) {
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!assignmentId) {
            setLoading(false);
            return;
        }

        const fetch = async () => {
            try {
                const snap = await getDoc(
                    doc(db, "assignments", assignmentId)
                );

                if (snap.exists()) {
                    const raw = snap.data();

                    setAssignment({
                        id: snap.id,
                        classId: raw.classId,
                        title: raw.title,
                        description: raw.description,
                        status: raw.status,
                        createdBy: raw.createdBy,
                        attachments: raw.attachments ?? [],
                        dueDate: toDate(raw.dueDate),
                        createdAt: toDate(raw.createdAt),
                    });
                }
            } catch (err) {
                console.error("Failed to fetch assignment", err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [assignmentId]);

    return { assignment, loading };
}
