'use client';

import { Card, Tag, Progress, Typography, Row, Col, Avatar } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import type {QuizQuestion} from "@/types/quiz";
/* ================= TYPES ================= */



export type SubmissionReviewProps = {
    title: string;
    description?: string;
    questions: QuizQuestion[];
    answers: number[];
    score: number;
    submittedAt?: Date | null;
    durationMinutes?: number;

    studentName?: string;
    studentEmail?: string;
};

const { Title, Text } = Typography;

/* ================= QUESTION REVIEW ITEM ================= */

function QuestionReview({
                            question,
                            studentAnswer,
                            index,
                        }: {
    question: QuizQuestion
    studentAnswer: number | undefined;
    index: number;
}) {
    const isCorrect = studentAnswer === question.correctAnswer;

    return (
        <Card style={{ borderRadius: 16 }} bodyStyle={{ padding: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <Title level={5} style={{ margin: 0 }}>
                    Question {index + 1}. {question.text}
                </Title>

                {studentAnswer === undefined ? (
                    <Tag>Unanswered</Tag>
                ) : isCorrect ? (
                    <Tag color="green">Correct</Tag>
                ) : (
                    <Tag color="red">Incorrect</Tag>
                )}
            </div>

            {/* Options */}
            <div style={{ marginTop: 12 }}>
                {question.options.map((opt, i) => {
                    const isStudent = studentAnswer === i;
                    const isRight = question.correctAnswer === i;

                    let bg = "#fff";
                    let border = "#d9d9d9";

                    if (isRight) {
                        bg = "#f6ffed";
                        border = "#52c41a";
                    } else if (isStudent && !isRight) {
                        bg = "#fff2f0";
                        border = "#ff4d4f";
                    }

                    return (
                        <div
                            key={i}
                            style={{
                                border: `1px solid ${border}`,
                                background: bg,
                                borderRadius: 10,
                                padding: "10px 14px",
                                marginBottom: 8,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>{opt || <i>(empty)</i>}</span>

                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {isRight && "Correct answer"}
                                {isStudent && !isRight && "Your choice"}
                            </Text>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

/* ================= MAIN REVIEW ================= */

export default function SubmissionReview({
                                             title,
                                             description,
                                             questions,
                                             answers,
                                             score,
                                             submittedAt,
                                             durationMinutes,
                                             studentName,
                                             studentEmail,
                                         }: SubmissionReviewProps) {
    const correctCount = answers.filter(
        (ans, i) => ans === questions[i]?.correctAnswer
    ).length;

    const percent = Math.round((score / 10) * 100);

    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
                <Title level={2} style={{ marginBottom: 4 }}>
                    Quiz Result
                </Title>
                <Title level={4} style={{ marginTop: 0 }}>
                    {title}
                </Title>
                {/*{description && <Text type="secondary">{description}</Text>}*/}
            </div>

            {/* Student Info */}
            {(studentName || studentEmail) && (
                <Card className="!border-yellow-300 mb-20 rounded-xl" style={{ marginBottom: 20 }} >
                    <Row align="middle" gutter={16}>
                        <Col>
                            <Avatar size={56} icon={<UserOutlined />} />
                        </Col>

                        <Col flex="auto">
                            <Title level={5} style={{ margin: 0 }}>
                                {studentName ?? "Unknown student"}
                            </Title>

                            {studentEmail && (
                                <Text type="secondary">
                                    <MailOutlined style={{ marginRight: 6 }} />
                                    {studentEmail}
                                </Text>
                            )}
                        </Col>
                    </Row>
                </Card>
            )}

            {/* Score Overview */}
            <Card style={{ marginBottom: 20, borderRadius: 16 }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col>
                        <Text type="secondary">Score</Text>
                        <Title level={2} style={{ margin: 0 }}>
                            {score} / 10
                        </Title>
                        <Text type="secondary">
                            {correctCount} / {questions.length} correct answers
                        </Text>
                    </Col>

                </Row>

                <Progress percent={percent} style={{ marginTop: 16 }} />

                <div style={{ marginTop: 14 }}>
                    {submittedAt && (
                        <Text type="secondary" style={{ marginRight: 16 }}>
                            Submitted at: {submittedAt.toLocaleString()}
                        </Text>
                    )}
                    {durationMinutes && (
                        <Text type="secondary">Duration: {durationMinutes} minutes</Text>
                    )}
                </div>
            </Card>

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {questions.map((q, i) => (
                    <QuestionReview key={q.id} question={q} studentAnswer={answers[i]} index={i} />
                ))}
            </div>
        </div>
    );
}
