export type Quiz = {
    id: string;
    classId: string;
    title: string;
    duration: number; // minutes
    published: boolean;
    createdBy: string;
    maxAttempts: number;
    createdAt: any;
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
