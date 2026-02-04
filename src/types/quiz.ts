export type Quiz = {
    id: string;
    classId: string;
    title: string;
    duration: number; // minutes
    status: "draft" | "published";
    description: string;
    createdBy: string;
    maxAttempts: number;
    createdAt: any;
    closeAt?: any;
    openAt?: any;
    totalQuestions: number;
};

export type QuizQuestion = {
    id: string;
    quizId: string;
    question: string;
    options: string[];
    correctAnswer: number;
};

export type QuizSubmission = {
    quizId: string;
    studentId: string;
    answers: number[];
    score: number;
    submittedAt: any;
};
