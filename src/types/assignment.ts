import {Timestamp} from "firebase/firestore";

export type AssignmentAttachment = {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
};

export type Assignment = {
    id: string;
    classId: string;
    title: string;
    description?: string;

    // luôn là array (dễ render)
    attachments?: AssignmentAttachment[];

    dueDate?: Date |Timestamp| null;
    status: "draft" | "published";
    createdBy: string;
    createdAt?: Date |Timestamp| null;
};
export interface StudentAssignment extends Assignment {
    submission?: AssignmentSubmission | null;
}

export type AssignmentSubmission = {
    id: string;
    assignmentId: string;

    // HTML từ TipTap
    content?: string;

    attachments?: AssignmentSubmissionAttachment[];

    submittedBy: string;
    submittedAt?: Date | null;

    score?: number;
    teacherComment?: string;
};


export type AssignmentSubmissionAttachment = {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
};


export type TeacherSubmissionListItem = {
    id: string;
    assignmentId: string;
    classId: string;
    submittedBy: string;
    studentName?: string;
    submittedAt: Date | null;
    dueDate?: Date | Timestamp | null;
    score?: number;
    feedback?: string;
};
