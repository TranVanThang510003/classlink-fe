'use client';

import { Button, Input, Switch, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useClassContext } from "@/contexts/ClassContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CreateQuizPage() {
    const router = useRouter();
    const { uid } = useAuthContext();
    const { activeClassId } = useClassContext();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        timeLimit: 15,
        allowRetry: true,
        showAnswer: false,
    });

    if (!activeClassId) {
        return <div>Please select a class first</div>;
    }

    const createQuiz = async () => {
        if (!uid) return;

        setLoading(true);

        const ref = await addDoc(collection(db, "quizzes"), {
            ...form,
            classId: activeClassId,
            status: "draft",
            createdBy: uid,
            createdAt: serverTimestamp(),
        });

        router.push(`/instructor/tests/${ref.id}`);
    };

    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-3xl font-semibold">Create Quiz</h2>

            <Input
                placeholder="Quiz title"
                value={form.title}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
            />

            <Input.TextArea
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                }
            />

            <div className="flex justify-between">
                <span>Allow retry</span>
                <Switch
                    checked={form.allowRetry}
                    onChange={(v) =>
                        setForm({ ...form, allowRetry: v })
                    }
                />
            </div>

            <div className="flex justify-between">
                <span>Show answer after submit</span>
                <Switch
                    checked={form.showAnswer}
                    onChange={(v) =>
                        setForm({ ...form, showAnswer: v })
                    }
                />
            </div>

            <Button
                type="primary"
                loading={loading}
                onClick={createQuiz}
            >
                Create & Add Questions →
            </Button>
        </div>
    );
}
