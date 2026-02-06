import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Submission = {
    id: string;
    answers: number[];
    score: number;
    submittedAt: Date | null;
    durationMinutes?: number;

    studentId?: string;
    studentName?: string;
    studentEmail?: string;
};

export function useSubmission(quizId?: string, submissionId?: string) {
    return useQuery({
        queryKey: ["submission", submissionId],
        enabled: !!submissionId,

        queryFn: async (): Promise<Submission | null> => {
            const ref = doc(db, "quizSubmissions", submissionId!);
            const snap = await getDoc(ref);

            if (!snap.exists()) return null;

            const data = snap.data();

            let studentName: string | undefined;
            let studentEmail: string | undefined;

            // 🔥 lấy user nếu có studentId
            if (data.studentId) {
                const userRef = doc(db, "users", data.studentId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    studentName = userData.name;
                    studentEmail = userData.email;
                }
            }

            return {
                id: snap.id,
                answers: data.answers ?? [],
                score: data.score ?? 0,
                durationMinutes: data.durationMinutes,
                submittedAt:
                    data.submittedAt instanceof Timestamp
                        ? data.submittedAt.toDate()
                        : null,

                studentId: data.studentId,
                studentName,
                studentEmail,
            };
        },
    });
}
