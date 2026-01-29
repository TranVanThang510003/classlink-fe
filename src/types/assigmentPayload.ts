import type {UploadFile} from "antd/es/upload/interface";
import {AssignmentSubmissionAttachment} from "@/types/assignment";

export type SubmitAssignmentPayload = {
    assignmentId: string;
    classId: string;
    content: string;
    files?: UploadFile[];
    submittedBy: string;
};
export type SubmitAssignmentServicePayload = {
    assignmentId: string;
    classId: string;
    content: string;
    attachments: AssignmentSubmissionAttachment[];
    submittedBy: string;
};


export interface CreateAssignmentPayload {
    classId: string;
    title: string;
    description?: string;
    attachments?: {
        fileUrl: string;
        fileName: string;
        fileType: string;
        fileSize: number;
    }[];
    dueDate?: Date | null;
    createdBy: string;
}

