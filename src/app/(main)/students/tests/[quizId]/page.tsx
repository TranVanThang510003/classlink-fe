'use client';

import { useParams } from "next/navigation";
import { Spin } from "antd";

import QuizPlayer from "@/components/quizzes/QuizPlayer";
import { useQuiz } from "@/hooks/quiz/useQuiz";

export default function TestQuizPage() {
    const params = useParams();
    const quizId = params?.quizId as string;


    const { quiz, loading } = useQuiz(quizId);

    if (loading) return <Spin />;

    if (!quiz || quiz.questions.length === 0) {
        return (
            <div className="text-gray-400 italic">
                Quiz not found or no questions
            </div>
        );
    }

    return (
        <QuizPlayer
            quiz={quiz}
            questions={quiz.questions}
        />
    );
}
