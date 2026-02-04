"use client"
import QuizForm from "@/components/quizzes/QuizForm";
import {useParams} from "next/navigation";
import {useQuiz} from "@/hooks/quiz/useQuiz";
import { updateQuizWithQuestions} from "@/services/quiz/quizService";

export default function UpdateQuizPage() {
    const { quizId } = useParams();
    const { quiz, loading } = useQuiz(quizId as string);

    const handleUpdate = async (data: any) => {
        await updateQuizWithQuestions(quizId as string, data);
        history.back();
    };

    if (loading) return <div>Loading...</div>;
    if (!quiz) return <div>Quiz not found</div>;

    return (
        <QuizForm
            mode="edit"
            initialData={quiz}
            onSubmit={handleUpdate}
        />
    );
}
