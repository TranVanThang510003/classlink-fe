export interface DocumentItem {
    id: string;
    classId: string;
    title: string;
    description?: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    visibility: "public" | "private";
    createdBy: string;
    createdAt?: any;
}
