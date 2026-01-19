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

    // ✅ luôn là array (dễ render)
    attachments?: AssignmentAttachment[];

    dueDate?: Date | null;
    status: "draft" | "published";
    createdBy: string;
    createdAt?: Date | null;
};
