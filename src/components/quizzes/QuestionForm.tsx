'use client';

import { useState } from "react";
import { Button, Input, Radio } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function QuestionForm({
                                         quizId,
                                         onCreated,
                                     }: {
    quizId: string;
    onCreated: () => void;
}) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const createQuestion = async () => {
        if (!question.trim()) {
            toast.error("Question is required");
            return;
        }

        if (options.some(o => !o.trim())) {
            toast.error("All options are required");
            return;
        }

        setLoading(true);
        await addDoc(collection(db, "quizQuestions"), {
            quizId,
            question,
            options,
            correctIndex,
        });

        toast.success("Question added");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectIndex(0);
        setLoading(false);
        onCreated();
    };

    return (
        <div className="space-y-4 border p-4 rounded-xl bg-gray-50">
            <Input.TextArea
                rows={2}
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <Radio.Group
                value={correctIndex}
                onChange={(e) => setCorrectIndex(e.target.value)}
                className="w-full space-y-2"
            >
                {options.map((opt, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <Radio value={i} />
                        <Input
                            placeholder={`Option ${i + 1}`}
                            value={opt}
                            onChange={(e) => {
                                const copy = [...options];
                                copy[i] = e.target.value;
                                setOptions(copy);
                            }}
                        />
                    </div>
                ))}
            </Radio.Group>

            <Button
                type="primary"
                loading={loading}
                onClick={createQuestion}
            >
                Add Question
            </Button>
        </div>
    );
}
