'use client';

import { useState } from "react";
import { Button, Input, Modal } from "antd";
import toast from "react-hot-toast";

import { quizService } from "@/services/quiz/quizService";
import { useClassContext } from "@/contexts/ClassContext";
import { useAuthContext } from "@/contexts/AuthContext";

import SectionCard from "@/components/quizzes/SectionCard";
import QuizSettings from "@/components/quizzes/QuizSettings";

type Question = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
};

export default function CreateQuizPage() {
    /* ================= STATE ================= */
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [duration, setDuration] = useState(15);
    const [maxAttempts, setMaxAttempts] = useState(1);

    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [openAt, setOpenAt] = useState<Date | null>(null);
    const [closeAt, setCloseAt] = useState<Date | null>(null);

    const [loading, setLoading] = useState(false);

    const { uid } = useAuthContext();
    const { activeClassId } = useClassContext();

    /* ================= QUESTION ================= */
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

    const updateQuestion = (id: string, data: Partial<Question>) => {
        setQuestions(qs =>
            qs.map(q => (q.id === id ? { ...q, ...data } : q))
        );
    };

    /* ================= SUBMIT ================= */
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
            toast.error("Class not selected");
            return;
        }

        const ok = window.confirm(
            `Create quiz?\n\nTitle: ${title}\nStatus: ${status}`
        );

        if (!ok) return;

        setLoading(true);

        try {
            await quizService({
                title,
                description,
                classId: activeClassId,
                duration,
                maxAttempts,
                status,
                openAt,
                closeAt,
                createdBy: uid!,
                questions,
            });

            toast.success("Quiz created successfully");
            window.history.back(); // hoặc router.back()
        } catch (err) {
            console.error(err);
            toast.error("Failed to create quiz");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-3xl font-semibold">Quiz Builder</h2>

            {/* STEP 1: INFO */}
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
                <Input
                    type="number"
                    min={1}
                    addonAfter="minutes"
                    placeholder="Duration"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                />
                <Input
                    type="number"
                    min={1}
                    addonAfter="attempts"
                    placeholder="Max attempts"
                    value={maxAttempts}
                    onChange={e => setMaxAttempts(Number(e.target.value))}
                />
            </SectionCard>

            {/* STEP 2: PUBLISH */}
            <SectionCard step={2} title="Publish Settings">
                <QuizSettings
                    status={status}
                    setStatus={setStatus}
                    openAt={openAt}
                    setOpenAt={setOpenAt}
                    closeAt={closeAt}
                    setCloseAt={setCloseAt}
                />
            </SectionCard>

            {/* STEP 3: QUESTIONS */}
            <SectionCard
                step={3}
                title={`Questions (${questions.length})`}
                extra={<Button onClick={addQuestion}>+ Add Question</Button>}
            >
                {questions.map((q, index) => (
                    <div
                        key={q.id}
                        className="rounded-lg border p-4 space-y-3"
                    >
                        <Input
                            placeholder={`Question ${index + 1}`}
                            value={q.text}
                            onChange={e =>
                                updateQuestion(q.id, { text: e.target.value })
                            }
                        />

                        {q.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={q.correctAnswer === i}
                                    onChange={() =>
                                        updateQuestion(q.id, {
                                            correctAnswer: i,
                                        })
                                    }
                                />
                                <Input
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={e => {
                                        const newOpts = [...q.options];
                                        newOpts[i] = e.target.value;
                                        updateQuestion(q.id, {
                                            options: newOpts,
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </SectionCard>

            {/* ACTION */}
            <div className="flex justify-end gap-2">
                <Button onClick={() => window.history.back()} disabled={loading}>
                    Cancel
                </Button>
                <Button type="primary" onClick={submit} loading={loading}>
                    Create Quiz
                </Button>
            </div>
        </div>
    );
}
