import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Quiz, QuizQuestion } from "@/types/quiz";

export const useQuiz = (quizId?: string) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!quizId) return;

        const fetch = async () => {
            const quizSnap = await getDoc(doc(db, "quizzes", quizId));
            setQuiz({ id: quizSnap.id, ...quizSnap.data() } as Quiz);

            const q = query(
                collection(db, "quizQuestions"),
                where("quizId", "==", quizId)
            );
            const qs = await getDocs(q);
            setQuestions(
                qs.docs.map(d => ({ id: d.id, ...d.data() } as QuizQuestion))
            );

            setLoading(false);
        };

        fetch();
    }, [quizId]);

    return { quiz, questions, loading };
};
