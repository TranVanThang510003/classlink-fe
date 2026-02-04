import { useEffect, useState } from "react";
import { getQuizSubmissionsWithStudents } from "@/services/quiz/quizSubmissionService";

export function useQuizSubmissions(quizId: string , classId: string) {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            if (!quizId || !classId) {
                setSubmissions([]);
                setLoading(true);
                return;
            }
        setLoading(true);

        getQuizSubmissionsWithStudents(quizId, classId)
            .then(setSubmissions)
            .finally(() => setLoading(false));
    }, [quizId, classId]);

    return { submissions, loading };
}
