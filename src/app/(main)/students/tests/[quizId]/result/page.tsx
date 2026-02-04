'use client';

import { Button, Progress, Spin, Tag, Divider } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useQuizResult } from "@/hooks/quiz/useQuizResult";

export default function QuizResultPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.quizId as string;

    const { result, loading } = useQuizResult(quizId);

    if (loading) return <Spin fullscreen />;

    if (!result) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
                Result not found
            </div>
        );
    }

    const {
        score,
        correctCount,
        total,

    } = result;

    const percent = Math.round((correctCount / total) * 100);
    const isPassed = percent >= 50;

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white w-full max-w-md rounded-xl border shadow-sm p-8">

                {/* HEADER */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                        Quiz Result
                    </h2>
                    <p className="text-sm text-gray-500">
                        This quiz has been completed
                    </p>
                </div>
                <div className=" w-full flex justify-center items-center">

                    {/* SCORE */}
                    <div className="flex items-center gap-6">
                        <Progress
                            type="circle"
                            percent={percent}
                            strokeWidth={10}
                            width={120}
                            strokeColor={isPassed ? "#2563eb" : "#dc2626"}
                            format={() => (
                                <span className="text-lg font-semibold">
                                    {percent}%
                                </span>
                            )}
                        />

                        <div className="flex flex-col gap-2">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Correct answers
                                </p>
                                <p className="text-lg font-semibold">
                                    {correctCount} / {total}
                                </p>
                            </div>

                            <Tag color={isPassed ? "blue" : "red"}>
                                {isPassed ? "Passed" : "Failed"}
                            </Tag>
                        </div>
                    </div>
                </div>


                <Divider />



                {/* ACTION */}
                <div className="mt-6">
                    <Button
                        block
                        size="large"
                        type="primary"
                        onClick={() => router.push("/students/tests")}
                    >
                        Back to quizzes
                    </Button>
                </div>
            </div>
        </div>
    );
}
