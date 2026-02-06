import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Quiz, QuizQuestion } from "@/types/quiz";
import { Timestamp } from "firebase/firestore";

type QuizFormData = Quiz & {
    questions: QuizQuestion[];
};

export const useQuiz = (quizId?: string) => {
    const [quiz, setQuiz] = useState<QuizFormData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!quizId) return;

        const fetchAll = async () => {
            setLoading(true);

            /* ===== QUIZ ===== */
            const quizSnap = await getDoc(doc(db, "quizzes", quizId));
            if (!quizSnap.exists()) {
                setQuiz(null);
                setLoading(false);
                return;
            }

            const quizData = quizSnap.data() as Quiz;

            /* ===== QUESTIONS ===== */
            const q = query(
                collection(db, "quizQuestions"),
                where("quizId", "==", quizId)
            );
            const questionSnap = await getDocs(q);

            const questions = questionSnap.docs.map(
                d => ({ id: d.id, ...d.data() } as QuizQuestion)
            );

            /* ===== MERGE + NORMALIZE ===== */

            setQuiz({
                ...quizData,
                id: quizSnap.id,
                openAt: quizData.openAt instanceof Timestamp
                    ? quizData.openAt.toDate()
                    : null,
                closeAt: quizData.closeAt instanceof Timestamp
                    ? quizData.closeAt.toDate()
                    : null,
                questions,
            } );

            setLoading(false);
        };

        fetchAll();
    }, [quizId]);

    return {
        quiz,
        loading,
    };
};
