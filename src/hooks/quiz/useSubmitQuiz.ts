import { useMutation } from "@tanstack/react-query";
import { submitQuiz } from "@/services/quiz/quizService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type SubmitQuizPayload = {
    classId: string;
    quizId: string;
    answers: number[];
    score: number;
    correctCount: number;
    totalQuestions: number;
};

export const useSubmitQuiz = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: SubmitQuizPayload) =>
            submitQuiz(payload),

        onSuccess: (_, variables) => {
            toast.success("Nộp bài thành công!");

            router.push(
                `/students/tests/${variables.quizId}/result`
            );
        },

        onError: (error) => {
            console.log(error)
            toast.error("Nộp bài thất bại");
        },
    });
};
