import {
    collection,
    query,
    where,
    getDocs, orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { Quiz } from "@/types/quiz";

export const useInstructorQuizzes = (classId?: string) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId) return;

        const fetch = async () => {
            setLoading(true);

            const snap = await getDocs(
                query(
                    collection(db, "quizzes"),
                    where("classId", "==", classId),
                    orderBy("createdAt", "desc")
                )
            );

            const list = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Quiz, "id">),
            }));

            setQuizzes(list);
            setLoading(false);
        };

        fetch();
    }, [classId]);

    return { quizzes,setQuizzes, loading };
};
