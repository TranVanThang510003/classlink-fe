'use client';
import { useState } from "react";
import { Button, Radio } from "antd";
import { QuizQuestion } from "@/types/quiz";

export default function QuizPlayer({
                                       questions,
                                       onSubmit,
                                   }: {
    questions: QuizQuestion[];
    onSubmit: (answers: number[]) => void;
}) {
    const [answers, setAnswers] = useState<number[]>(
        Array(questions.length).fill(-1)
    );

    return (
        <div className="space-y-6">
            {questions.map((q, i) => (
                    <div key={q.id}>
                    <div className="font-semibold mb-2">
                        {i + 1}. {q.question}
    </div>
    <Radio.Group
    onChange={e => {
        const copy = [...answers];
        copy[i] = e.target.value;
        setAnswers(copy);
    }}
    value={answers[i]}
        >
        {q.options.map((op, idx) => (
                <Radio key={idx} value={idx}>
            {op}
            </Radio>
))}
    </Radio.Group>
    </div>
))}

    <Button type="primary" onClick={() => onSubmit(answers)}>
    Submit Quiz
    </Button>
    </div>
);
}
