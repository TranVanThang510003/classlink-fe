'use client'

import { useParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentSubmission } from "@/hooks/quiz/useStudentSubmission";
import { useQuiz } from "@/hooks/quiz/useQuiz";

import SubmissionReview from "@/components/quizzes/SubmissionReview";

export default function StudentResultPage() {

    const params = useParams();
    const quizId = params?.quizId as string;

    const { user } = useAuthContext();

    const { quiz, loading: quizLoading } = useQuiz(quizId);

    const { data: submission, isLoading } =
        useStudentSubmission(quizId, user?.uid);

    if (quizLoading || isLoading) {
        return <div>Loading...</div>;
    }

    if (!quiz || !submission) {
        return <div>No submission</div>;
    }

    return (
        <SubmissionReview
            title={quiz.title}
            description={quiz.description}
            questions={quiz.questions}
            answers={submission.answers}
            score={submission.score}
            submittedAt={submission.submittedAt}
            durationMinutes={submission.durationMinutes}
        />
    );
}