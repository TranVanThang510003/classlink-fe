'use client';

import { useState } from "react";
import { Button, Input, Spin, Tag } from "antd";
import toast from "react-hot-toast";
import { createQuiz } from "@/services/quiz/createQuiz";
import {useClassContext} from "@/contexts/ClassContext";
import {useAuthContext} from "@/contexts/AuthContext";

function SectionCard({
                         step,
                         title,
                         extra,
                         children,
                     }: {
    step: number;
    title: string;
    extra?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-emerald-300 bg-white">
            <div className="flex items-center justify-between border-b border-emerald-200 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-semibold text-white">
                        {step}
                    </div>
                    <h3 className="font-semibold text-emerald-700">
                        {title}
                    </h3>
                </div>
                {extra}
            </div>
            <div className="p-4 space-y-4">{children}</div>
        </div>
    );
}

export default function CreateQuizPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const {uid} = useAuthContext()
    const {activeClassId} = useClassContext()
    const addQuestion = () => {
        setQuestions(qs => [
            ...qs,
            {
                id: crypto.randomUUID(),
                text: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
            },
        ]);
    };

    const updateQuestion = (id: string, data: any) => {
        setQuestions(qs =>
            qs.map(q => (q.id === id ? { ...q, ...data } : q))
        );
    };

    const submit = async () => {
        if (!title.trim()) {
            toast.error("Quiz title is required");
            return;
        }

        if (questions.length === 0) {
            toast.error("Add at least one question");
            return;
        }
        if (!activeClassId) {
            throw new Error("classId is required");
        }

        setLoading(true);

        try {
            const quizId = await createQuiz({
                title,
                description,
                classId: activeClassId!,   // 👈 cực quan trọng
                createdBy: uid!,           // 👈 cực quan trọng
                questions,
            });


            toast.success("Quiz created successfully");
            console.log("QuizId:", quizId);
            // router.push(`/instructor/quizzes/${quizId}`) nếu muốn
        } catch (err) {
            console.error(err);
            toast.error("Failed to create quiz");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-3xl font-semibold">Quiz Builder</h2>

            {/* STEP 1 */}
            <SectionCard step={1} title="Quiz Info">
                <Input
                    placeholder="Quiz title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <Input.TextArea
                    rows={3}
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </SectionCard>

            {/* STEP 2 */}
            <SectionCard
                step={2}
                title={`Questions (${questions.length})`}
                extra={
                    <Button onClick={addQuestion}>+ Add Question</Button>
                }
            >
                {questions.map((q, index) => (
                    <div key={q.id} className="rounded-lg border p-4 space-y-3">
                        <Input
                            placeholder={`Question ${index + 1}`}
                            value={q.text}
                            onChange={e =>
                                updateQuestion(q.id, { text: e.target.value })
                            }
                        />

                        {q.options.map((opt: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={q.correctAnswer === i}
                                    onChange={() =>
                                        updateQuestion(q.id, { correctAnswer: i })
                                    }
                                />
                                <Input
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={e => {
                                        const newOpts = [...q.options];
                                        newOpts[i] = e.target.value;
                                        updateQuestion(q.id, { options: newOpts });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </SectionCard>

            <div className="flex justify-end">
                <Button
                    type="primary"
                    loading={loading}
                    onClick={submit}
                >
                    Create Quiz
                </Button>
            </div>
        </div>
    );
}
