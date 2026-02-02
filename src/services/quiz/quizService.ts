import {
    addDoc,
    collection,
    serverTimestamp,
    writeBatch,
    doc, deleteDoc, Timestamp,
} from "firebase/firestore";
import {auth, db} from "@/lib/firebase";


type CreateQuizPayload = {
    title: string;
    description?: string;
    classId: string;
    createdBy: string;
    duration: number;
    maxAttempts: number;

    status: "draft" | "published";
    openAt?: Date | null;
    closeAt?: Date | null;

    questions: {
        text: string;
        options: string[];
        correctAnswer: number;
    }[];
};



export async function quizService(payload: CreateQuizPayload) {
    let quizRef;

    try {
        /* =======================
           1️⃣ CREATE QUIZ
        ======================= */
        quizRef = await addDoc(collection(db, "quizzes"), {
            title: payload.title,
            description: payload.description ?? "",
            classId: payload.classId,
            createdBy: payload.createdBy,

            duration: payload.duration,
            maxAttempts: payload.maxAttempts,

            status: payload.status, // draft | published
            openAt: payload.openAt
                ? Timestamp.fromDate(payload.openAt)
                : null,
            closeAt: payload.closeAt
                ? Timestamp.fromDate(payload.closeAt)
                : null,

            totalQuestions: payload.questions.length,

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        /* =======================
           2️⃣ CREATE QUESTIONS
        ======================= */
        const batch = writeBatch(db);

        payload.questions.forEach((q, index) => {
            const questionRef = doc(collection(db, "quizQuestions"));
            batch.set(questionRef, {
                quizId: quizRef.id,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                order: index + 1,
                createdAt: serverTimestamp(),
            });
        });

        await batch.commit();

        return quizRef.id;
    } catch (error) {
        /* =======================
           🔥 ROLLBACK
        ======================= */
        if (quizRef) {
            await deleteDoc(quizRef);
        }
        throw error;
    }
}

export async function submitQuiz({
                                     quizId,
                                     answers,
                                     score,
                                     classId,
                                     correctCount,
                                     totalQuestions,
                                 }: {
    quizId: string;
    classId: string;
    answers: any[];
    score: number;
    correctCount: number;
    totalQuestions:number;
}) {
    return addDoc(collection(db, "quizSubmissions"), {
        quizId,
        studentId: auth.currentUser?.uid,
        classId,
        answers,
        score,
        correctCount,
        totalQuestions,
        submittedAt: serverTimestamp(),
    });
}
