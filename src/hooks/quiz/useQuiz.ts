import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, useCallback } from "react";
import { Quiz, QuizQuestion } from "@/types/quiz";

export const useQuiz = (quizId?: string) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuestions = useCallback(async () => {
        if (!quizId) return;

        const q = query(
            collection(db, "quizQuestions"),
            where("quizId", "==", quizId)
        );

        const snap = await getDocs(q);
        setQuestions(
            snap.docs.map(
                d => ({ id: d.id, ...d.data() } as QuizQuestion)
            )
        );
    }, [quizId]);

    useEffect(() => {
        if (!quizId) return;

        const fetchAll = async () => {
            setLoading(true);

            const quizSnap = await getDoc(doc(db, "quizzes", quizId));
            if (!quizSnap.exists()) {
                setQuiz(null);
                setLoading(false);
                return;
            }

            setQuiz({
                id: quizSnap.id,
                ...quizSnap.data(),
            } as Quiz);

            await fetchQuestions();
            setLoading(false);
        };

        fetchAll();
    }, [quizId, fetchQuestions]);

    return {
        quiz,
        questions,
        loading,
        refetchQuestions: fetchQuestions,
    };
};
