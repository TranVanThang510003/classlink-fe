'use client';

import { Table, Tag, Button } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import {StudentSubmissionGroup, Submission} from "@/types/quiz";


type Props = {
    quizId: string;
    submissions: Submission[];
};

export default function QuizSubmissionTable({
                                                quizId,
                                                submissions,
                                            }: Props) {
    const router = useRouter();

    const groupedSubmissions = groupByStudent(submissions);

    return (
        <Table
            rowKey="studentId"
            dataSource={groupedSubmissions}
            pagination={{ pageSize: 10 }}
            expandable={{
                expandedRowRender: record => (
                    <AttemptsTable
                        quizId={quizId}
                        attempts={record.attempts}
                    />
                ),
                rowExpandable: record => record.attemptCount > 1,
            }}
            columns={[
                {
                    title: "Student",
                    render: (_, r) => (
                        <div>
                            <div className="font-medium">
                                {r.student?.name ?? "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {r.student?.email}
                            </div>
                        </div>
                    ),
                },
                {
                    title: "Attempts",
                    dataIndex: "attemptCount",
                    render: v => <Tag>{v}</Tag>,
                },
                {
                    title: "Latest Score",
                    render: (_, r) =>
                        `${r.correctCount}/${r.totalQuestions}`,
                },
                {
                    title: "%",
                    render: (_, r) =>
                        `${Math.round(
                            (r.correctCount / r.totalQuestions) * 100
                        )}%`,
                },
                {
                    title: "Last Submitted",
                    render: (_, r) =>
                        dayjs(r.submittedAt.toDate()).format(
                            "DD/MM/YYYY HH:mm"
                        ),
                },
                {
                    title: "",
                    render: (_, r) => (
                        <Button
                            size="small"
                            onClick={() =>
                                router.push(
                                    `/instructor/tests/${quizId}/submissions/${r.id}`
                                )
                            }
                        >
                            Detail Page
                        </Button>
                    ),
                },
            ]}
        />
    );
}

/* ======================
   Attempts Table (child)
====================== */

function AttemptsTable({
                           quizId,
                           attempts,
                       }: {
    quizId: string;
    attempts: Submission[];
}) {
    const router = useRouter();

    return (
        <Table
            rowKey="id"
            dataSource={[...attempts].sort(
                (a, b) =>
                    b.submittedAt.toMillis() -
                    a.submittedAt.toMillis()
            )}
            pagination={false}
            size="small"
            columns={[
                {
                    title: "Attempt",
                    render: (_, __, index) => `#${index + 1}`,
                },
                {
                    title: "Score",
                    render: (_, r) =>
                        `${r.correctCount}/${r.totalQuestions}`,
                },
                {
                    title: "%",
                    render: (_, r) =>
                        `${Math.round(
                            (r.correctCount / r.totalQuestions) * 100
                        )}%`,
                },
                {
                    title: "Submitted At",
                    render: (_, r) =>
                        dayjs(r.submittedAt.toDate()).format(
                            "DD/MM/YYYY HH:mm"
                        ),
                },
                {
                    title: "",
                    render: (_, r) => (
                        <Button
                            size="small"
                            onClick={() =>
                                router.push(
                                    `/instructor/tests/${quizId}/submissions/${r.id}`
                                )
                            }
                        >
                            View
                        </Button>
                    ),
                },
            ]}
        />
    );
}

/* ======================
   Helpers
====================== */

function groupByStudent(
    submissions: Submission[]
): StudentSubmissionGroup[] {
    const map = new Map<string, StudentSubmissionGroup>();

    submissions.forEach(s => {
        const prev = map.get(s.studentId);

        if (!prev) {
            map.set(s.studentId, {
                ...s,
                attempts: [s],
                attemptCount: 1,
            });
        } else {
            prev.attempts.push(s);
            prev.attemptCount++;

            // lấy bài mới nhất làm đại diện
            if (
                s.submittedAt.toMillis() >
                prev.submittedAt.toMillis()
            ) {
                map.set(s.studentId, {
                    ...s,
                    attempts: prev.attempts,
                    attemptCount: prev.attemptCount,
                });
            }
        }
    });

    return Array.from(map.values());
}
