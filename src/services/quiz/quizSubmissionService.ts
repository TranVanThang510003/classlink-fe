import {
    collection,
    query,
    where,
    getDocs,
    Timestamp, doc, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type QuizSubmission = {
    id: string;
    quizId: string;
    classId: string;
    studentId: string;

    answers: number[];
    score: number;
    correctCount: number;
    totalQuestions: number;

    submittedAt: Timestamp;
};
export type QuizSubmissionWithStudent = QuizSubmission & {
    student?: {
        id: string;
        name?: string;
        email?: string;
    };
};



export async function getQuizSubmissionsWithStudents(
    quizId: string,
    classId: string
): Promise<QuizSubmissionWithStudent[]> {
    const q = query(
        collection(db, "quizSubmissions"),
        where("quizId", "==", quizId),
        where("classId", "==", classId)
    );

    const snap = await getDocs(q);

    const submissions = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as QuizSubmission[];

    // 🔗 join users
    const result = await Promise.all(
        submissions.map(async sub => {
            const userSnap = await getDoc(
                doc(db, "users", sub.studentId)
            );

            return {
                ...sub,
                student: userSnap.exists()
                    ? {
                        id: userSnap.id,
                        ...userSnap.data(),
                    }
                    : undefined,
            };
        })
    );

    return result;
}

