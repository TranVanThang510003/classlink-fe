'use client';

import { QuizQuestion } from "@/types/quiz";
import { Tag } from "antd";

export default function QuestionList({
                                         questions,
                                     }: {
    questions: QuizQuestion[];
}) {
    return (
        <div className="space-y-4">
            {questions.map((q, i) => (
                <div
                    key={q.id}
                    className="border p-4 rounded-lg bg-white"
                >
                    <div className="font-semibold mb-2">
                        {i + 1}. {q.question}
                    </div>

                    <ul className="space-y-1">
                        {q.options.map((op, idx) => (
                            <li
                                key={idx}
                                className="flex items-center gap-2"
                            >
                                {op}
                                {idx === q.correctIndex && (
                                    <Tag color="green">Correct</Tag>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
