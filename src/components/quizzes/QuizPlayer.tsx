'use client';

import { useEffect, useState } from "react";
import { Button, Spin, Progress } from "antd";
import { useSubmitQuiz } from "@/hooks/quiz/useSubmitQuiz";
import type { Quiz, QuizQuestion } from "@/types/quiz";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { AiOutlineClockCircle } from "react-icons/ai";

dayjs.extend(utc);

type Props = {
    quiz: Quiz;
    questions: QuizQuestion[];
    studentId: string;
};

const MAX_VISIBLE = 14;
const WARNING_TIME = 300; // 1 phút

export default function QuizPlayer({ quiz, questions, studentId }: Props) {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<number[]>(
        Array(questions.length).fill(-1)
    );
    const [remain, setRemain] = useState(quiz.duration * 60);
    const [showAll, setShowAll] = useState(false);

    const { submit, loading } = useSubmitQuiz();
    const question = questions[current];

    /* ===== TIMER ===== */
    useEffect(() => {
        const t = setInterval(() => {
            setRemain(r => Math.max(0, r - 1));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const answeredCount = answers.filter(a => a !== -1).length;
    const isDangerTime = remain <= WARNING_TIME;

    const visibleQuestions = showAll
        ? questions
        : questions.slice(0, MAX_VISIBLE);

    // nếu đang ở câu > 20 mà thu gọn → kéo về 20
    useEffect(() => {
        if (!showAll && current >= MAX_VISIBLE) {
            setCurrent(MAX_VISIBLE - 1);
        }
    }, [showAll, current]);

    const onSubmit = async () => {
        const correctAnswers = questions.map(q => q.correctIndex);
        await submit({ quizId: quiz.id, studentId, answers, correctAnswers });
    };

    if (!question) return <Spin />;

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">

            {/* ===== TOP BAR ===== */}
            <div className="flex justify-between items-center mb-6">
                <div
                    className={`flex items-center gap-2 text-sm font-medium ${
                        isDangerTime ? "text-red-600" : "text-gray-600"
                    }`}
                >
                    <AiOutlineClockCircle
                        className={`text-2xl ${isDangerTime ? "text-red-600" : ""}`}
                    />
                    <span>Time remaining:</span>
                    <span className="font-semibold">
            {dayjs(remain * 1000).utc().format("HH:mm:ss")}
          </span>
                </div>

                <Button
                    type="primary"
                    className="!bg-[#1f3d2b]"
                    onClick={onSubmit}
                    loading={loading}
                >
                    SUBMIT
                </Button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="flex gap-20 items-center">
                {/* LEFT */}
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">
                        Question {current + 1} of {questions.length}
                    </p>

                    <p className="text-gray-800 leading-relaxed mb-6">
                        {question.question}
                    </p>

                    {/* OPTIONS */}
                    <div className="grid grid-cols-2 gap-4">
                        {question.options.map((opt, idx) => {
                            const selected = answers[current] === idx;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        const next = [...answers];
                                        next[current] = idx;
                                        setAnswers(next);
                                    }}
                                    className={`
                    cursor-pointer rounded-xl border px-5 py-4 transition
                    ${selected
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-200 hover:border-gray-400"}
                  `}
                                >
                  <span className="text-sm text-gray-600 mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                                    <span className="text-gray-800">{opt}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT */}
                <Progress
                    type="circle"
                    size={100}
                    strokeWidth={10}
                    strokeColor="#1f3d2b"
                    percent={(answeredCount / questions.length) * 100}
                    format={() => `${answeredCount}/${questions.length}`}
                />
            </div>


            {/* ===== NAVIGATION ===== */}
            <div className="mt-10 flex justify-center items-start gap-4">

                {/* PREV */}
                <Button
                    disabled={current === 0}
                    onClick={() => setCurrent(c => c - 1)}
                >
                    Prev
                </Button>

                {/* QUESTION NUMBERS */}
                <div className="flex flex-wrap justify-center gap-2 max-w-[720px]">
                    {visibleQuestions.map((_, i) => (
                        <Button
                            key={i}
                            shape="square"
                            type={i === current ? "primary" : "default"}
                            className={i === current ? "!bg-[#1f3d2b]" : ""}
                            onClick={() => setCurrent(i)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>

                {/* NEXT */}
                <Button
                    disabled={current === questions.length - 1}
                    onClick={() => {
                        if (!showAll && current === MAX_VISIBLE - 1) {
                            setShowAll(true);
                            setCurrent(MAX_VISIBLE);
                            return;
                        }
                        setCurrent(c => c + 1);
                    }}
                >
                    Next
                </Button>

            </div>

            {/* SEE ALL */}
            {questions.length > MAX_VISIBLE && (
                <div className="mt-2 text-center">
                    <Button
                        type="link"
                        onClick={() => setShowAll(v => !v)}
                    >
                        {showAll ? "Show less" : "See all"}
                    </Button>
                </div>
            )}

        </div>
    );
}
