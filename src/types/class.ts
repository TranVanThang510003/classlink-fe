import { Timestamp } from "firebase/firestore";

export type Class = {
    id: string;
    name: string;
    description?: string;

    instructorId: string;
    studentIds: string[];

    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type CreateClassPayload = {
    name: string;
    description?: string;
    instructorId: string;
};
