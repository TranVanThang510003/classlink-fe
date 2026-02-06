import {deleteDoc, doc, serverTimestamp, Timestamp, updateDoc} from "firebase/firestore";
import {UploadFile} from "antd/es/upload/interface";

export type DocumentAttachment = {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
};

export interface Document {
    id: string;
    classId: string;
    title: string;
    description?: string;
    attachments: DocumentAttachment[];
    status: "published" | "draft";
    createdBy: string;
    createdAt?: Date |Timestamp| null;
}


export interface UploadDocumentPayload {
    classId: string;
    title: string;
    description?: string;
    attachments?: DocumentAttachment[]
    status: "published" | "draft";
    createdBy: string;
}


export interface UploadDocumentForm {
    classId: string;
    title: string;
    description?: string;
    files?: UploadFile[];
    status: "published" | "draft";
    createdBy: string;
}

export type DocumentItem = {
    id: string;
    title: string;
    classId: string;
    description?: string;
    status: "draft" | "published";
    attachments?: DocumentAttachment[];
};
