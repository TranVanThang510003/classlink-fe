import type { UploadFile } from "antd/es/upload/interface";
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

    dueDate?: Date | null;
    status: "draft" | "published";
    createdBy: string;
    createdAt?: Date | null;
};

export type AssignmentSubmission = {
    id: string;
    assignmentId: string;

    // HTML từ TipTap
    content?: string;

    attachments?: AssignmentSubmissionAttachment[];

    submittedBy: string;
    submittedAt?: Date | null;

    // 🔥 mở rộng tương lai
    score?: number;
    teacherComment?: string;
};
export type SubmitAssignmentPayload = {
    assignmentId: string;
    classId: string;
    content: string;
    files?: UploadFile[];
    submittedBy: string;
};

export type AssignmentSubmissionAttachment = {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
};
export type SubmitAssignmentServicePayload = {
    assignmentId: string;
    classId: string;
    content: string;
    attachments: AssignmentSubmissionAttachment[];
    submittedBy: string;
};


export type CreateAssignmentPayload = {
    classId: string;
    title: string;
    description?: string;
    dueDate?: Date | null;
    attachments?: AssignmentAttachment[];
    status: "draft" | "published";
    createdBy: string;
};