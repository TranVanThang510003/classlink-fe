'use client';

import { useEffect, useState } from "react";
import { Button, Input } from "antd";
import toast from "react-hot-toast";

import SectionCard from "@/components/quizzes/SectionCard";
import QuizSettings from "@/components/quizzes/QuizSettings";
import {QuizFormData,QuizFormQuestion } from "@/types/quiz";

/* ================= TYPES ================= */


type QuizFormProps = {
    mode: "create" | "edit";
    initialData?: QuizFormData;
    onSubmit: (data: QuizFormData) => Promise<void>;
};


let tempId = 0; // 🔥 dùng cho question mới

export default function QuizForm({
                                     mode,
                                     initialData,
                                     onSubmit,
                                 }: QuizFormProps) {

    /* ================= STATE ================= */
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<QuizFormQuestion[]>([]);
    const [duration, setDuration] = useState(15);
    const [maxAttempts, setMaxAttempts] = useState(1);

    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [openAt, setOpenAt] = useState<Date | null>(null);
    const [closeAt, setCloseAt] = useState<Date | null>(null);

    const [loading, setLoading] = useState(false);

    /* ================= INIT (EDIT MODE) ================= */
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description ?? "");
            setDuration(initialData.duration);
            setMaxAttempts(initialData.maxAttempts);
            setStatus(initialData.status);
            setOpenAt(initialData.openAt);
            setCloseAt(initialData.closeAt);

            // 🔥 GIỮ NGUYÊN Firestore ID
            setQuestions(
                initialData.questions.map(q => ({
                    ...q,
                }))
            );
        }
    }, [mode, initialData]);

    /* ================= QUESTION ================= */

    const addQuestion = () => {
        setQuestions(qs => [
            ...qs,
            {
                id: `temp_${tempId++}`, // 🟡 question mới
                text: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
            },
        ]);
    };

    const updateQuestion = (id: string, data: Partial<QuizFormQuestion >) => {
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

        setLoading(true);

        try {
            await onSubmit({
                title,
                description,
                duration,
                maxAttempts,
                status,
                openAt,
                closeAt,
                questions, // 🔥 TRẢ RA CẢ ID → page xử lý create/update
            });

            toast.success(
                mode === "create" ? "Quiz created" : "Quiz updated"
            );
        } catch (err) {
            console.error(err);
            toast.error("Failed to save quiz");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-3xl font-semibold">
                {mode === "create" ? "Quiz Builder" : "Update Quiz"}
            </h2>

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
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                />
                <Input
                    type="number"
                    min={1}
                    addonAfter="attempts"
                    value={maxAttempts}
                    onChange={e => setMaxAttempts(Number(e.target.value))}
                />
            </SectionCard>

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

            <SectionCard
                step={3}
                title={`Questions (${questions.length})`}
                extra={<Button onClick={addQuestion}>+ Add Question</Button>}
            >
                {questions.map((q, index) => (
                    <div key={q.id} className="border p-4 space-y-3">
                        <Input
                            placeholder={`Question ${index + 1}`}
                            value={q.text}
                            onChange={e =>
                                updateQuestion(q.id, { text: e.target.value })
                            }
                        />

                        {q.options.map((opt, i) => (
                            <div key={i} className="flex gap-2 items-center">
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
                                    value={opt}
                                    onChange={e => {
                                        const opts = [...q.options];
                                        opts[i] = e.target.value;
                                        updateQuestion(q.id, { options: opts });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </SectionCard>

            <div className="flex justify-end gap-2">
                <Button onClick={() => history.back()}>
                    Cancel
                </Button>
                <Button type="primary" loading={loading} onClick={submit}>
                    {mode === "create" ? "Create Quiz" : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
