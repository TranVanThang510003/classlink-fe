import { useQuery } from "@tanstack/react-query";
import {collection, query, where, getDocs, Timestamp, limit, orderBy} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useStudentSubmission(quizId?: string, studentId?: string) {
    return useQuery({
        queryKey: ["studentSubmission", quizId, studentId],
        enabled: !!quizId && !!studentId,

        queryFn: async () => {

            const q = query(
                collection(db, "quizSubmissions"),
                where("quizId", "==", quizId),
                where("studentId", "==", studentId),
                orderBy("score", "desc"),
                limit(1)
            );

            const snap = await getDocs(q);

            if (snap.empty) return null;

            const docSnap = snap.docs[0];
            const data = docSnap.data();

            return {
                id: docSnap.id,
                answers: data.answers ?? [],
                score: data.score ?? 0,
                durationMinutes: data.durationMinutes,
                submittedAt:
                    data.submittedAt instanceof Timestamp
                        ? data.submittedAt.toDate()
                        : null,
            };
        },
    });
}