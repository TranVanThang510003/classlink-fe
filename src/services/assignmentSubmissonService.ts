// ================================
// SERVICE: services/assignmentSubmissionService.ts
// ================================
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function gradeSubmission(
    submissionId: string,
    data: { score: number; feedback?: string }
) {
    await updateDoc(doc(db, 'assignmentSubmissions', submissionId), {
        score: data.score,
        feedback: data.feedback ?? '',
        gradedAt: new Date(),
    });
}
