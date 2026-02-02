'use client';

import { Button, Progress, Spin } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useQuizResult } from "@/hooks/quiz/useQuizResult";

export default function QuizResultPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.quizId as string;

    const { result, loading } = useQuizResult(quizId);

    if (loading) return <Spin fullscreen />;

    if (!result) {
        return <p className="text-center">Không tìm thấy kết quả</p>;
    }

    const { score,correctCount, total } = result;
    const percent = Math.round((score / total) * 100);

    const getTheme = () => {
        if (percent >= 80)
            return { color: "#2563eb", text: "Excellent 🎉" };
        if (percent >= 50)
            return { color: "#16a34a", text: "Good 👍" };
        return { color: "#dc2626", text: "Try again 💪" };
    };

    const theme = getTheme();

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow text-center w-[360px]">

                <Progress
                    type="circle"
                    percent={percent}
                    strokeWidth={10}
                    strokeColor={theme.color}
                    format={() => (
                        <div>
                            <p className="text-sm">Your Score</p>
                            <p className="text-2xl font-bold">
                                {correctCount}/{total}
                            </p>
                        </div>
                    )}
                />

                <p
                    className="mt-6 text-lg font-semibold"
                    style={{ color: theme.color }}
                >
                    {theme.text}
                </p>

                <Button
                    className="mt-8"
                    type="primary"
                    onClick={() => router.push("/student/quizzes")}
                >
                    Quay lại
                </Button>
            </div>
        </div>
    );
}
