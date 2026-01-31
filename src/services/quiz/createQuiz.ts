import {
    addDoc,
    collection,
    serverTimestamp,
    writeBatch,
    doc, deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";


type CreateQuizPayload = {
    title: string;
    description?: string;
    classId: string;
    createdBy: string;
    questions: {
        text: string;
        options: string[];
        correctAnswer: number;
    }[];
};


export async function createQuiz(payload: CreateQuizPayload) {
    let quizRef;

    try {
        // 1️⃣ tạo quiz
        quizRef = await addDoc(collection(db, "quizzes"), {
            title: payload.title,
            description: payload.description ?? "",
            classId: payload.classId,
            createdBy: payload.createdBy,
            status: "draft",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // 2️⃣ tạo questions
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
        // 🔥 rollback quiz
        if (quizRef) {
            await deleteDoc(quizRef);
        }
        throw error;
    }
}

