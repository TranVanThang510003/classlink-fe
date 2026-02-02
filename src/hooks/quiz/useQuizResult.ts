import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/contexts/AuthContext";

export const useQuizResult = (quizId: string) => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<{
        score: number;
        correctCount: number;
        total: number;
    } | null>(null);

    useEffect(() => {
        if (!user || !quizId) return;

        const fetchResult = async () => {
            const q = query(
                collection(db, "quizSubmissions"),
                where("quizId", "==", quizId),
                where("studentId", "==", user.uid),
                limit(1)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                const data = snap.docs[0].data();
                setResult({
                    score: data.score,
                    correctCount: data.correctCount,
                    total: data.totalQuestions, // nhớ lưu field này khi submit
                });
            }

            setLoading(false);
        };

        fetchResult();
    }, [quizId, user]);

    return { result, loading };
};
