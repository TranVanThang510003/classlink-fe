// types/assignment.ts
export type Assignment = {
    id: string;
    classId: string;
    title: string;
    description?: string;
    dueDate?: Date | null;
    status: "draft" | "published";
    createdBy: string;
    createdAt?: any;
};
