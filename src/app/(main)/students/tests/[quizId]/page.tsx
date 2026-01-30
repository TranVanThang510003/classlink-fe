'use client';
import { useParams } from "next/navigation";
import { useQuiz } from "@/hooks/quiz/useQuiz";
import { useSubmitQuiz } from "@/hooks/quiz/useSubmitQuiz";
import { useAuthContext } from "@/contexts/AuthContext";
import QuizPlayer from "@/components/quizzes/QuizPlayer";

export default function DoQuizPage() {
  const { quizId } = useParams();
  const { quiz, questions, loading } = useQuiz(quizId as string);
  const { submit } = useSubmitQuiz();
  const { uid } = useAuthContext();

  if (loading || !quiz) return null;

  return (
    <QuizPlayer
      questions={questions}
      onSubmit={async (answers) => {
        const score = await submit({
          quizId: quiz.id,
          studentId: uid!,
          answers,
          correctAnswers: questions.map(q => q.correctIndex),
        });
        alert(`Your score: ${score}/${questions.length}`);
      }}
    />
  );
}
