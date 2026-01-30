'use client';

import { useParams } from "next/navigation";
import { Button, Spin } from "antd";
import { useQuiz } from "@/hooks/quiz/useQuiz";
import QuestionForm from "@/components/quizzes/QuestionForm";
import QuestionList from "@/components/quizzes/QuestionList";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function InstructorQuizDetailPage() {
    const { quizId } = useParams();
    const { quiz, questions, loading } = useQuiz(quizId as string);

    const publishQuiz = async () => {
        await updateDoc(doc(db, "quizzes", quizId as string), {
            published: true,
        });
        toast.success("Quiz published");
    };

    if (loading || !quiz) {
        return (
            <div className="flex justify-center mt-10">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">
                    {quiz.title}
                </h2>

                <Button
                    type="primary"
                    disabled={questions.length === 0}
                    onClick={publishQuiz}
                >
                    Publish Quiz
                </Button>
            </div>

            {/* ADD QUESTION */}
            <QuestionForm
                quizId={quiz.id}
                onCreated={() => {}}
            />

            {/* QUESTION LIST */}
            <QuestionList questions={questions} />
        </div>
    );
}
