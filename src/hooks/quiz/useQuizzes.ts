import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Quiz } from "@/types/quiz";

export const useQuizzes = (
    classId?: string,
    onlyPublished = false
) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId) return;

        const fetch = async () => {
            setLoading(true);

            const constraints: any[] = [
                where("classId", "==", classId),
            ];

            if (onlyPublished) {
                constraints.push(where("status", "==", "published"));
            }

            const q = query(collection(db, "quizzes"), ...constraints);
            const snap = await getDocs(q);

            setQuizzes(
                snap.docs.map(d => ({
                    id: d.id,
                    ...(d.data() as Omit<Quiz, "id">),
                }))
            );

            setLoading(false);
        };

        fetch();
    }, [classId, onlyPublished]);

    return { quizzes, loading };
};
