import {
    addDoc,
    collection,
    serverTimestamp,
    writeBatch,
    doc, deleteDoc, Timestamp, updateDoc, getDocs, query, where,
} from "firebase/firestore";
import {auth, db} from "@/lib/firebase";


type UpdateQuizPayload = {
    title: string;
    description?: string;
    duration: number;
    maxAttempts: number;
    status: "draft" | "published";
    openAt?: Date | null;
    closeAt?: Date | null;
    questions: {
        id: string; // Firestore id | temp_xxx
        text: string;
        options: string[];
        correctAnswer: number;
    }[];
};
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


export const updateQuiz = (id: string, data: any) =>
    updateDoc(doc(db, "quizzes", id), {
        ...data,
        updatedAt: new Date(),
    });


export async function updateQuizWithQuestions(
    quizId: string,
    payload: UpdateQuizPayload
) {
    const batch = writeBatch(db);

    /* =======================
       1️⃣ UPDATE QUIZ
    ======================= */
    batch.update(doc(db, "quizzes", quizId), {
        title: payload.title,
        description: payload.description ?? "",
        duration: payload.duration,
        maxAttempts: payload.maxAttempts,
        status: payload.status,
        openAt: payload.openAt
            ? Timestamp.fromDate(payload.openAt)
            : null,
        closeAt: payload.closeAt
            ? Timestamp.fromDate(payload.closeAt)
            : null,
        totalQuestions: payload.questions.length,
        updatedAt: serverTimestamp(),
    });

    /* =======================
       2️⃣ FETCH OLD QUESTIONS
    ======================= */
    const oldSnap = await getDocs(
        query(
            collection(db, "quizQuestions"),
            where("quizId", "==", quizId)
        )
    );

    const oldIds = oldSnap.docs.map(d => d.id);
    const newIds = payload.questions
        .filter(q => !q.id.startsWith("temp_"))
        .map(q => q.id);

    /* =======================
       3️⃣ DELETE REMOVED QUESTIONS
    ======================= */
    oldIds
        .filter(id => !newIds.includes(id))
        .forEach(id => {
            batch.delete(doc(db, "quizQuestions", id));
        });

    /* =======================
       4️⃣ CREATE / UPDATE QUESTIONS
    ======================= */
    payload.questions.forEach((q, index) => {
        if (q.id.startsWith("temp_")) {
            // ➕ CREATE
            const ref = doc(collection(db, "quizQuestions"));
            batch.set(ref, {
                quizId,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                order: index + 1,
                createdAt: serverTimestamp(),
            });
        } else {
            // ✏️ UPDATE
            batch.update(doc(db, "quizQuestions", q.id), {
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                order: index + 1,
                updatedAt: serverTimestamp(),
            });
        }
    });

    /* =======================
       5️⃣ COMMIT
    ======================= */
    await batch.commit();
}


export const deleteQuiz = (id: string) =>
    deleteDoc(doc(db, "quizzes", id));
