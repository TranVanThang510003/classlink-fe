import { useEffect, useState } from "react";
import { getMyAssignmentSubmission } from "@/services/assignment/assignmentStudentService";

export function useMySubmission(
    assignmentId: string,
    userId?: string
) {
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!assignmentId || !userId) return;

        const fetch = async () => {
            setLoading(true);
            const result = await getMyAssignmentSubmission(
                assignmentId,
                userId
            );
            setSubmission(result);
            setLoading(false);
        };

        fetch();
    }, [assignmentId, userId]);

    return { submission, loading };
}
