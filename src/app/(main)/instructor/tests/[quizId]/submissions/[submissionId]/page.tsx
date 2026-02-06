'use client';

import { useParams } from "next/navigation";

import { useQuiz } from "@/hooks/quiz/useQuiz";
import { useSubmission } from "@/hooks/quiz/useQuizSubmission";

import SubmissionReview from "@/components/quizzes/SubmissionReview";

export default function SubmissionDetailPage() {
    const params = useParams();

    const quizId = params?.quizId as string | undefined;
    const submissionId = params?.submissionId as string | undefined;

    const { quiz, loading: quizLoading } = useQuiz(quizId);
    const { data: submission, isLoading } = useSubmission(quizId, submissionId);


    /* ===== Loading ===== */
    if (quizLoading ||  isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    /* ===== Not found ===== */
    if (!quiz || !submission) {
        return <div className="p-6">Submission not found</div>;
    }

    /* ===== UI ===== */
    return (
        <SubmissionReview
            title={quiz.title}
            description={quiz.description}
            questions={quiz.questions}
            answers={submission.answers}
            score={submission.score}
            submittedAt={submission.submittedAt}
            durationMinutes={submission.durationMinutes}
            studentName={submission.studentName}
            studentEmail={submission.studentEmail}
        />
    );
}
