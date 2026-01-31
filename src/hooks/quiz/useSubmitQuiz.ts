import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export const useSubmitQuiz = () => {
    const submit = async ({
                              quizId,
                              studentId,
                              answers,
                              correctAnswers,
                          }: {
        quizId: string;
        studentId: string;
        answers: number[];
        correctAnswers: number[];
    }) => {
        const score = answers.filter(
            (a, i) => a === correctAnswers[i]
        ).length;

        await addDoc(collection(db, "quizSubmissions"), {
            quizId,
            studentId,
            answers,
            score,
            submittedAt: serverTimestamp(),
        });

        toast.success(`Submitted! Score: ${score}`);
    };

    return { submit };
};
