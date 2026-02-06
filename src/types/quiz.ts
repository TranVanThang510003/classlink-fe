import {Timestamp} from "firebase/firestore";

export type Quiz = {
    id: string;
    classId: string;
    title: string;
    duration: number; // minutes
    status: "draft" | "published";
    description: string;
    createdBy: string;
    maxAttempts: number;
    createdAt: Timestamp;
    openAt: Timestamp;
    closeAt: Timestamp;
    totalQuestions: number;
};

export type QuizQuestion = {
    id: string;
    text: string;
    quizId: string;
    options: string[];
    correctAnswer: number;
};


export type Submission = {
    id: string;
    quizId: string;
    classId: string;
    studentId: string;
    student?: {
        name?: string;
        email?: string;
    };
    answers: number[];
    correctCount: number;
    totalQuestions: number;

    score: number;
    submittedAt: Timestamp;
};

export type StudentSubmissionGroup = Submission & {
    attempts: Submission[];
    attemptCount: number;
};
export type QuizFormQuestion = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
};

export type QuizFormData = {
    title: string;
    description?: string;
    duration: number;
    maxAttempts: number;
    status: "draft" | "published";
    openAt: Date | null;
    closeAt: Date | null;
    questions: QuizFormQuestion[];
};
