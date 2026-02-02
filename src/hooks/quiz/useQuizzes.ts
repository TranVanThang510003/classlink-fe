import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Quiz } from "@/types/quiz";
import {useAuthContext} from "@/contexts/AuthContext";

type StudentQuiz = Quiz & {
    attempts: number;
    maxAttempts: number;
    isLocked: boolean;
    bestScore?: number;
    totalQuestions: number;
};

export const useQuizzes = (
    classId?: string,
    onlyPublished = false
) => {
    const { user } = useAuthContext();
    const studentId = user?.uid;

    const [quizzes, setQuizzes] = useState<StudentQuiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId || !studentId) return;

        const fetch = async () => {
            setLoading(true);

            /* =======================
               1️⃣ LẤY QUIZZES
            ======================= */
            const quizConstraints: any[] = [
                where("classId", "==", classId),
            ];

            if (onlyPublished) {
                quizConstraints.push(
                    where("status", "==", "published")
                );
            }

            const quizSnap = await getDocs(
                query(collection(db, "quizzes"), ...quizConstraints)
            );

            const quizList = quizSnap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Quiz, "id">),
            }));

            /* =======================
               2️⃣ LẤY SUBMISSIONS CỦA STUDENT
            ======================= */
            const submissionSnap = await getDocs(
                query(
                    collection(db, "quizSubmissions"),
                    where("studentId", "==", studentId)
                )
            );

            const submissions = submissionSnap.docs.map(d => d.data());

            /* =======================
               3️⃣ MERGE DATA
            ======================= */
            const result: StudentQuiz[] = quizList.map(quiz => {
                const quizSubs = submissions.filter(
                    s => s.quizId === quiz.id
                );

                const attempts = quizSubs.length;
                const maxAttempts = quiz.maxAttempts ?? 1;

                const bestSubmission =
                    quizSubs.length > 0
                        ? quizSubs.reduce((best, cur) =>
                            (cur.score ?? 0) > (best.score ?? 0) ? cur : best
                        )
                        : null;

                return {
                    ...quiz,
                    attempts,
                    maxAttempts,
                    isLocked: attempts >= maxAttempts,

                    bestScore: bestSubmission?.score,
                    totalQuestions: bestSubmission?.totalQuestions ?? 0,
                };
            });



            setQuizzes(result);
            setLoading(false);
        };

        fetch();
    }, [classId, onlyPublished, studentId]);

    return { quizzes, loading };
};
