
'use client';

import QuizForm from "@/components/quizzes/QuizForm";
import toast from "react-hot-toast";
import { quizService } from "@/services/quiz/quizService";
import { useAuthContext } from "@/contexts/AuthContext";
import { useClassContext } from "@/contexts/ClassContext";

export default function CreateQuizPage() {
    const { uid } = useAuthContext();
    const { activeClassId } = useClassContext();

    const handleCreate = async (data: any) => {
        await quizService({
            ...data,
            classId: activeClassId,
            createdBy: uid,
        });
        history.back();
    };

    return <QuizForm mode="create" onSubmit={handleCreate} />;
}
