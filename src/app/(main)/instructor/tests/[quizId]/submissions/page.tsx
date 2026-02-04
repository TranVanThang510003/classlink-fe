'use client';

import { useParams } from "next/navigation";
import { Spin, Statistic, Row, Col, Card } from "antd";

import { useQuizSubmissions } from "@/hooks/quiz/useQuizSubmissions";
import QuizSubmissionTable from "@/components/quizzes/QuizSubmissionTable";
import {useClassContext} from "@/contexts/ClassContext";

export default function QuizSubmissionsPage() {
    const params = useParams();
    const quizId = params.quizId as string;
    const {activeClassId} = useClassContext()


    const { submissions, loading } = useQuizSubmissions(quizId, activeClassId ?? "");

    if (loading) return <Spin fullscreen />;

    const submittedCount = submissions.length;
    const avgScore =
        submissions.reduce(
            (sum, s) => sum + s.correctCount / s.totalQuestions,
            0
        ) / (submittedCount || 1);

    return (
        <div className="p-6 flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">
                Quiz Submissions
            </h1>

            {/* ===== SUMMARY ===== */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card className="border !border-yellow-300">
                        <Statistic
                            title="Submitted"
                            value={submittedCount}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="border !border-yellow-300">
                        <Statistic
                            title="Average Score"
                            value={`${Math.round(avgScore * 100)}%`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ===== TABLE ===== */}
            <QuizSubmissionTable
                quizId={quizId}
                submissions={submissions}
            />
        </div>
    );
}
