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

    dueDate?: Timestamp| null;
    status: "draft" | "published";
    createdBy: string;
    createdAt?: Timestamp| null;
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
    submittedAt?: Timestamp | null ;
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
    submittedAt:Timestamp | null;
    dueDate?:  Timestamp | null;
    score?: number;
    feedback?: string;
};
